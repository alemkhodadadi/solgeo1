<template>
    <div class="dashboard">
        <div class="flex grid grid-cols-3 gap-6">
            <ProjectCard v-for="project in projects" :project @onOpenProject="openProject"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useProjectStore } from '@/store/project';
import { useRouter } from 'vue-router'; 
import ProjectCard from '@/components/ProjectCard.vue';
const router = useRouter()
const projectStore = useProjectStore();


onMounted(() => {
    projectStore.getProjects()
});

function openProject(id: string) {
    console.log('id in openproject is:', id)
    router.push({ path: `/projects/${id}` });
}

const projects = computed(() => projectStore.projects);


</script>