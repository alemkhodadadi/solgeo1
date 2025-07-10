<script setup lang="ts">
    import { ref, onMounted, watch } from 'vue';
    import axios from 'axios';
    import 'chartjs-adapter-luxon';
    import { DateTime } from 'luxon';
    import zoomPlugin from 'chartjs-plugin-zoom';
    import { useAppStore } from '@/store';
    import { storeToRefs } from 'pinia';
    import { useAppTheme } from '@/utils';

    // Chart.js core
    import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, LinearScale, TimeScale, CategoryScale, LineController } from 'chart.js';
    import { Line } from 'vue-chartjs';

    const style = getComputedStyle(document.documentElement);
    const chartTheme = ref({
        fontFamily: 'Inter',
        textColor: style.getPropertyValue('--text-color').trim(),
        axisColor: style.getPropertyValue('--text-color-secondary').trim(),
        backgroundColor: style.getPropertyValue('--surface-card').trim(),
        tooltipBg: style.getPropertyValue('--surface-overlay').trim(),
        borderColor: style.getPropertyValue('--surface-border').trim(),
        gridColor: style.getPropertyValue('--surface-border').trim(),
        primaryColor: style.getPropertyValue('--primary-color').trim(),
        hoverBg: style.getPropertyValue('--surface-hover').trim(),
    });
    console.log('colors:', {
        textColor: chartTheme.value.textColor,
        tooltipBg: chartTheme.value.tooltipBg,
    });

    // Register components
    ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, LinearScale, TimeScale, CategoryScale, LineController, zoomPlugin);

    function toLocalDateString(unix: number): string {
        const d = new Date(unix);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Chart references to sync zoom
    const blUChartRef = ref<any>(null);
    const blEChartRef = ref<any>(null);
    const blNChartRef = ref<any>(null);

    const hoverTarget = ref<{ x: number; y: number } | null>(null);
    const parsedXRef = ref(null);

    // Trigger redraw when hoverTarget changes
    watch(
        hoverTarget,
        () => {
            [blUChartRef.value, blEChartRef.value, blNChartRef.value].forEach((c) => {
                if (c?.chart) c.chart.update('none');
            });
        },
        { flush: 'post' }
    );

    function getThemeColor(varName: string): string {
        const computed = getComputedStyle(document.documentElement);
        return computed.getPropertyValue(varName).trim();
    }

    const appStore = useAppStore();
    const { layoutConfig } = storeToRefs(appStore);

    watch(
        () => layoutConfig.value.darkTheme,
        (newVal, oldVal) => {
            console.log(oldVal, '->', newVal);
            console.log('Theme mode changed:', layoutConfig.value);
            const primaryColor = getThemeColor('--primary-color');
            const surfaceColor = getThemeColor('--surface-overlay');

            chartTheme.value = {
                fontFamily: 'Inter',
                textColor: style.getPropertyValue('--text-color').trim(),
                axisColor: style.getPropertyValue('--text-color-secondary').trim(),
                backgroundColor: style.getPropertyValue('--surface-card').trim(),
                tooltipBg: style.getPropertyValue('--surface-overlay').trim(),
                borderColor: style.getPropertyValue('--surface-border').trim(),
                gridColor: style.getPropertyValue('--surface-border').trim(),
                primaryColor: style.getPropertyValue('--primary-color').trim(),
                hoverBg: style.getPropertyValue('--surface-hover').trim(),
            };
            console.log('bakcgroundcolor changed:', style.getPropertyValue('--surface-card').trim());
            console.log('tooltipBg changed:', style.getPropertyValue('--surface-overlay').trim());
        }
    );

    const crosshairPlugin = {
        id: 'hoverCrosshair',

        afterEvent(chart, args) {
            const evt = args.event;
            const points = chart.getElementsAtEventForMode(evt, 'nearest', { intersect: false }, false);
            if (!points.length) {
                if (hoverTarget.value !== null) hoverTarget.value = null;
                return;
            }

            const parsed = points[0].element.$context.parsed;

            // Only update if position changed
            if (!hoverTarget.value || hoverTarget.value.x !== parsed.x || hoverTarget.value.y !== parsed.y) {
                hoverTarget.value = { x: parsed.x, y: parsed.y };
            }
        },

        afterDraw(chart) {
            if (!hoverTarget.value) return;

            const { x } = hoverTarget.value;

            const pixelX = chart.scales.x.getPixelForValue(x);
            const dataset = chart.data.datasets[0];
            const index = dataset.data.findIndex((d) => d.x === toLocalDateString(x));
            const dataAtX = dataset.data[index];
            if (!dataAtX) return;

            const y = dataAtX.y;
            const pixelY = chart.scales.y.getPixelForValue(y);

            const ctx = chart.ctx;
            const area = chart.chartArea;

            if (index !== -1) {
                chart.tooltip.setActiveElements([{ datasetIndex: 0, index }], {
                    x: pixelX,
                    y: pixelY,
                });
            }

            ctx.save();
            ctx.setLineDash([5, 5]);
            ctx.strokeStyle = chartTheme.value.axisColor;
            ctx.lineWidth = 1;

            // Draw vertical line
            ctx.beginPath();
            ctx.moveTo(pixelX, area.top);
            ctx.lineTo(pixelX, area.bottom);
            ctx.stroke();

            // Draw horizontal line
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
        maintainAspectRatio: false,
        interaction: {
            mode: 'nearest',
            intersect: false,
            axis: 'xy',
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                titleFont: { family: chartTheme.value.fontFamily, weight: 'bold' },
                bodyFont: { family: chartTheme.value.fontFamily },

                borderColor: chartTheme.value.axisColor,
                borderWidth: 1,
                enabled: true,
                mode: 'nearest',
                intersect: false,
                displayColors: true, // set to false to remove dots
                callbacks: {
                    title(tooltipItems) {
                        const raw = tooltipItems[0].raw;
                        const dt = DateTime.fromISO(raw.x);
                        return `Date: ${dt.toFormat('dd/LL/yyyy, HH:mm:ss')}`;
                    },
                    label(tooltipItem) {
                        console.log(tooltipItem);
                        const raw = tooltipItem.raw;
                        const y = typeof raw === 'object' && raw !== null && 'y' in raw ? raw.y : null;
                        console.log('y:', y);
                        if (typeof y === 'number') {
                            return `ΔHEIGHT: ${y.toFixed(4)} m`;
                        }

                        return 'ΔHEIGHT: N/A';
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
                    onPanComplete({ chart }) {
                        const xScale = chart.scales.x;
                        const newMin = xScale.min;
                        const newMax = xScale.max;

                        const charts = [blUChartRef.value, blEChartRef.value, blNChartRef.value];

                        for (const c of charts) {
                            if (!c || c.chart === chart) continue;

                            const targetChart = c.chart;

                            // 👇 Pan to match the new visible window instead of setting min/max manually
                            targetChart.zoomScale('x', {
                                min: newMin,
                                max: newMax,
                            });

                            // 👇 Optional: add animation
                            targetChart.options.animation = {
                                duration: 200,
                                easing: 'easeOutCubic',
                            };

                            targetChart.update();
                        }
                    },
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
                    font: {
                        family: chartTheme.value.fontFamily,
                        size: 10,
                        weight: 'bold',
                    },
                    color: chartTheme.value.axisColor,
                    callback(this: any, val: number) {
                        const raw = this.getLabelForValue(val);
                        const dt = DateTime.fromISO(raw);
                        const rangeDays = (this.max - this.min) / (1000 * 60 * 60 * 24);
                        console.log('rangedays is:', rangeDays);
                        return dt.toFormat('dd MMM');
                    },
                    maxTicksLimit: 10,
                },
                title: {
                    color: chartTheme.value.axisColor,
                    font: {
                        family: chartTheme.value.fontFamily,
                        size: 12,
                        weight: 'bold',
                    },
                },
                grid: {
                    color: chartTheme.value.borderColor,
                    lineWidth: 0.5,
                },
            },
            y: {
                ticks: {
                    color: chartTheme.value.axisColor,
                    font: {
                        family: chartTheme.value.fontFamily,
                        size: 10,
                        weight: 'bold',
                    },
                },
                title: {
                    color: chartTheme.value.textColor,
                    font: {
                        family: chartTheme.value.fontFamily,
                        size: 12,
                        weight: 'bold',
                    },
                },
                grid: {
                    color: chartTheme.value.borderColor,
                    lineWidth: 0.5,
                },
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
                const x = DateTime.fromSeconds(point.refDateTime).toISO(); // local ISO string
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
                { blU: [], blE: [], blN: [] } as {
                    blU: LineChartData;
                    blE: LineChartData;
                    blN: LineChartData;
                }
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
            console.log(response.data);
            const data = mapGnssDisplacement(response.data);
            console.log('data after function:', data);
            blUChartData.value = {
                datasets: [
                    {
                        label: 'Δ blU',
                        data: data.blU,
                        borderColor: 'green',
                        backgroundColor: 'green',
                        showLine: false,
                        fill: false,
                        pointRadius: 2,
                        pointHoverRadius: 4,
                    },
                ],
            };

            blEChartData.value = {
                datasets: [
                    {
                        label: 'Δ blE',
                        data: data.blE,
                        borderColor: 'orange',
                        backgroundColor: 'orange',
                        showLine: false,
                        fill: false,
                        pointRadius: 2,
                        pointHoverRadius: 4,
                    },
                ],
            };

            blNChartData.value = {
                datasets: [
                    {
                        label: 'Δ blN',
                        data: data.blN,
                        borderColor: '#0051ffd4',
                        backgroundColor: '#0051ffd4',
                        showLine: false,
                        fill: false,
                        pointRadius: 2,
                        pointHoverRadius: 4,
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
        <div class="h-[12rem] w-full relative">
            <Line ref="blUChartRef" v-if="blUChartData" :data="blUChartData" :options="chartOptions" />
        </div>
        <div class="h-[12rem] w-full relative">
            <Line ref="blEChartRef" v-if="blEChartData" :data="blEChartData" :options="chartOptions" />
        </div>
        <div class="h-[12rem] w-full relative">
            <Line ref="blNChartRef" v-if="blNChartData" :data="blNChartData" :options="chartOptions" />
        </div>
    </div>
</template>
