import { useMutation } from '@tanstack/react-query'
import { ImagePlus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { DropzoneOptions } from 'react-dropzone'

import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { uploadFilesApi } from '@/network/apis/file'
import { createFiles } from '@/utils/files'

import { FileInput, FileUploader, FileUploaderContent, ProductFileUploaderItem } from '../file-input'
import { LoadingCircle } from '../progress/CircleProgress'

type UploadProductImagesProps = {
  dropZoneConfigOptions?: DropzoneOptions
  field: React.InputHTMLAttributes<HTMLInputElement>
}

const UploadProductImages = ({ dropZoneConfigOptions, field }: UploadProductImagesProps) => {
  const [files, setFiles] = useState<File[]>([])
  const handleServerError = useHandleServerError()
  const { successToast } = useToast()

  const [progress, setProgress] = useState(0)

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
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc']
    },
    multiple: true,
    maxFiles: 7,
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
    if (!newFiles) return
    setFiles(newFiles)

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

          return field?.onChange?.(fileUrls[0] as unknown as React.ChangeEvent<HTMLInputElement>)
        }
      }

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
      handleServerError({
        error
      })
      setFiles(oldFiles)
    }
  }

  return (
    <div
      className={`flex transition-all duration-300 ${isDragActive ? 'border-primary bg-primary/10' : 'border-primary'}`}
    >
      <FileUploader
        value={files}
        onValueChange={onFileDrop}
        dropzoneOptions={dropZoneConfig}
        className='flex'
        orientation='horizontal'
        customMaxFiles={dropZoneConfig.maxFiles}
      >
        <div>
          <FileUploaderContent className='flex'>
            {files && files.length < dropZoneConfig.maxFiles && (
              <div>
                <FileInput disabled={isUploadingFiles}>
                  <div className='hover:bg-primary/15 p-4 w-32 h-32 rounded-lg border flex flex-col gap-2 items-center justify-center text-center border-dashed border-primary transition-all duration-500'>
                    <ImagePlus className='w-12 h-12 text-primary' />
                    {progress > 0 ? (
                      <LoadingCircle progress={progress} size={35} strokeWidth={6} />
                    ) : (
                      <p className='text-sm text-primary'>
                        Drag & drop or browse file ({files?.length ?? 0}/{dropZoneConfig.maxFiles})
                      </p>
                    )}
                  </div>
                </FileInput>
              </div>
            )}
            {files &&
              files.length > 0 &&
              files.map((file, index) => (
                <ProductFileUploaderItem key={index} index={index}>
                  <div key={file.name} className='w-32 h-32 rounded-lg border border-gay-300'>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className='object-contain w-full h-full rounded-lg'
                      onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                    />
                  </div>
                </ProductFileUploaderItem>
              ))}
          </FileUploaderContent>
        </div>
      </FileUploader>
    </div>
  )
}

export default UploadProductImages
