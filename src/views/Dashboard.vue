<template>
    <PageHeader>
        <template #actions>
            <Button icon="pi pi-refresh" class="p-button-sm" @click="refresh" />
            <Button label="New Report" icon="pi pi-plus" class="p-button-sm p-button-primary" />
        </template>
        <template #description />
    </PageHeader>

    <PageContent>
        <template #content>
            <Tabs value="0">
                <TabList>
                    <Tab value="1">Details</Tab>
                    <Tab value="0">Displacements</Tab>
                    <Tab value="2">Waveform chartjs </Tab>
                    <Tab value="3">Quality</Tab>
                    <Tab value="4">Alerts</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="0">
                        <!-- <PlotlyChart /> -->
                        <WaveformChart />
                    </TabPanel>
                    <TabPanel value="1">
                        <div class="grid grid-cols-12 gap-8">
                            <div class="col-span-6">
                                <Linechart />
                            </div>
                            <div class="col-span-6"></div>
                        </div>
                    </TabPanel>
                    <TabPanel value="2">
                        <Waveform_amcharts />
                    </TabPanel>
                    <TabPanel value="3">Quality </TabPanel>
                    <TabPanel value="4">Alerts </TabPanel>
                </TabPanels>
            </Tabs>
        </template>
    </PageContent>

    <!-- Main content below -->
    <div class="p-4">
        <!-- Your content here -->
    </div>
</template>

<script setup lang="ts">
    import { PageHeader, PageContent, Linechart, PlotlyChart, WaveformChart, Waveform_amcharts } from '@/views/components';
    import { onMounted, ref } from 'vue';
    import { useProjectStore } from '@/store/project';
    import { useRoute } from 'vue-router';

    const projectStore = useProjectStore();
    const route = useRoute();

    const refresh = () => {
        console.log('Refreshing...');
    };

    onMounted(() => {
        const projectId = route.params.id as string;
        console.log('current project is:', projectStore.currentProject);
        console.log('Current project ID:', projectId);
        if (!projectStore.currentProject) {
            projectStore.getProjects();
        }
    });

    const tabs = ref([
        { title: 'Tab 1', content: 'Tab 1 Content', value: '0' },
        { title: 'Tab 2', content: 'Tab 2 Content', value: '1' },
        { title: 'Tab 3', content: 'Tab 3 Content', value: '2' },
    ]);
</script>
