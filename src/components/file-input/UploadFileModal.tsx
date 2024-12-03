import { useMutation } from '@tanstack/react-query'
import { FilesIcon, Upload } from 'lucide-react'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { DropzoneOptions } from 'react-dropzone'
import { TbWorldUpload } from 'react-icons/tb'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
import { uploadFilesApi } from '@/network/apis/file'
import { createFiles } from '@/utils/files'

import { Progress } from '../ui/progress'
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '.'

type UploadFileModalProps = {
  Trigger: ReactNode
  dropZoneConfigOptions?: DropzoneOptions
  field: React.InputHTMLAttributes<HTMLInputElement>
}

const UploadFileModal = ({ Trigger, dropZoneConfigOptions, field }: UploadFileModalProps) => {
  const [files, setFiles] = useState<File[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const handleServerError = useHandleServerError()
  const { successToast } = useToast()
  const [progress, setProgress] = useState(0)

  const dropZoneConfig = {
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc']
    },
    multiple: true,
    maxFiles: 1,
    maxSize: 1 * 1024 * 1024,
    ...dropZoneConfigOptions
  } satisfies DropzoneOptions

  const { mutateAsync: uploadFilesFn, isPending: isUploadingFiles } = useMutation({
    mutationKey: [uploadFilesApi.mutationKey],
    mutationFn: uploadFilesApi.fn,
    onSuccess: () => {
      successToast({
        message: 'Amazing! Your files have been uploaded!'
      })
      setProgress(100)
      setTimeout(() => {
        setProgress(0)
      }, 500)
    },
    onError: () => {
      setTimeout(() => {
        setProgress(0)
      }, 500)
    }
  })

  const { fieldType, fieldValue } = useMemo<{
    fieldType: 'string' | 'array'
    fieldValue: string | string[]
  }>(() => {
    if (typeof field?.value === 'string') {
      if (dropZoneConfig?.maxFiles && dropZoneConfig?.maxFiles > 1) {
        throw new Error('Field value must be an array')
      }

      return {
        fieldType: 'string',
        fieldValue: field?.value as string
      }
    } else if (Array.isArray(field?.value)) {
      return {
        fieldType: 'array',
        fieldValue: field?.value as string[]
      }
    }
    throw new Error('Field value must be a string or an array')
  }, [field?.value, dropZoneConfig?.maxFiles])

  const isDragActive = false

  useEffect(() => {
    const transferData = async () => {
      try {
        const resultFiles: File[] = []
        if (fieldType === 'string') {
          if ((fieldValue == '' && files.length !== 1) || (fieldValue !== '' && files.length === 0)) {
            if (fieldValue) {
              const parsedFiles = await createFiles([fieldValue as string])
              resultFiles.push(...parsedFiles)
              return setFiles(resultFiles)
            } else {
              return setFiles([])
            }
          }
        }
        if (Array.isArray(fieldValue)) {
          if (fieldValue.length === files.length) {
            return
          }

          const parsedFiles = await createFiles(fieldValue as string[])
          resultFiles.push(...parsedFiles)
          return setFiles(resultFiles)
        }
      } catch (error) {
        handleServerError({
          error: error
        })
      }
    }
    transferData()
    // eslint-disable-next-line
  }, [fieldValue, fieldType, files.length])

  const convertFileToUrl = async (files: File[]) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })
    setProgress(50)
    const uploadedFilesResponse = await uploadFilesFn(formData)

    return uploadedFilesResponse.data
  }

  const onFileDrop = async (newFiles: File[] | null) => {
    const oldFiles = files
    try {
      // Check file is string or array
      // If string, convert to file and set to state
      if (fieldType === 'string') {
        // Value must be an array of files
        if (!newFiles?.length && field.onChange) {
          field.onChange('' as unknown as React.ChangeEvent<HTMLInputElement>)
        }
        if (newFiles?.length) {
          const fileUrls = await convertFileToUrl(newFiles)

          field?.onChange?.(fileUrls[0] as unknown as React.ChangeEvent<HTMLInputElement>)
        }
      }

      // If array, set to state
      if (fieldType === 'array') {
        if (!newFiles?.length) return field.onChange?.([] as unknown as React.ChangeEvent<HTMLInputElement>)
        if (newFiles.length > oldFiles.length) {
          const diffedFiles = newFiles.filter((file) => {
            return !oldFiles?.some(
              (oldFile) => oldFile.name === file.name && oldFile.lastModified === file.lastModified
            )
          })

          const newDiffedFileUrls = await convertFileToUrl(diffedFiles)
          field?.onChange?.([
            ...(field?.value as string[]),
            ...newDiffedFileUrls
          ] as unknown as React.ChangeEvent<HTMLInputElement>)
        } else {
          const deletedIndex = oldFiles.findIndex((oldFile) => {
            return !newFiles.some((file) => file.name === oldFile.name && file.lastModified === oldFile.lastModified)
          })

          if (deletedIndex !== -1) {
            ;(field?.value as string[]).splice(deletedIndex, 1)
            field?.onChange?.(field.value as unknown as React.ChangeEvent<HTMLInputElement>)
          }
        }
      }
      const markedFiles = newFiles?.map((file) => {
        return new File([file], file.name, { type: file.type, lastModified: file.lastModified - 100 })
      })
      setFiles(markedFiles || [])
    } catch (error) {
      handleServerError({
        error
      })
    }
  }

  return (
    <Dialog open={isOpen || isUploadingFiles} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-2xl bg-background border-border shadow-lg'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-foreground'>Upload Your File(s)</DialogTitle>
          <DialogDescription className='text-muted-foreground'>
            Drag and drop your file here or click to select files
          </DialogDescription>
        </DialogHeader>
        <div
          className={`overflow-hidden border border-dashed rounded-xl transition-all duration-300 ${
            isDragActive ? 'border-primary bg-primary/10 dark:bg-accent' : 'border-muted-foreground'
          }`}
        >
          <FileUploader value={files} onValueChange={onFileDrop} dropzoneOptions={dropZoneConfig}>
            <FileInput disabled={isUploadingFiles}>
              <div className='overflow-hidden flex flex-col items-center justify-center text-center w-full border-b border-dashed border-primary py-4 bg-primary/20 hover:bg-primary transition-all duration-500'>
                <Upload className='w-12 h-12 mb-4 text-muted-foreground' />
                {isDragActive ? (
                  <p className='text-lg font-medium text-foreground'>Drop your images here</p>
                ) : (
                  <>
                    <p className='text-lg font-medium text-foreground'>Drag & drop your images here</p>
                    <p className='mt-2 text-sm text-muted-foreground'>or click to select files</p>
                    {files && files.length < dropZoneConfig.maxFiles ? (
                      <span className='mt-2 text-sm text-muted-foreground px-8'>
                        {`You can upload up to ${dropZoneConfig.maxFiles} files with a maximum size of ${dropZoneConfig.maxSize / (1024 * 1024)} MB each`}
                      </span>
                    ) : (
                      <span className='mt-2 text-sm text-muted-foreground px-8'>
                        {`You have reached the maximum number of files allowed`}
                      </span>
                    )}
                  </>
                )}
              </div>
            </FileInput>
            <FileUploaderContent>
              {
                <div className={cn('w-full px-4 flex items-center gap-4', progress > 0 ? 'visible' : 'invisible')}>
                  <Progress value={progress} className='w-full flex-1' />
                  <span className='text-sm font-medium text-muted-foreground'>{progress}%</span>
                </div>
              }
              {files && files.length > 0 && (
                <div className='pb-4'>
                  <p className='text-sm font-medium text-muted-foreground flex justify-center gap-2 items-center pb-2'>
                    <TbWorldUpload /> <span>{files.length} file(s) selected</span>
                  </p>
                  <ScrollArea className='h-[120px] w-full rounded-md shadow-2xl py-2 border-t-4 border-primary'>
                    <div className='flex flex-col gap-2 px-4'>
                      {files.map((file, index) => (
                        <FileUploaderItem
                          key={index}
                          index={index}
                          className='flex items-center justify-between rounded-lg hover:bg-primary'
                        >
                          <div key={file.name} className='flex items-center space-x-3 w-[95%]'>
                            <div className='rounded-md flex items-center justify-center'>
                              {file.type.includes('image') ? (
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={file.name}
                                  className='size-12 object-contain rounded-lg border-2'
                                  onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                                />
                              ) : (
                                <FilesIcon className='w-12 h-12 text-muted-foreground' />
                              )}
                            </div>
                            <span className='text-sm font-medium flex-1 flex overflow-hidden flex-col'>
                              <span className='text-ellipsis overflow-hidden'>{file.name}</span>
                              <span className='text-muted-foreground text-xs font-bold'>
                                {Math.round(file.size / 1024)} KB
                              </span>
                            </span>
                          </div>
                        </FileUploaderItem>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </FileUploaderContent>
          </FileUploader>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UploadFileModal
