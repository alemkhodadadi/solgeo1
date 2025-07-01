<template>
    <div class="dashboard">
        <div class="flex grid grid-cols-3 gap-6">
            <ProjectCard v-for="project in projects" :project/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useProjectStore } from '@/store/project';
import { useLayout } from '@/layouts/layout';
import ProjectCard from '@/components/ProjectCard.vue';
const { closeMenu } = useLayout();
const projectStore = useProjectStore();


onMounted(() => {
    closeMenu()
    projectStore.getProjects()
});

const projects = computed(() => projectStore.projects);


</script>