

<script setup lang="ts">
import type { IProject } from '@/interfaces/models';
import { useProjectStore } from '@/store/project';

const projectStore = useProjectStore()
defineProps<{ project: IProject }>();

const emit = defineEmits<{
  (e: 'onOpenProject', id: string): void
}>()


</script>

<template>
    <Card class="d-flex">
        <template #header>
            <img alt="user header" src="https://wpcdn.web.wsu.edu/news/uploads/sites/2797/2023/04/tallwoodbuilding-1024x676.jpg" />
        </template>
        <template #title>{{project.name}}</template>
        <template #subtitle>{{project.description}}</template>
        <template #content>

        </template>
        <template #footer>
            <div class="flex gap-4 mt-1">
                <Button :loading="projectStore.loadingProject" :label="$t('projects.open')" class="w-full" @click="emit('onOpenProject', project._id)"/>
            </div>
        </template>
    </Card>
</template>

