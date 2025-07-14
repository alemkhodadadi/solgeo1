<script setup lang="ts">
    import { ref } from 'vue';

    const emit = defineEmits<{
        (
            e: 'loaded',
            payload: {
                metadata: { name: string; samples: number; sps: number; start: string };
                data: number[][];
            }
        ): void;
    }>();

    function handleFileUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files?.length) return;

        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const text = reader.result as string;
            const lines = text.trim().split('\n');

            const metaLine = lines[0];
            const match = metaLine.match(/^TIMESERIES\s+(\S+),\s+(\d+)\s+samples,\s+([\d.]+)\s+sps,\s+([\d\-:T.]+),/);

            if (!match) return;

            const [_, name, sampleStr, spsStr, startStr] = match;
            const metadata = {
                name,
                samples: parseInt(sampleStr),
                sps: parseFloat(spsStr),
                start: startStr,
            };

            const data = lines.slice(1).map((line) => line.trim().split(/\s+/).map(parseFloat));

            emit('loaded', { metadata, data });
        };

        reader.readAsText(file);
    }
</script>

<template>
    <input type="file" accept=".csv,.txt" @change="handleFileUpload" />
</template>
