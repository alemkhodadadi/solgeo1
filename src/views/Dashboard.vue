<template>
	<PageHeader>
		<template #actions>
			<Button icon="pi pi-refresh" class="p-button-sm" @click="refresh" />
			<Button label="New Report" icon="pi pi-plus" class="p-button-sm p-button-primary" />
		</template>
		<template #description/>
	</PageHeader>

	<PageContent>
		<template #content>
			<Linechart/>
		</template>
	</PageContent>
	
	

	<!-- Main content below -->
	<div class="p-4">
		<!-- Your content here -->
	</div>
</template>

<script setup lang="ts">
import {PageHeader, PageContent, Linechart} from '@/views/components'
import { onMounted } from 'vue'
import { useProjectStore } from '@/store/project';
import { useRoute } from 'vue-router';


const projectStore = useProjectStore();
const route = useRoute();

const refresh = () => {
  	console.log('Refreshing...')
}

onMounted(() => {
	const projectId = route.params.id as string;
	console.log('current project is:', projectStore.currentProject)
	console.log('Current project ID:', projectId);
	if(!projectStore.currentProject){
		projectStore.getProjects()
	}
    
});

</script>