import { TServerResponse } from '@/types/request'
import { toMutationFetcher } from '@/utils/query'
import { privateRequest, publicRequest } from '@/utils/request'

import { IImportConsultationCriteria } from '../consultation-criteria/type'

export const uploadFilesApi = toMutationFetcher<FormData, TServerResponse<string[]>>(
  'uploadFilesApi',
  async (formData) => {
    return publicRequest('/files/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: formData
    })
  }
)
export const uploadFilesConsultationCriteriaApi = toMutationFetcher<
  FormData,
  TServerResponse<IImportConsultationCriteria[]>
>('uploadFilesConsultationCriteriaApi', async (formData) => {
  return privateRequest('files/upload-consultation-criteria', {
    method: 'POST',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData
  })
})
