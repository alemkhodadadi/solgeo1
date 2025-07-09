<script setup lang="ts">
    import { ref, onMounted, watch } from 'vue';
    import axios from 'axios';
    import 'chartjs-adapter-luxon';
    import { DateTime } from 'luxon';
    import zoomPlugin from 'chartjs-plugin-zoom';

    // Chart.js core
    import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, LinearScale, TimeScale, CategoryScale, LineController } from 'chart.js';
    import { Line } from 'vue-chartjs';

    // Register components
    ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, LinearScale, TimeScale, CategoryScale, LineController, zoomPlugin);

    // Chart references to sync zoom
    const blUChartRef = ref<any>(null);
    const blEChartRef = ref<any>(null);
    const blNChartRef = ref<any>(null);
    const hoverPosition = ref<{ x: number } | null>(null);
    const hoveredIndex = ref<any>(null);
    const hoveredX = ref<string | null>(null);

    watch(
        hoverPosition,
        () => {
            [blUChartRef.value, blEChartRef.value, blNChartRef.value].forEach((c) => {
                if (c?.chart) {
                    c.chart.update('none');
                }
            });
        },
        { flush: 'post' }
    );
    // Crosshair plugin
    const crosshairPlugin = {
        id: 'hoverCrosshair',
        afterEvent(chart, args) {
            const evt = args.event;
            const points = chart.getElementsAtEventForMode(evt, 'nearest', { intersect: false }, false);
            if (!points.length) {
                if (hoverPosition.value !== null) hoverPosition.value = null;
                return;
            }

            const point = points[0];
            console.log('point is:', point);
            hoveredIndex.value = point.index;
            const parsed = point.element.$context.parsed;

            if (hoveredIndex.value === point.index && hoverPosition.value?.x === parsed.x) {
                return; // prevent unnecessary update
            }

            hoveredIndex.value = point.index;
            hoverPosition.value = { x: parsed.x }; // only x is needed globally
        },
        afterDraw(chart) {
            if (!hoverPosition.value) return;

            const { x } = hoverPosition.value;
            const pixelX = chart.scales.x.getPixelForValue(x);
            const dataset = chart.data.datasets[0];
            // const index = dataset.data.findIndex((d) => d.x === new Date(x).toISOString().slice(0, 10));

            const dataAtX = dataset.data.find((d) => d.x === new Date(x).toISOString().slice(0, 10));

            if (!dataAtX) return; // ❌ No valid point to draw for this chart

            const y = dataAtX.y;
            const pixelY = chart.scales.y.getPixelForValue(y);
            const ctx = chart.ctx;
            const area = chart.chartArea;

            ctx.save();
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 1;

            // Vertical line
            ctx.beginPath();
            ctx.moveTo(pixelX, area.top);
            ctx.lineTo(pixelX, area.bottom);
            ctx.stroke();

            // Horizontal line
            ctx.beginPath();
            ctx.moveTo(area.left, pixelY);
            ctx.lineTo(area.right, pixelY);
            ctx.stroke();

            ctx.restore();
        },
    };

    ChartJS.register(crosshairPlugin);

    // Common chart options
    const chartOptions = {
        responsive: true,
        interaction: {
            mode: 'nearest',
            intersect: false,
            axis: 'xy',
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                mode: 'nearest',
                intersect: false,
                callbacks: {
                    title(tooltipItems) {
                        return tooltipItems[0].label;
                    },
                    label(tooltipItem) {
                        const val = tooltipItem.raw.y ?? tooltipItem.raw;
                        return `${val.toFixed(3)} m`;
                    },
                },
            },
            zoom: {
                zoom: {
                    wheel: { enabled: true, speed: 0.1 },
                    pinch: { enabled: true },
                    mode: 'x',
                    onZoomComplete({ chart }) {
                        const xScale = chart.scales.x;
                        const newMin = xScale.min;
                        const newMax = xScale.max;

                        const charts = [blUChartRef.value, blEChartRef.value, blNChartRef.value];

                        for (const c of charts) {
                            if (!c || c.chart === chart) continue;

                            const targetChart = c.chart;

                            // 👇 Do zoom without touching min/max manually (preserves zooming)
                            targetChart.zoomScale('x', {
                                min: newMin,
                                max: newMax,
                            });

                            // 👇 Animate the transition AFTER zoom
                            targetChart.options.animation = {
                                duration: 300,
                                easing: 'easeOutCubic',
                            };

                            // 👇 Trigger redraw
                            targetChart.update();
                        }
                    },
                },
                pan: {
                    enabled: true,
                    mode: 'x',
                },
                limits: {
                    x: {
                        min: 'original',
                        max: 'original',
                        minRange: 1,
                    },
                },
            },
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    tooltipFormat: 'yyyy-MM-dd',
                    displayFormats: {
                        day: 'dd',
                        month: 'MMM',
                        year: 'yyyy',
                    },
                },
                ticks: {
                    callback(this: any, val: number) {
                        const raw = this.getLabelForValue(val);
                        const dt = DateTime.fromISO(raw);
                        const rangeDays = (this.max - this.min) / (1000 * 60 * 60 * 24);

                        if (rangeDays > 60) return dt.toFormat('MMM');
                        else if (rangeDays > 10) return dt.toFormat('dd MMM');
                        return dt.toFormat('dd');
                    },
                    maxTicksLimit: 10,
                },
                title: { display: true, text: 'Date' },
            },
            y: {
                title: { display: true, text: 'ΔHEIGHT [m]' },
            },
        },
    };

    // Types
    type GnssPoint = {
        refDateTime: number;
        blU: number;
        blE: number;
        blN: number;
    };

    type LineChartData = {
        x: string;
        y: number;
    }[];

    const blUChartData = ref();
    const blEChartData = ref();
    const blNChartData = ref();

    function mapGnssDisplacement(raw: GnssPoint[]): {
        blU: LineChartData;
        blE: LineChartData;
        blN: LineChartData;
    } {
        if (!raw.length) return { blU: [], blE: [], blN: [] };

        const baseline = raw[0];

        return raw
            .map((point) => {
                const x = new Date(point.refDateTime * 1000).toISOString().split('T')[0];
                return {
                    blU: { x, y: point.blU - baseline.blU },
                    blE: { x, y: point.blE - baseline.blE },
                    blN: { x, y: point.blN - baseline.blN },
                };
            })
            .reduce(
                (acc, cur) => {
                    acc.blU.push(cur.blU);
                    acc.blE.push(cur.blE);
                    acc.blN.push(cur.blN);
                    return acc;
                },
                { blU: [], blE: [], blN: [] } as { blU: LineChartData; blE: LineChartData; blN: LineChartData }
            );
    }

    async function fetchGnssDisplacement() {
        const url = '/api/api/GnssDisplacement/';
        const params = {
            netname: 'BASILICA',
            blname: 'INGR00ITA.GN0100ITA',
            sesslen: 1440,
            stdate: '2025-02-28T00:00:00',
            enddate: '2025-06-28T00:00:00',
        };
        const auth = {
            username: 'solgeo',
            password: 'solgeoBasilica25%',
        };
        const headers = {
            displayceKey: 'RELEASE100_MAG2017_DISPLAYCE_REST_API',
        };

        try {
            const response = await axios.get(url, { params, auth, headers });
            const data = mapGnssDisplacement(response.data);

            blUChartData.value = {
                datasets: [
                    {
                        label: 'Δ blU',
                        data: data.blU,
                        borderColor: 'red',
                        backgroundColor: 'red',
                        showLine: false,
                        fill: false,
                    },
                ],
            };

            blEChartData.value = {
                datasets: [
                    {
                        label: 'Δ blE',
                        data: data.blE,
                        borderColor: 'green',
                        backgroundColor: 'green',
                        showLine: false,
                        fill: false,
                    },
                ],
            };

            blNChartData.value = {
                datasets: [
                    {
                        label: 'Δ blN',
                        data: data.blN,
                        borderColor: 'blue',
                        backgroundColor: 'blue',
                        showLine: false,
                        fill: false,
                    },
                ],
            };
        } catch (err) {
            console.error('API error:', err);
        }
    }

    onMounted(() => {
        fetchGnssDisplacement();
    });
</script>

<template>
    <div class="flex flex-col gap-6">
        <Line ref="blUChartRef" v-if="blUChartData" :data="blUChartData" :options="chartOptions" />
        <Line ref="blEChartRef" v-if="blEChartData" :data="blEChartData" :options="chartOptions" />
        <Line ref="blNChartRef" v-if="blNChartData" :data="blNChartData" :options="chartOptions" />
    </div>
</template>
