import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import UploadFilePreview from '@/components/file-input/UploadFilePreview'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/useToast'
import { getBrandByIdApi, updateBrandByIdApi } from '@/network/apis/brand/index'
import { uploadFilesApi } from '@/network/apis/file'
import { IBranch2 } from '@/types/Branch'

interface UploadDocumentFormValues {
  documentName: string
  files: File[]
}

interface UploadDocumentDialogProps {
  brand: IBranch2 // Using any for now, but ideally this would be IBranch2 type
  buttonText?: string
  buttonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  buttonClassName?: string
}

export function UploadDocumentDialog({
  brand,
  buttonText = 'Upload Documents',
  buttonVariant = 'default',
  buttonClassName = ''
}: UploadDocumentDialogProps) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { successToast, errorToast } = useToast()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UploadDocumentFormValues>({
    defaultValues: {
      documentName: '',
      files: []
    }
  })

  const convertFileToUrl = async (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const uploadedFilesResponse = await uploadFilesFn(formData)
    return uploadedFilesResponse.data
  }

  const { mutateAsync: uploadFilesFn, isPending: isUploading } = useMutation({
    mutationKey: [uploadFilesApi.mutationKey],
    mutationFn: uploadFilesApi.fn
  })

  const { mutateAsync: updateBrandFn, isPending: isUpdating } = useMutation({
    mutationKey: [updateBrandByIdApi.mutationKey, brand?.id],
    mutationFn: updateBrandByIdApi.fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getBrandByIdApi.queryKey, brand?.id] })
      successToast({ message: 'Document uploaded successfully', isShowDescription: false })
      reset()
      setOpen(false)
    },
    onError: () => {
      errorToast({ message: 'Failed to update brand with new document', isShowDescription: false })
    }
  })

  const onSubmit = async (data: UploadDocumentFormValues) => {
    try {
      if (!data.files.length) {
        errorToast({ message: 'Please upload at least one file', isShowDescription: false })
        return
      }

      // First upload the files to get URLs
      const fileUrls = await convertFileToUrl(data.files)

      // Create a copy of the brand with the new document added to the documents array
      const updatedBrand = {
        ...brand,
        documents: [...(brand.documents.map((el) => el.fileUrl) || []), fileUrls[0]]
      }

      // Update the brand with the new document
      await updateBrandFn({
        brandId: brand.id,
        ...updatedBrand
      })
    } catch {
      errorToast({ message: 'An error occurred while uploading', isShowDescription: false })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} className={buttonClassName}>
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>
            Upload brand documents for verification. Supported formats include PDF, DOC, DOCX, JPG, and PNG.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='documentName'>Document Name</Label>
            <Controller
              name='documentName'
              control={control}
              rules={{ required: 'Document name is required' }}
              render={({ field }) => <Input id='documentName' placeholder='Enter document name' {...field} />}
            />
            {errors.documentName && <p className='text-sm text-red-500'>{errors.documentName.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label>Upload Files</Label>
            <Controller
              name='files'
              control={control}
              rules={{ required: 'At least one file is required' }}
              render={({ field }) => (
                <UploadFilePreview
                  field={field}
                  vertical={true}
                  dropZoneConfigOptions={{
                    accept: {
                      'image/*': ['.jpg', '.jpeg', '.png'],
                      'application/pdf': ['.pdf'],
                      'application/msword': ['.doc', '.docx']
                    },
                    maxFiles: 5,
                    maxSize: 5 * 1024 * 1024 // 5MB
                  }}
                />
              )}
            />
            {errors.files && <p className='text-sm text-red-500'>{errors.files.message}</p>}
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={() => setOpen(false)} disabled={isUploading || isUpdating}>
              Cancel
            </Button>
            <Button type='submit' disabled={isUploading || isUpdating}>
              {isUploading || isUpdating ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
