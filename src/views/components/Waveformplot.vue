<script setup lang="ts">
    import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
    import Plotly from 'plotly.js-dist';

    const props = defineProps<{
        samples: number[];
        times: number[];
    }>();

    const chartDiv = ref<HTMLElement | null>(null);

    watch([() => props.samples, () => props.times], () => {
        if (chartDiv.value && props.samples.length) {
            Plotly.newPlot(
                chartDiv.value,
                [
                    {
                        x: props.times,
                        y: props.samples,
                        type: 'scattergl',
                        mode: 'lines',
                        line: { color: 'blue', width: 1 },
                    },
                ],
                {
                    title: 'Waveform',
                    margin: { t: 30, r: 10, b: 40, l: 50 },
                    xaxis: { title: 'Time (s)' },
                    yaxis: { title: 'Amplitude' },
                    autosize: true,
                    dragmode: 'zoom',
                },
                {
                    responsive: true,
                    scrollZoom: true,
                    displayModeBar: true,
                }
            );
        }
    });

    onBeforeUnmount(() => {
        if (chartDiv.value) Plotly.purge(chartDiv.value);
    });
</script>

<template>
    <div class="w-full h-[300px]" ref="chartDiv"></div>
</template>
