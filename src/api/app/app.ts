import apiClient from '@/api/http'

export const uploadFile = (formdata: FormData) => {
  return apiClient.post(`/upload`, formdata, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
