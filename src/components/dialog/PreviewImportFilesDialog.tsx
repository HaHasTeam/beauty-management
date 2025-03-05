import { useMutation } from '@tanstack/react-query'
import { AlertTriangle, Upload } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import useHandleServerError from '@/hooks/useHandleServerError'
import { uploadFilesConsultationCriteriaApi } from '@/network/apis/file'
import { IConsultationCriteriaSectionFormData } from '@/schemas/consultation-criteria.schema'
import { formatFileSize } from '@/utils/product-form/formatSize'

import Button from '../button'
import ImportExcelFiles from '../file-input/ImportExcelFiles'

interface PreviewImportFilesDialogProps {
  maxExcelFiles?: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportFiles: (sections: IConsultationCriteriaSectionFormData[]) => void
}

const PreviewImportFilesDialog = ({
  maxExcelFiles,
  open,
  onOpenChange,
  onImportFiles
}: PreviewImportFilesDialogProps) => {
  const { t } = useTranslation()
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const handleServerError = useHandleServerError()

  const { mutateAsync: uploadFilesFn, isPending: isUploading } = useMutation({
    mutationKey: [uploadFilesConsultationCriteriaApi.mutationKey],
    mutationFn: uploadFilesConsultationCriteriaApi.fn,
    onSuccess: (response) => {
      // Process and set imported files data
      const importedSections = response.data.flatMap(
        (file: { data: Array<{ section: string; orderIndex: number; mandatory: boolean; description: string }> }) =>
          file.data
      )

      onImportFiles(importedSections)
      onOpenChange(false)
    },
    onError: (error) => {
      handleServerError({ error })
    }
  })

  const handleSubmitImport = async () => {
    try {
      const formData = new FormData()
      selectedFiles.forEach((file) => {
        formData.append('files', file)
      })

      await uploadFilesFn(formData)
    } catch (error) {
      handleServerError({ error })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px] md:max-w-[700px]'>
        <DialogHeader className='flex flex-row items-start gap-4'>
          <AlertTriangle className='mt-2 h-6 w-6 text-orange-500' />
          <div className='flex-1 gap-2 items-start'>
            <DialogTitle className='text-lg'>{t(`media.viewMediaFiles`)}</DialogTitle>
          </div>
        </DialogHeader>

        <ImportExcelFiles
          isAcceptImage={false}
          isAcceptFile={false}
          isAcceptExcel={true}
          vertical={false}
          isFullWidth={true}
          onFilesChange={setSelectedFiles}
          dropZoneConfigOptions={{ maxFiles: maxExcelFiles }}
          renderFileItemUI={(file) => (
            <div className='w-full hover:border-primary h-16 rounded-lg border border-gray-300 p-4 bg-card'>
              <div className='h-full flex items-center justify-start gap-2'>
                <div className='text-start'>
                  <span className='text-sm font-medium overflow-ellipsis line-clamp-2'>{file.name}</span>
                  <p className='text-xs text-gray-500'>{formatFileSize(file.size)}</p>
                </div>
              </div>
            </div>
          )}
          renderInputUI={(_isDragActive, files, maxFiles) => (
            <div className='w-full h-32 hover:bg-primary/15 p-4 rounded-lg border flex flex-col gap-2 items-center justify-center text-center border-dashed border-primary transition-all duration-500'>
              <Upload className='w-12 h-12 text-primary' />
              <p className='text-sm text-primary'>
                {t('createProduct.inputImage')} ({files?.length ?? 0}/{maxFiles})
              </p>
            </div>
          )}
        />

        <Button onClick={handleSubmitImport} loading={isUploading} disabled={selectedFiles.length === 0}>
          {t('button.import')}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default PreviewImportFilesDialog
