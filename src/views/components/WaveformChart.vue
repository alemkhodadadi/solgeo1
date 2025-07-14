<template>
    <Line :data="chartData" id="waveformchart" ref="chartRef" :options="chartOptions" />
</template>

<script setup lang="ts">
    import { onMounted, ref, computed } from 'vue';
    import zoomPlugin from 'chartjs-plugin-zoom';
    import axios from 'axios';
    import { Line } from 'vue-chartjs';
    import { Chart as ChartJS, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, Decimation } from 'chart.js';
    import 'chartjs-adapter-luxon';

    // Register needed components
    ChartJS.register(LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, Decimation, zoomPlugin);

    // Create a vertical crosshair plugin
    const verticalCrosshair = {
        id: 'verticalCrosshair',
        afterDraw(chart: Chart) {
            if (!chart.tooltip || !chart.tooltip._active || chart.tooltip._active.length === 0) return;

            const ctx = chart.ctx;
            const x = chart.tooltip._active[0].element.x;
            const topY = chart.scales.y.top;
            const bottomY = chart.scales.y.bottom;

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.stroke();
            ctx.restore();
        },
    };
    ChartJS.register(verticalCrosshair);

    // Simulated data (replace with actual JSON from API or file)
    type WavePoint = { timestamp: number; amplitude: number };

    const waveform = ref<WavePoint[][]>([]);
    const chartRef = ref<any>(null);

    async function fetchWaveformData() {
        const params = {
            network: 'IU',
            station: 'ANMO',
            channels: 'BH?', // Now it's a string: "BHZ,BHE,BHN"
            start: '2020-01-01T00:00:00',
            end: '2020-01-01T00:01:00',
            decimate: '100',
        };

        try {
            const response = await axios.get('http://localhost:3001/api/waveform', { params });
            const data = response.data;
            console.log('damn data is:', data);
            waveform.value = data;
        } catch (error) {
            console.error('Waveform fetch error:', error);
        }
    }

    onMounted(() => {
        fetchWaveformData();
    });

    // Convert to chart.js format
    const colors = ['green', 'blue', 'gray'];
    const chartData = computed(() => ({
        datasets: waveform.value.map((trace, i) => ({
            label: `${trace.network}.${trace.station}.${trace.channel}`,
            data: trace.values.map((d) => ({
                x: d.timestamp,
                y: d.amplitude,
            })),
            xAxisKey: 'x',
            yAxisKey: 'y',
            borderColor: colors[i % colors.length],
            pointRadius: 0,
            borderWidth: 1,
            tension: 0.2,
        })),
    }));

    // Chart options
    const chartOptions = {
        responsive: true,
        animation: false,
        parsing: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    displayFormats: {
                        hour: 'HH:mm',
                        minute: 'HH:mm',
                        second: 'HH:mm:ss',
                    },
                },
                title: {
                    display: true,
                    text: 'Time',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Amplitude (m/s)',
                },
            },
        },
        plugins: {
            legend: { display: true },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: (ctx) => {
                        const label = ctx.dataset.label || '';
                        const value = ctx.parsed.y;
                        return `${label}: ${value.toExponential(2)}`;
                    },
                },
            },
            decimation: {
                enabled: true,
                algorithm: 'lttb',
                samples: 1000,
            },
            zoom: {
                zoom: {
                    wheel: { enabled: true },
                    pinch: { enabled: true },
                    mode: 'x',
                    drag: false,
                },
                pan: {
                    enabled: true,
                    mode: 'xy',
                    drag: { enabled: true },
                },
            },
            verticalCrosshair: {}, // enable plugin
        },
    };
</script>
