// import { useMutation } from '@tanstack/react-query'
import { FilesIcon, PlayCircle, Upload } from 'lucide-react'
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
  setIsMediaUpload?: React.Dispatch<SetStateAction<boolean>>
  isAcceptImage?: boolean
  isAcceptFile?: boolean
  isFullWidth?: boolean
  isAcceptVideo?: boolean
  maxImages: number
  maxVideos: number
}

const UploadMediaFiles = <T extends FieldValues>({
  dropZoneConfigOptions,
  field,
  header,
  renderInputUI,
  renderFileItemUI,
  vertical = true,
  centerItem = false,
  isAcceptImage = true,
  isAcceptVideo = false,
  isAcceptFile = false,
  maxImages,
  maxVideos,
  setIsImagesUpload,
  setIsMediaUpload,
  isFullWidth = false
}: UploadFileModalProps<T>) => {
  const { t } = useTranslation()
  const [files, setFiles] = useState<File[]>([])
  const handleServerError = useHandleServerError()

  // Track file types separately
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [videoFiles, setVideoFiles] = useState<File[]>([])
  const [otherFiles, setOtherFiles] = useState<File[]>([])

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
    accept: {
      ...(isAcceptImage ? { 'image/*': ['.jpg', '.jpeg', '.png'] } : {}),
      ...(isAcceptVideo ? { 'video/*': ['.mp4', '.wmv', '.mov', '.avi', '.mkv', '.flv'] } : {}), //mp4|mov|avi|mkv|wmv|flv
      ...(isAcceptFile
        ? {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
          }
        : {})
    },
    multiple: true,
    maxFiles: maxImages + maxVideos || 10,
    maxSize: 10 * 1024 * 1024, // 10MB default max size
    ...dropZoneConfigOptions
  } satisfies DropzoneOptions

  // Organize files by type
  const updateFilesByType = (allFiles: File[]) => {
    const images = allFiles.filter((file) => file.type.includes('image'))
    const videos = allFiles.filter((file) => file.type.includes('video'))
    const others = allFiles.filter((file) => !file.type.includes('image') && !file.type.includes('video'))

    setImageFiles(images)
    setVideoFiles(videos)
    setOtherFiles(others)

    return { images, videos, others }
  }

  // Check if file limits are exceeded
  const checkFileLimits = (files: File[]) => {
    const { images, videos } = updateFilesByType(files)

    if (maxImages && images.length > maxImages) {
      handleServerError({
        error: new Error(t('validation.maxImagesExceeded', { count: maxImages }))
      })
      return false
    }

    if (maxVideos && videos.length > maxVideos) {
      handleServerError({
        error: new Error(t('validation.maxVideosExceeded', { count: maxVideos }))
      })
      return false
    }

    return true
  }

  useEffect(() => {
    const transferData = async () => {
      try {
        if (Array.isArray(fieldValue)) {
          if (fieldValue.length === files.length) {
            return
          }

          setFiles(field?.value)
          updateFilesByType(field?.value)
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
      if (setIsMediaUpload) {
        setIsMediaUpload(true)
      } else if (setIsImagesUpload) {
        setIsImagesUpload(true)
      }

      // String type handling (single file)
      if (fieldType === 'string') {
        if (!newFiles?.length && field.onChange) {
          field.onChange('' as unknown as React.ChangeEvent<HTMLInputElement>)
        }
        if (newFiles?.length) {
          field?.onChange?.(newFiles[0] as unknown as React.ChangeEvent<HTMLInputElement>)
        }
        return
      }

      // Array type handling (multiple files)
      if (fieldType === 'array' && field?.value) {
        if (!newFiles) {
          return field.onChange?.([] as unknown as React.ChangeEvent<HTMLInputElement>)
        }

        let updatedFiles: File[] = []

        // Adding new files
        if (newFiles.length > oldFiles.length) {
          const diffedFiles = newFiles.filter((file) => {
            return !oldFiles?.some(
              (oldFile) => oldFile.name === file.name && oldFile.lastModified === file.lastModified
            )
          })

          updatedFiles = [...field.value, ...diffedFiles]

          // Check if file limits are exceeded
          if (!checkFileLimits(updatedFiles)) {
            return // Don't update if limits exceeded
          }

          setFiles(updatedFiles)
          updateFilesByType(updatedFiles)

          field?.onChange?.(updatedFiles as unknown as React.ChangeEvent<HTMLInputElement>)
        }
        // Removing files
        else {
          const deletedIndex = oldFiles.findIndex((oldFile) => {
            return !newFiles.some((file) => file.name === oldFile.name && file.lastModified === oldFile.lastModified)
          })

          if (deletedIndex !== -1) {
            updatedFiles = [...field.value]
            updatedFiles.splice(deletedIndex, 1)

            setFiles(updatedFiles)
            updateFilesByType(updatedFiles)

            field?.onChange?.(updatedFiles as unknown as React.ChangeEvent<HTMLInputElement>)
          }
        }
      }
    } catch (error) {
      handleServerError({
        error
      })
    }
  }

  // Build message about file types and limits
  const getAcceptedFormatsMessage = () => {
    const formats = Object.values(dropZoneConfig.accept).flat().join(', ')

    let message = `${t('validation.fileCountValid', { count: dropZoneConfig.maxFiles })}. ${t('validation.fileFormat')} ${formats}. ${t('validation.sizeFileValid', { size: dropZoneConfig.maxSize / (1024 * 1024) })}`

    if (maxImages && maxVideos) {
      message += ` ${t('validation.fileTypeLimits', { imageCount: maxImages, videoCount: maxVideos })}`
    } else if (maxImages) {
      message += ` ${t('validation.maxImages', { count: maxImages })}`
    } else if (maxVideos) {
      message += ` ${t('validation.maxVideos', { count: maxVideos })}`
    }

    return message
  }

  const message = getAcceptedFormatsMessage()

  // Get appropriate icon and preview for file type
  const getFilePreview = (file: File) => {
    if (file.type.includes('image')) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className='object-contain w-full h-full rounded-lg'
          onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
        />
      )
    } else if (file.type.includes('video')) {
      return (
        <div className='relative w-full h-full flex items-center justify-center bg-black/5 rounded-lg'>
          <video
            src={URL.createObjectURL(file)}
            controls
            className='max-w-full max-h-full rounded-lg'
            onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
          >
            {t('validation.videoBrowser')}
          </video>
          <PlayCircle className='absolute text-primary w-10 h-10 pointer-events-none' />
        </div>
      )
    } else {
      return <FilesIcon className='w-12 h-12 text-muted-foreground' />
    }
  }

  // Get file type for preview dialog
  const getFileContentType = (file: File) => {
    if (file.type.includes('image')) return 'image'
    if (file.type.includes('video')) return 'video'
    return 'text'
  }

  // Preview content for dialog
  const getPreviewContent = (file: File) => {
    if (file.type.includes('image')) {
      return URL.createObjectURL(file)
    } else if (file.type.includes('video')) {
      return (
        <div className='flex items-center justify-center'>
          <video src={URL.createObjectURL(file)} controls className='max-w-full max-h-full'>
            {t('validation.videoBrowser')}
          </video>
        </div>
      )
    } else {
      return (
        <div className='flex items-center justify-center'>
          <FilesIcon className='w-12 h-12 text-muted-foreground' />
          <span className='text-sm font-medium truncate max-w-[200px]'>{file.name}</span>
        </div>
      )
    }
  }

  // Additional statistics for UI - but not passing to renderInputUI to match interface
  const fileStats = {
    totalCount: files.length,
    imageCount: imageFiles.length,
    videoCount: videoFiles.length,
    otherCount: otherFiles.length,
    maxImagesReached: maxImages ? imageFiles.length >= maxImages : false,
    maxVideosReached: maxVideos ? videoFiles.length >= maxVideos : false,
    maxFilesReached: files.length >= dropZoneConfig.maxFiles
  }

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
              {/* Display upload button if not reached max files */}
              {!fileStats.maxFilesReached && (
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
                            {!fileStats.maxFilesReached ? (
                              <span className='mt-2 text-sm text-primary px-8'>{message}</span>
                            ) : (
                              <span className='mt-2 text-sm text-primary px-8'>{t('createProduct.reachMaxFiles')}</span>
                            )}
                            <span className='mt-2 text-xs text-muted-foreground'>
                              {t('validation.imageCount', { defaultValue: 'Images' })}: {fileStats.imageCount}/
                              {maxImages || '∞'},{t('validation.videoCount', { defaultValue: 'Videos' })}:{' '}
                              {fileStats.videoCount}/{maxVideos || '∞'}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </FileInput>
                </div>
              )}

              {/* Display files */}
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
                              content={getPreviewContent(file)}
                              trigger={
                                renderFileItemUI ? (
                                  renderFileItemUI(file)
                                ) : (
                                  <div
                                    key={file.name}
                                    className='w-32 h-32 rounded-lg border border-gay-300 p-0 relative'
                                  >
                                    {getFilePreview(file)}
                                    {/* {file.type.includes('video') && (
                                      <div className="absolute bottom-1 right-1 bg-black/50 text-white rounded-full p-1">
                                        <Video className="w-4 h-4" />
                                      </div>
                                    )} */}
                                  </div>
                                )
                              }
                              contentType={getFileContentType(file)}
                            />
                          </div>
                        </ProductFileUploaderItem>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <>
                    {files.map((file, index) => (
                      <ProductFileUploaderItem
                        key={index}
                        index={index}
                        className={`${isFullWidth ? 'w-full h-16' : 'w-32 h-32'} p-0 flex items-center justify-between rounded-lg hover:border-primary`}
                      >
                        <PreviewDialog
                          content={getPreviewContent(file)}
                          trigger={
                            renderFileItemUI ? (
                              renderFileItemUI(file)
                            ) : (
                              <div key={file.name} className='relative w-32 h-32 rounded-lg border border-gay-300 p-0'>
                                {getFilePreview(file)}
                                {/* {file.type.includes('video') && (
                                  <div className="absolute bottom-1 right-1 bg-black/50 text-white rounded-full p-1">
                                    <Video className="w-4 h-4" />
                                  </div>
                                )} */}
                              </div>
                            )
                          }
                          contentType={getFileContentType(file)}
                        />
                      </ProductFileUploaderItem>
                    ))}
                  </>
                ))}
            </FileUploaderContent>
          </div>
        </FileUploader>
      </div>
    </>
  )
}

export default UploadMediaFiles
