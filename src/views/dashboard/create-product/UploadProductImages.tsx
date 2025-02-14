// import { useMutation } from '@tanstack/react-query'
import { FilesIcon, Upload } from 'lucide-react'
import { ReactNode, SetStateAction, useEffect, useMemo, useState } from 'react'
import { DropzoneOptions } from 'react-dropzone'
import type { ControllerRenderProps, FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { FileInput, FileUploader, FileUploaderContent, ProductFileUploaderItem } from '@/components/file-input'
import { PreviewDialog } from '@/components/file-input/PreviewImageDialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import useHandleServerError from '@/hooks/useHandleServerError'
// import { useToast } from '@/hooks/useToast'
// import { uploadFilesApi } from '@/network/apis/file'
// import { createFiles } from '@/utils/files'

type UploadFileModalProps<T extends FieldValues> = {
  header?: ReactNode
  dropZoneConfigOptions?: DropzoneOptions
  field: ControllerRenderProps<T>
  renderInputUI?: (isDragActive: boolean, files: File[], maxFiles: number, message?: string) => ReactNode
  renderFileItemUI?: (files: File) => ReactNode
  vertical: boolean
  centerItem?: boolean
  setIsImagesUpload?: React.Dispatch<SetStateAction<boolean>>
  isAcceptImage?: boolean
  isAcceptFile?: boolean
  isFullWidth?: boolean
}

const UploadProductImages = <T extends FieldValues>({
  dropZoneConfigOptions,
  field,
  header,
  renderInputUI,
  renderFileItemUI,
  vertical = true,
  centerItem = false,
  isAcceptImage = true,
  isAcceptFile = false,
  setIsImagesUpload,
  isFullWidth = false
}: UploadFileModalProps<T>) => {
  const { t } = useTranslation()
  const [files, setFiles] = useState<File[]>([])
  const handleServerError = useHandleServerError()

  const { fieldType, fieldValue } = useMemo<{
    fieldType: 'string' | 'array' | 'object'
    fieldValue: string | string[]
  }>(() => {
    if (typeof field?.value === 'string') {
      if (dropZoneConfigOptions?.maxFiles && dropZoneConfigOptions?.maxFiles > 1) {
        throw new Error(t('validation.arrayRequired'))
      }

      return {
        fieldType: 'string',
        fieldValue: field?.value
      }
    } else if (Array.isArray(field?.value)) {
      return {
        fieldType: 'array',
        fieldValue: field?.value
      }
    } else if (typeof field?.value === 'object') {
      return {
        fieldType: 'array',
        fieldValue: field?.value
      }
    }
    throw new Error(t('validation.stringOrArrayRequired'))
  }, [field?.value, t, dropZoneConfigOptions?.maxFiles])

  const isDragActive = false
  const dropZoneConfig = {
    accept: isAcceptImage
      ? {
          'image/*': ['.jpg', '.jpeg', '.png']
          // 'application/pdf': ['.pdf'],
          // 'application/msword': ['.doc']
        }
      : isAcceptFile
        ? {
            // 'image/*': ['.jpg', '.jpeg', '.png']
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc']
          }
        : {
            'image/*': ['.jpg', '.jpeg', '.png'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc']
          },
    multiple: true,
    maxFiles: 10,
    maxSize: 1 * 1024 * 1024,
    ...dropZoneConfigOptions
  } satisfies DropzoneOptions

  useEffect(() => {
    const transferData = async () => {
      try {
        if (Array.isArray(fieldValue)) {
          if (fieldValue.length === files.length) {
            return
          }

          return setFiles(field?.value)
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

  const onFileDrop = async (newFiles: File[] | null) => {
    const oldFiles = files
    try {
      if (setIsImagesUpload) {
        setIsImagesUpload(true)
      }
      // Check file is string or array
      // If string, convert to file and set to state
      if (fieldType === 'string') {
        // Value must be an array of files
        if (!newFiles?.length && field.onChange) {
          field.onChange('' as unknown as React.ChangeEvent<HTMLInputElement>)
        }
        if (newFiles?.length) {
          // const fileUrls = await convertFileToUrl(newFiles)

          field?.onChange?.(newFiles[0] as unknown as React.ChangeEvent<HTMLInputElement>)
        }
      }

      // If array, set to state
      if (fieldType === 'array' && field?.value) {
        // console.log('!newFiles?.length', newFiles?.length)

        if (!newFiles) {
          return field.onChange?.([] as unknown as React.ChangeEvent<HTMLInputElement>)
        }
        if (newFiles.length > oldFiles.length) {
          const diffedFiles = newFiles.filter((file) => {
            return !oldFiles?.some(
              (oldFile) => oldFile.name === file.name && oldFile.lastModified === file.lastModified
            )
          })
          const updateFiles = [...diffedFiles, ...field.value]
          setFiles(updateFiles)
          // const newDiffedFileUrls = await convertFileToUrl(diffedFiles)
          field?.onChange?.([
            ...(field?.value as string[]),
            ...diffedFiles
          ] as unknown as React.ChangeEvent<HTMLInputElement>)
        } else {
          const deletedIndex = oldFiles.findIndex((oldFile) => {
            return !newFiles.some((file) => file.name === oldFile.name && file.lastModified === oldFile.lastModified)
          })

          if (deletedIndex !== -1) {
            const updatedFiles = [...field.value]
            updatedFiles.splice(deletedIndex, 1)

            setFiles(updatedFiles)
            field?.onChange?.(updatedFiles as unknown as React.ChangeEvent<HTMLInputElement>)
          }
        }
      }
      // const markedFiles = newFiles?.map((file) => {
      //   return new File([file], file.name, { type: file.type, lastModified: file.lastModified })
      // })

      // setFiles(markedFiles || [])
    } catch (error) {
      handleServerError({
        error
      })
    }
  }
  const message = `${t('validation.fileCountValid', { count: dropZoneConfig.maxFiles })}. ${t('validation.fileFormat')} ${Object.values(
    dropZoneConfig.accept
  )
    .flat()
    .join(', ')}. ${t('validation.sizeFileValid', { size: dropZoneConfig.maxSize / (1024 * 1024) })}`
  return (
    <>
      {header}
      <div
        className={`flex transition-all duration-300 ${isDragActive ? 'border-primary bg-primary/10 dark:bg-accent' : 'border-muted-foreground'}`}
      >
        <FileUploader
          value={files}
          onValueChange={onFileDrop}
          dropzoneOptions={dropZoneConfig}
          className={`${vertical ? '' : 'flex '}`}
          orientation='horizontal'
        >
          <div className='flex w-full flex-wrap'>
            <FileUploaderContent className={centerItem ? 'justify-center' : 'justify-start'}>
              {files && files.length < dropZoneConfig.maxFiles && (
                <div className={`${isFullWidth ? 'w-full' : ''}`}>
                  <FileInput>
                    {renderInputUI ? (
                      <div>{renderInputUI(isDragActive, files, dropZoneConfig.maxFiles, message)}</div>
                    ) : (
                      <div className='w-32 h-32 overflow-hidden hover:bg-primary/15 flex flex-col items-center justify-center text-center border border-dashed rounded-xl border-primary py-4 text-primary transition-all duration-500'>
                        <Upload className='w-12 h-12 mb-4 text-muted-foreground' />
                        {isDragActive ? (
                          <p className='text-lg font-medium text-foreground'>{t('createProduct.dropFile')}</p>
                        ) : (
                          <>
                            <p className='text-lg font-medium text-primary'>{t('createProduct.dragAndDrop')}</p>
                            <p className='mt-2 text-sm text-muted-foreground'>{t('createProduct.selectFile')}</p>
                            {files && files.length < dropZoneConfig.maxFiles ? (
                              <span className='mt-2 text-sm text-primary px-8'>{message} </span>
                            ) : (
                              <span className='mt-2 text-sm text-primary px-8'>{t('createProduct.reachMaxFiles')}</span>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </FileInput>
                </div>
              )}
              {files &&
                files.length > 0 &&
                (vertical ? (
                  <ScrollArea className='h-40 w-full rounded-md py-2 border-t-4 border-primary'>
                    <div className='flex gap-2 px-4'>
                      {files.map((file, index) => (
                        <ProductFileUploaderItem
                          key={index}
                          index={index}
                          className='p-0 flex items-center justify-between rounded-lg hover:border-primary'
                        >
                          <div className='w-full h-full'>
                            <PreviewDialog
                              className='lg:max-w-xl md:max-w-md sm:max-w-sm max-w-xs xl:max-w-xl'
                              content={
                                file.type.includes('image') ? (
                                  URL.createObjectURL(file)
                                ) : (
                                  <div className='flex items-center justify-center'>
                                    <FilesIcon className='w-12 h-12 text-muted-foreground' />
                                    <span className='text-sm font-medium truncate max-w-[200px]'>{file.name}</span>
                                  </div>
                                )
                              }
                              trigger={
                                renderFileItemUI ? (
                                  renderFileItemUI(file)
                                ) : (
                                  <div key={file.name} className='w-32 h-32 rounded-lg border border-gay-300 p-0'>
                                    {file.type.includes('image') ? (
                                      <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className='object-contain w-full h-full rounded-lg'
                                        onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                                      />
                                    ) : (
                                      <FilesIcon className='w-12 h-12 text-muted-foreground' />
                                    )}
                                  </div>
                                )
                              }
                              contentType={file.type.includes('image') ? 'image' : undefined}
                            />
                          </div>
                        </ProductFileUploaderItem>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  // <ScrollArea className='h-[120px] w-full rounded-md shadow-2xl py-2 border-t-4 border-primary'>
                  <>
                    {files.map((file, index) => (
                      <ProductFileUploaderItem
                        key={index}
                        index={index}
                        className={`${isFullWidth ? 'w-full h-16' : 'w-32 h-32'} p-0 flex items-center justify-between rounded-lg hover:border-primary`}
                      >
                        <PreviewDialog
                          content={
                            file?.type?.includes('image') ? (
                              URL.createObjectURL(file)
                            ) : (
                              <div className='flex items-center justify-center'>
                                <FilesIcon className='w-12 h-12 text-muted-foreground' />
                                <span className='text-sm font-medium truncate max-w-[200px]'>{file.name}</span>
                              </div>
                            )
                          }
                          trigger={
                            renderFileItemUI ? (
                              renderFileItemUI(file)
                            ) : (
                              <div key={file.name} className='w-32 h-32 rounded-lg border border-gay-300 p-0'>
                                {file?.type?.includes('image') ? (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className='object-contain w-full h-full rounded-lg'
                                    onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                                  />
                                ) : (
                                  <FilesIcon className='w-12 h-12 text-muted-foreground' />
                                )}
                              </div>
                            )
                          }
                          contentType={file?.type?.includes('image') ? 'image' : undefined}
                        />
                      </ProductFileUploaderItem>
                    ))}
                  </>
                  //</ScrollArea>
                ))}
            </FileUploaderContent>
          </div>
        </FileUploader>
      </div>
    </>
  )
}

export default UploadProductImages
