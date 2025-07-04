

<script setup lang="ts">
import { computed } from 'vue';
import type { IProject } from '@/interfaces/app';
import { useProjectStore } from '@/store/project';
import type { LoadingProjectStatus } from '@/interfaces/project'


const props = defineProps<{ 
  project: IProject; 
  loading: boolean
}>();


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
                <Button :loading :label="$t('projects.open')" class="w-full" @click="emit('onOpenProject', project._id)"/>
            </div>
        </template>
    </Card>
</template>

