<template>
    <div id="waveformchart-am" style="width: 100%; height: 500px"></div>
</template>

<script setup lang="ts">
    import { onMounted } from 'vue';
    import * as am5 from '@amcharts/amcharts5';
    import * as am5xy from '@amcharts/amcharts5/xy';
    import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
    import axios from 'axios';

    interface WavePoint {
        timestamp: number;
        amplitude: number;
    }

    interface Trace {
        network: string;
        station: string;
        channel: string;
        values: WavePoint[];
    }

    let root: am5.Root;
    let chart: am5xy.XYChart;
    let xAxis: am5xy.DateAxis;

    async function fetchWaveformData() {
        const params = {
            network: 'IU',
            station: 'ANMO',
            channels: 'BH?',
            start: '2020-01-01T00:00:00',
            end: '2020-01-01T00:01:00',
            decimate: '100',
        };

        try {
            const response = await axios.get<Trace[]>('http://localhost:3001/api/waveform', { params });
            setupChart(response.data);
        } catch (error) {
            console.error('Waveform fetch error:', error);
        }
    }

    function setupChart(waveform: Trace[]) {
        root = am5.Root.new('waveformchart-am');
        root.setThemes([am5themes_Animated.new(root)]);

        root.numberFormatter.setAll({
            numberFormat: '0.00e+0',
            bigNumberPrefixes: [],
            smallNumberPrefixes: [],
        });

        const yRenderer = am5xy.AxisRendererY.new(root, {
            minGridDistance: 20,
        });
        yRenderer.labels.template.setAll({
            fontSize: 12,
            fill: am5.color(0x000000),
            text: '{value}', // let numberFormatter format
        });

        chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: true,
                panY: true,
                wheelX: 'panX',
                wheelY: 'zoomX',
                pinchZoomX: true,
            })
        );

        xAxis = chart.xAxes.push(
            am5xy.DateAxis.new(root, {
                baseInterval: { timeUnit: 'millisecond', count: 1 },
                groupData: false,
                maxDeviation: 0.1,
                renderer: am5xy.AxisRendererX.new(root, {
                    minGridDistance: 70,
                }),
                tooltip: am5.Tooltip.new(root, {}),
            })
        );

        const yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: yRenderer,
            })
        );

        // Add one LineSeries per trace
        waveform.forEach((trace, i) => {
            const series = chart.series.push(
                am5xy.LineSeries.new(root, {
                    name: `${trace.network}.${trace.station}.${trace.channel}`,
                    xAxis,
                    yAxis,
                    valueXField: 'timestamp',
                    valueYField: 'amplitude',
                    stroke: am5.color(getColor(i)),
                    tooltip: am5.Tooltip.new(root, {
                        labelText: '{name}: {valueY.formatNumber("0.00000000")}',
                    }),
                })
            );

            (series as any).tensionX = 0.9;

            const data = trace.values.map((d) => ({
                timestamp: d.timestamp,
                amplitude: d.amplitude,
            }));
            series.data.setAll(data);
            series.strokes.template.setAll({ strokeWidth: 1 });
        });

        // Add crosshair and zooming cursor
        chart.set(
            'cursor',
            am5xy.XYCursor.new(root, {
                xAxis,
                behavior: 'zoomX',
            })
        );

        // Optional scrollbar
        chart.set(
            'scrollbarX',
            am5.Scrollbar.new(root, {
                orientation: 'horizontal',
            })
        );
    }

    function getColor(index: number): number {
        const palette = [0x00aa00, 0x0000cc, 0x666666, 0xcc0000, 0xaa00cc];
        return palette[index % palette.length];
    }

    onMounted(() => {
        fetchWaveformData();
    });
</script>

<style scoped>
    #waveformchart-am {
        width: 100%;
        height: 100%;
    }
</style>
