import { Upload } from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'
import { DropzoneOptions } from 'react-dropzone'
import { ControllerFieldState, FieldValues, UseFormReturn } from 'react-hook-form'
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
import { createFile } from '@/utils/files'

import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '.'

type UploadFileModalProps<TFieldValues extends FieldValues> = {
  Trigger: ReactNode
  dropZoneConfigOptions?: DropzoneOptions
  field?: React.InputHTMLAttributes<HTMLInputElement>
  formState?: UseFormReturn<TFieldValues>
  fieldState?: ControllerFieldState
}

const UploadFileModal = <T extends FieldValues>({ Trigger, dropZoneConfigOptions, field }: UploadFileModalProps<T>) => {
  const [files, setFiles] = useState<File[] | null>([])
  const [isOpen, setIsOpen] = useState(false)
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
    if (!field?.value || (Array.isArray(field?.value) && field?.value.length === 0)) {
      if (field?.value === '' || Array.isArray(field?.value)) {
        return
      }
      throw new Error('Field value must be a string or an array')
    }

    const files: File[] = []
    if (typeof field?.value === 'string') {
      createFile(field?.value).then((file) => {
        files.push(file)
        setFiles(files)
      })
    }
    if (Array.isArray(field?.value)) {
      const filesPromise = field.value.map((file: string) => {
        return createFile(file)
      })
      Promise.all(filesPromise).then((files) => {
        setFiles(files)
      })
    }
  }, [field?.value])

  const convertFileToUrl = (file: File) => {
    return URL.createObjectURL(file)
  }

  const onFileDrop = (value: File[] | null) => {
    setFiles(value)
    // Check file is string or array
    // If string, convert to file and set to state
    if (typeof field?.value === 'undefined' || typeof field?.value == 'string') {
      // Value must be an array of files
      if (field?.value) {
        return field.onChange && field.onChange('' as unknown as React.ChangeEvent<HTMLInputElement>)
      }
      if (value?.length) {
        const fileUrl = convertFileToUrl(value[0])
        return field?.onChange?.(fileUrl as unknown as React.ChangeEvent<HTMLInputElement>)
      }
    }
    // If array, set to state
    if (Array.isArray(field?.value)) {
      if (!value) return field?.onChange?.([] as unknown as React.ChangeEvent<HTMLInputElement>)
      if (value.length > field?.value.length) {
        const fileUrl = convertFileToUrl(value[value.length - 1])
        return field?.onChange?.([
          ...(field?.value as string[]),
          fileUrl
        ] as unknown as React.ChangeEvent<HTMLInputElement>)
      } else {
        const deletedFile = files?.filter((file: File) => {
          return !value.some((newFile) => newFile.name === file.name)
        })
        if (deletedFile && deletedFile.length > 0) {
          const newFiles = field?.value.filter((file: string) => {
            return !deletedFile.some((delFile) => delFile.name === file)
          })
          field?.onChange?.(newFiles as unknown as React.ChangeEvent<HTMLInputElement>)
        }
      }
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
