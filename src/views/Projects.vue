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
import { useAppStore } from '@/store/app';
import ProjectCard from '@/components/ProjectCard.vue';
const projectStore = useProjectStore();
const { closeMenu } = useAppStore()

onMounted(() => {
    projectStore.getProjects()
});

const projects = computed(() => projectStore.projects);


</script>