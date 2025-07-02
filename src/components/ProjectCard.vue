

<script setup lang="ts">
import type { IProject } from '@/interfaces/models';
import { useProjectStore } from '@/store/project';
import { useRouter } from 'vue-router';

const projectStore = useProjectStore()
const router = useRouter()

defineProps<{ project: IProject }>();

function openProject(id: any){
    router.push({ path: `/projects/${id}` });
}
</script>

<template>
    <Card class="d-flex">
        <template #header>
            <img alt="user header" src="https://d325xotcxuvnu4.cloudfront.net/66ab433254c98d5ea219727d/66ab434b23d803363e6b9d20/image" />
        </template>
        <template #title>{{project.name}}</template>
        <template #subtitle>{{project.description}}</template>
        <template #content>
            <!-- <p class="m-0">
                Lorem ipsum dolor sit ...
            </p> -->
        </template>
        <template #footer>
            <div class="flex gap-4 mt-1">
                <Button :loading="projectStore.loadingProject" :label="$t('projects.open')" class="w-full" @click="openProject(project._id)"/>
            </div>
        </template>
    </Card>
</template>

