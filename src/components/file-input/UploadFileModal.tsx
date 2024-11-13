import { Upload } from 'lucide-react'
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
import { createFiles } from '@/utils/files'

import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '.'

type UploadFileModalProps = {
  Trigger: ReactNode
  dropZoneConfigOptions?: DropzoneOptions
  field: React.InputHTMLAttributes<HTMLInputElement>
}

const UploadFileModal = ({ Trigger, dropZoneConfigOptions, field }: UploadFileModalProps) => {
  const [files, setFiles] = useState<File[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const { fieldType, fieldValue } = useMemo<{
    fieldType: 'string' | 'array'
    fieldValue: string | string[]
  }>(() => {
    if (typeof field?.value === 'string') {
      if (dropZoneConfigOptions?.maxFiles && dropZoneConfigOptions?.maxFiles > 1) {
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
  }, [field?.value, dropZoneConfigOptions?.maxFiles])

  const isDragActive = false
  const dropZoneConfig = {
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    multiple: true,
    maxFiles: 1,
    maxSize: 1 * 1024 * 1024,
    ...dropZoneConfigOptions
  } satisfies DropzoneOptions

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
        console.log(error)
      }
    }
    transferData()
  }, [fieldValue, fieldType, files.length])

  const convertFileToUrl = async (files: File[]) => {
    const fileUrls = files.map((file) => {
      return URL.createObjectURL(file)
    })
    return fileUrls
  }

  const onFileDrop = async (newFiles: File[] | null) => {
    console.log('newFiles', newFiles)
    setFiles(newFiles || [])
    const oldFiles = files
    try {
      // Check file is string or array
      // If string, convert to file and set to state
      if (fieldType === 'string') {
        // Value must be an array of files
        if (!newFiles?.length) {
          return field.onChange && field.onChange('' as unknown as React.ChangeEvent<HTMLInputElement>)
        }
        if (newFiles?.length) {
          const fileUrls = await convertFileToUrl(newFiles)
          console.log('fileUrls', fileUrls)

          return field?.onChange?.(fileUrls[0] as unknown as React.ChangeEvent<HTMLInputElement>)
        }
      }
      console.log('oldFiles', oldFiles)

      // If array, set to state
      if (fieldType === 'array') {
        if (!newFiles?.length) return field.onChange?.([] as unknown as React.ChangeEvent<HTMLInputElement>)

        if (newFiles.length > oldFiles.length) {
          const diffedFiles = newFiles.filter((file) => {
            return !oldFiles?.some((oldFile) => oldFile.name === file.name)
          })

          const newDiffedFileUrls = await convertFileToUrl(diffedFiles)
          return field?.onChange?.([
            ...(field?.value as string[]),
            ...newDiffedFileUrls
          ] as unknown as React.ChangeEvent<HTMLInputElement>)
        } else {
          const deletedFile = oldFiles.filter((file) => {
            return !newFiles.some((newFile) => newFile.name === file.name)
          })

          if (deletedFile.length > 0) {
            const newAppendFilesUrl = (field?.value as string[]).filter((file) => {
              return !deletedFile.some((deleted) => deleted.name === file)
            })

            field?.onChange?.(newAppendFilesUrl as unknown as React.ChangeEvent<HTMLInputElement>)
          }
        }
      }
    } catch (error) {
      console.error('Err', error)
      setFiles(oldFiles)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className='w-full bg-background border-border shadow-lg'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-foreground'>Upload Your Images</DialogTitle>
          <DialogDescription className='text-muted-foreground'>
            Drag and drop your images here or click to select files
          </DialogDescription>
        </DialogHeader>
        <div
          className={`overflow-hidden border border-dashed rounded-xl transition-all duration-300 ${
            isDragActive ? 'border-primary bg-primary/10 dark:bg-accent' : 'border-muted-foreground'
          }`}
        >
          <FileUploader value={files} onValueChange={onFileDrop} dropzoneOptions={dropZoneConfig}>
            <FileInput>
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
              {files && files.length > 0 && (
                <div className='pb-4'>
                  <p className='text-sm font-medium text-muted-foreground flex justify-center gap-2 items-center py-4'>
                    <TbWorldUpload /> <span>{files.length} file(s) selected</span>
                  </p>
                  <ScrollArea className='h-[120px] w-full rounded-md shadow-2xl py-2 border-t-4 border-primary'>
                    <div className='flex flex-col gap-2 px-4'>
                      {files.map((file, index) => (
                        <FileUploaderItem
                          index={index}
                          className='flex items-center justify-between rounded-lg hover:bg-primary'
                        >
                          <div key={file.name} className='flex items-center space-x-3'>
                            <div className='rounded-md flex items-center justify-center'>
                              <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className='size-12 object-cover rounded-lg border-2'
                                onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                              />
                            </div>
                            <span className='text-sm font-medium truncate max-w-[200px]'>{file.name}</span>
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
