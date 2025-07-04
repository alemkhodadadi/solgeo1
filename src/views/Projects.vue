<template>
    <div class="dashboard">
        <div class="flex grid grid-cols-3 gap-6">
            <ProjectCard v-for="project in projects" :loading="projectStore.selectedProjectId == project._id" :project @onOpenProject="openProject"/>
        </div>
        <Drawer v-model:visible="appStore.appGeneralSettingDrawerVisible" header="Portal general settings" position="right" style="min-width: 30rem;">
            
            <div class="card">
                <div class="font-semibold text-xl mb-4">App Logo</div>
                <Toast />
                
                <FileUpload
                ref="uploadRef"
                name="files[]"
                customUpload
                :multiple="false"
                accept="image/*"
                :maxFileSize="1000000"
                @uploader="onUpload"
                class="w-full"
                >
                <template #empty>
                    <p class="text-gray-500 m-5">Drag and drop files here or click to upload.</p>
                </template>
                </FileUpload>
            </div>
            <Divider/>
            <div class="card">
                <div class="font-semibold text-xl mb-4">App title</div>
                
            </div>
        </Drawer>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useProjectStore } from '@/store/project';
import { useAppStore } from '@/store/app';
import { useRouter } from 'vue-router'; 
import ProjectCard from '@/components/ProjectCard.vue';
import { uploadFile } from '@/api/app/app';
const router = useRouter()
const appStore = useAppStore()
const projectStore = useProjectStore();

onMounted(() => {
    console.log('projects mounted')
    projectStore.getProjects()
});

async function openProject(id: string) {
    await projectStore.getCurrentProject(id)
    router.push({ path: `/projects/${id}` });
}

const projects = computed(() => projectStore.projects);

import { useToast } from 'primevue/usetoast'
const toast = useToast()

const uploadRef = ref()

async function onUpload(event: any) {
  try {
    const file = event.files[0]
    const formData = new FormData()
    formData.append('image', file)

    const response = await uploadFile(formData)
    console.log('Upload success:', response)

    toast.add({
      severity: 'success',
      summary: 'Upload Complete',
      detail: 'File uploaded successfully',
      life: 3000
    })
    uploadRef.value.clear()
  } catch (err) {
    console.error('Upload error:', err)

    toast.add({
      severity: 'error',
      summary: 'Upload Failed',
      detail: 'Something went wrong. Check the server.',
      life: 3000
    })
  }
}
</script>