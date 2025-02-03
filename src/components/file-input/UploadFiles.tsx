import { useMutation } from '@tanstack/react-query'
import { ImagePlusIcon, Paperclip } from 'lucide-react'
import { RefObject, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { DropzoneOptions } from 'react-dropzone'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import useHandleServerError from '@/hooks/useHandleServerError'
import { uploadFilesApi } from '@/network/apis/file'
import { CustomFile, TFile } from '@/types/file'
import { createFiles } from '@/utils/files'

import { ScrollArea } from '../ui/scroll-area'
import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '.'

export type TriggerUploadRef = {
  triggers: (() => Promise<void>)[]
}
export const formSchema = z
  .object({
    images: z.array(
      z.object({
        name: z.string(),
        fileUrl: z.string()
      })
    )
  })
  .and(z.any())

type SchemaType = z.infer<typeof formSchema>

type UploadFilesProps = {
  triggerRef: RefObject<TriggerUploadRef>
  dropZoneConfigOptions?: DropzoneOptions
  field: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> & {
    value: TFile | TFile[]
  }
  form?: UseFormReturn<SchemaType>
}

type TFieldFile =
  | {
      fieldType: 'single'
      fieldValue: TFile
    }
  | {
      fieldType: 'multiple'
      fieldValue: TFile[]
    }

const UploadFiles = ({ dropZoneConfigOptions, field, triggerRef }: UploadFilesProps) => {
  const [files, setFiles] = useState<CustomFile[]>([])
  const handleServerError = useHandleServerError()

  const dropZoneConfig = {
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/pdf': ['.pdf']
    },
    multiple: true,
    maxFiles: 1,
    maxSize: 1 * 1024 * 1024,
    ...dropZoneConfigOptions
  } satisfies DropzoneOptions

  const { mutateAsync: uploadFilesFn, isPending: isUploadingFiles } = useMutation({
    mutationKey: [uploadFilesApi.mutationKey],
    mutationFn: uploadFilesApi.fn
  })

  const { fieldType, fieldValue } = useMemo<TFieldFile>(() => {
    if (!Array.isArray(field?.value)) {
      if (dropZoneConfig?.maxFiles && dropZoneConfig?.maxFiles > 1) {
        throw new Error('Field value must be an array')
      }

      return {
        fieldType: 'single',
        fieldValue: field?.value as unknown as TFile
      }
    } else if (Array.isArray(field?.value)) {
      return {
        fieldType: 'multiple',
        fieldValue: field?.value as TFile[]
      }
    }
    throw new Error("Invalid field value. Must be either 'single' or 'multiple'")
  }, [field?.value, dropZoneConfig?.maxFiles])

  useEffect(() => {
    const transferData = async () => {
      try {
        if (fieldType === 'single' && fieldValue) {
          if ((fieldValue === ({} as TFile) && files.length === 0) || (!!fieldValue.fileUrl && files.length === 1)) {
            return
          }
          const constructedFiles = await createFiles([fieldValue])
          setFiles(constructedFiles)
        }
        if (fieldType === 'multiple' && fieldValue) {
          if (fieldValue.length === files.length) {
            return
          }
          const constructedFiles = await createFiles(fieldValue)

          setFiles(constructedFiles)
        }
      } catch (error) {
        handleServerError({
          error: error
        })
      }
    }
    transferData()
    // eslint-disable-next-line
  }, [fieldValue, fieldType, files])

  const onFileDrop = async (newFiles: CustomFile[] | null) => {
    try {
      setFiles(newFiles || [])
      if (fieldType === 'single') {
        const file = newFiles ? newFiles[0] : null
        const fileItem: TFile = {
          fileUrl: file?.fileUrl ?? URL.createObjectURL(file as File),
          name: file?.name as string
        }
        if (field.onChange) field.onChange(fileItem as unknown as React.ChangeEvent<HTMLInputElement>)
      }
      if (fieldType === 'multiple') {
        const fileItems: TFile[] = newFiles?.map((file) => ({
          fileUrl: file.fileUrl ?? URL.createObjectURL(file as File),
          name: file.name as string
        })) as TFile[]
        if (field.onChange) field.onChange(fileItems as unknown as React.ChangeEvent<HTMLInputElement>)
      }
    } catch (error) {
      handleServerError({
        error
      })
    }
  }

  const handleUploadFiles = useCallback(async () => {
    try {
      const formData = new FormData()

      files.forEach((file) => {
        if (file.fileUrl && file.fileUrl.includes('https://storage.googleapis.com/')) return
        formData.append('files', file)
      })

      const constructedFiles: TFile[] = await uploadFilesFn(formData).then((res) => {
        const fileItem = res.data
        let fileIndex = 0
        const result = files.map((file) => {
          if (file.fileUrl && file.fileUrl.includes('https://storage.googleapis.com/')) {
            return {
              id: file.id ?? undefined,
              name: file.name,
              fileUrl: file.fileUrl
            }
          }

          return {
            name: file.name,
            fileUrl: fileItem[fileIndex++]
          }
        })
        return result
      })

      if (field.onChange) {
        if (fieldType === 'single') {
          field.onChange(constructedFiles[0] as unknown as React.ChangeEvent<HTMLInputElement>)
        }
        if (fieldType === 'multiple') {
          field.onChange(constructedFiles as unknown as React.ChangeEvent<HTMLInputElement>)
        }
      }
    } catch (error) {
      handleServerError({
        error
      })
    }
  }, [field, fieldType, files, handleServerError, uploadFilesFn])

  useImperativeHandle(triggerRef, () => {
    const triggerFns = triggerRef.current?.triggers
    if (triggerFns) {
      return {
        triggers: [...triggerFns, handleUploadFiles]
      }
    }
    return {
      triggers: [handleUploadFiles]
    }
  }, [handleUploadFiles, triggerRef])

  return (
    <FileUploader
      value={files}
      onValueChange={onFileDrop}
      dropzoneOptions={dropZoneConfig}
      className='grid grid-cols-5 items-start'
    >
      <div className='col-span-2 md:col-span-1 aspect-square'>
        <FileInput disabled={isUploadingFiles} className='w-full h-full bg-background'>
          <div className='overflow-hidden h-full w-full flex flex-col items-center justify-center text-center p-2 hover:bg-primary/30 transition-all duration-500 border-2 border-dashed rounded-lg'>
            <div className='flex items-center flex-col gap-2'>
              <ImagePlusIcon className='size-10 text-muted-foreground max-lg:size-6' />
              <p className='text-foreground tracking-tight flex-1'>
                Drag & drop or browse files <b>{`(${files.length}/${dropZoneConfig.maxFiles})`}</b>
              </p>
            </div>
          </div>
        </FileInput>
      </div>
      <div className='col-span-3 md:col-span-4 w-full max-h-[400px] overflow-y-auto'>
        <FileUploaderContent>
          {files && files.length > 0 && (
            <div>
              <ScrollArea>
                <div className='flex flex-col gap-2'>
                  {files.map((file, index) => (
                    <FileUploaderItem
                      key={index}
                      index={index}
                      className='flex items-center justify-between rounded-lg hover:bg-primary/30 border bg-background'
                    >
                      <div key={file.name} className='flex items-center space-x-3 w-[95%]'>
                        <div
                          className='rounded-md flex items-center justify-center'
                          onClick={() => {
                            window.open(URL.createObjectURL(file))
                          }}
                        >
                          {file?.type?.includes('image') ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className='size-16 object-contain rounded-lg border'
                              onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                            />
                          ) : (
                            <Paperclip className='size-16 text-muted-foreground' />
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
      </div>
    </FileUploader>
  )
}

export default UploadFiles
