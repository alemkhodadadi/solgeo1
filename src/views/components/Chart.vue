<script setup lang="ts">
    import { onMounted, onBeforeUnmount, ref } from 'vue';
    import axios from 'axios';
    import Plotly from 'plotly.js-dist';

    const chartDiv = ref<HTMLElement | null>(null);

    const x = ref<number[]>([]);
    const y = ref<number[]>([]);

    const plotData = [
        {
            x: [],
            y: [],
            type: 'scattergl',
            mode: 'lines',
            line: { color: 'black', width: 1 },
        },
    ];

    const layout = {
        title: 'High-Resolution Waveform',
        margin: { t: 30, r: 10, b: 40, l: 50 },
        xaxis: { title: 'Time (s)' },
        yaxis: { title: 'Amplitude' },
        autosize: true,
        dragmode: 'pan',
    };

    async function fetchWaveformData() {
        const params = {
            network: 'IU',
            station: 'ANMO',
            channels: 'BH?', // Now it's a string: "BHZ,BHE,BHN"
            start: '2020-01-01T00:00:00',
            end: '2020-01-01T01:00:00',
        };

        try {
            const response = await axios.get('http://localhost:3001/api/waveform', { params });
            const data = response.data;
            x.value = data.values.map((d: any) => (d.timestamp - data.starttime) / 1000);
            y.value = data.values.map((d: any) => d.amplitude);

            plotData[0].x = x.value;
            plotData[0].y = y.value;

            if (chartDiv.value) {
                Plotly.react(chartDiv.value, plotData, layout, {
                    responsive: true,
                    scrollZoom: true,
                    displayModeBar: true,
                });
            }
        } catch (error) {
            console.error('Waveform fetch error:', error);
        }
    }

    onMounted(() => {
        fetchWaveformData();
    });

    onBeforeUnmount(() => {
        if (chartDiv.value) {
            Plotly.purge(chartDiv.value);
        }
    });
</script>

<template>
    <div>
        <div ref="chartDiv" style="width: 100%; height: 600px"></div>
    </div>
</template>
