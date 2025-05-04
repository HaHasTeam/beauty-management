import { useMutation } from '@tanstack/react-query'
import _ from 'lodash'
import {
  Download,
  File,
  FileIcon,
  FileSpreadsheet,
  FileText,
  ImageIcon,
  ImagePlus,
  PlayCircle,
  Video,
  VideoIcon
} from 'lucide-react'
import * as React from 'react'
import { ReactNode, RefObject, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { DropzoneOptions } from 'react-dropzone'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import useHandleServerError from '@/hooks/useHandleServerError'
import { uploadFilesApi } from '@/network/apis/file'
import { CustomFile, FileStatusEnum, TFile } from '@/types/file'
import { createFiles } from '@/utils/files'

import { PreviewDialog } from '../file-input/PreviewImageDialog'
import ImageWithFallback from '../image/ImageWithFallback'
import { ScrollArea } from '../ui/scroll-area'
import { FileInput, FileUploader, FileUploaderContent, ProductFileUploaderItem } from '.'

export type TriggerUploadRef = {
  triggers: (() => Promise<void>)[]
}
export const formSchema = z
  .object({
    images: z.array(
      z.object({
        name: z.string().nullable(),
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
  header?: ReactNode
  renderInputUI?: (isDragActive: boolean, files: File[], maxFiles: number, message?: string) => ReactNode
  renderFileItemUI?: (files: File) => ReactNode
  vertical?: boolean
  centerItem?: boolean
  isAcceptImage?: boolean
  isAcceptFile?: boolean
  isAcceptExcel?: boolean
  isAcceptVideo?: boolean
  isFullWidth?: boolean
  readOnly?: boolean
  maxVideos?: number
  maxImages?: number
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

const UploadFiles = ({
  dropZoneConfigOptions,
  field,
  triggerRef,
  header,
  renderInputUI,
  renderFileItemUI,
  vertical = false,
  centerItem = false,
  isAcceptImage = true,
  isAcceptFile = false,
  isAcceptExcel = false,
  isAcceptVideo = false,
  isFullWidth = false,
  readOnly = false,
  maxVideos = 0,
  maxImages = 0
}: UploadFilesProps) => {
  const { t } = useTranslation()
  const [files, setFiles] = useState<CustomFile[]>([])
  const handleServerError = useHandleServerError()

  const dropZoneConfig = {
    accept: {
      ...(isAcceptImage || !!maxImages ? { 'image/*': ['.jpg', '.jpeg', '.png'] } : {}),
      ...(isAcceptVideo || !!maxVideos ? { 'video/*': ['.mp4', '.wmv', '.mov', '.avi', '.mkv', '.flv'] } : {}),
      ...(isAcceptFile
        ? {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc']
          }
        : {}),
      ...(isAcceptExcel
        ? {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls']
          }
        : {})
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024, // 10MB default max size
    ...dropZoneConfigOptions,
    maxFiles:
      maxImages + maxVideos
        ? maxImages + maxVideos
        : dropZoneConfigOptions?.maxFiles
          ? dropZoneConfigOptions?.maxFiles
          : 10
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

  // Keep a reference to previous field value for comparison
  const prevFieldValueRef = useRef<TFile | TFile[] | null>(null)

  useEffect(() => {
    // Function to check if field value has actually changed
    const hasFieldValueChanged = () => {
      // Comparing with previous fieldValue
      if (!prevFieldValueRef.current) return true

      // Handle single file case
      if (fieldType === 'single') {
        const prevSingle = prevFieldValueRef.current as TFile
        if (!fieldValue || !prevSingle) return prevSingle !== fieldValue
        // Compare important properties
        return (
          prevSingle.id !== (fieldValue as TFile).id ||
          prevSingle.fileUrl !== (fieldValue as TFile).fileUrl ||
          prevSingle.status !== (fieldValue as TFile).status
        )
      }

      // Handle multiple files case
      if (fieldType === 'multiple') {
        const prevMultiple = prevFieldValueRef.current as TFile[]
        if (!fieldValue || !prevMultiple) return true
        if (prevMultiple.length !== (fieldValue as TFile[]).length) return true

        // Compare files by key properties
        for (let i = 0; i < (fieldValue as TFile[]).length; i++) {
          const currentFile = (fieldValue as TFile[])[i]
          const prevFile = prevMultiple[i]

          if (
            currentFile.id !== prevFile.id ||
            currentFile.fileUrl !== prevFile.fileUrl ||
            currentFile.status !== prevFile.status ||
            currentFile.name !== prevFile.name
          ) {
            return true
          }
        }
        return false
      }

      return false
    }

    const transferData = async () => {
      try {
        // Only process if there's an actual change
        if (!hasFieldValueChanged()) return

        // Update reference to current value for next comparison
        prevFieldValueRef.current = _.cloneDeep(fieldValue)

        if (fieldType === 'single' && fieldValue) {
          // Skip if values seem equivalent
          if (
            (fieldValue === ({} as TFile) && files.length === 0) ||
            (!!fieldValue.fileUrl && files.length === 1 && files[0].fileUrl === fieldValue.fileUrl)
          ) {
            return
          }
          const constructedFiles = await createFiles([fieldValue])
          setFiles(constructedFiles)
        }

        if (fieldType === 'multiple' && fieldValue) {
          // More thorough check for array equivalence
          if (fieldValue.length === files.length && !hasFieldValueChanged()) {
            return
          }

          const constructedFiles = await createFiles(fieldValue)
          setFiles(constructedFiles)
        }
      } catch (error) {
        // eslint-disable-next-line
        console.error(error)
      }
    }

    transferData()
    // eslint-disable-next-line
  }, [fieldValue, fieldType])

  const onFileDrop = async (newFiles: CustomFile[] | null) => {
    if (readOnly) return
    try {
      if (fieldType === 'single') {
        const file = newFiles ? newFiles[0] : null

        let fileUrl = ''
        if (file) {
          fileUrl = file.fileUrl || (file instanceof Blob ? URL.createObjectURL(file) : '')
        }

        const fileItem: TFile = {
          fileUrl: fileUrl,
          name: file?.name as string
        }

        if (field.onChange) field.onChange(fileItem as unknown as React.ChangeEvent<HTMLInputElement>)
        return setFiles([file as CustomFile])
      }
      if (fieldType === 'multiple') {
        const updatedFiles: CustomFile[] = []

        // First handle existing files
        if (files.length > 0) {
          for (const existingFile of files) {
            // Skip files that are already marked as inactive
            if (existingFile.status === FileStatusEnum.INACTIVE) {
              // Keep inactive files in the result
              updatedFiles.push(existingFile)
              continue
            }

            const stillExists = newFiles?.some((newFile) => {
              // Check if newFile has a matching ID or name
              if (existingFile.id && newFile.id) {
                return newFile.id === existingFile.id && newFile.status !== FileStatusEnum.INACTIVE
              }
              // For files without ID, check name match
              return !existingFile.id && !newFile.id && newFile.name === existingFile.name
            })

            if (stillExists) {
              // File still exists in the new selection, keep it as is
              updatedFiles.push(existingFile)
            } else if (existingFile.id) {
              // File with ID is no longer selected, mark as inactive
              const file = existingFile
              Object.assign(file, { status: FileStatusEnum.INACTIVE })
              updatedFiles.push(file as CustomFile)
            }
            // If no ID, and not in newFiles, it will be removed (not added to updatedFiles)
          }
        }

        // Then add new files that don't exist in updated files
        if (newFiles) {
          for (const newFile of newFiles) {
            // Skip new files that are already marked as inactive
            if (newFile.status === FileStatusEnum.INACTIVE) continue

            const fileExists = updatedFiles.some((file) => {
              // For files with ID, check ID match
              if (newFile.id && file.id) {
                return file.id === newFile.id
              }
              // For files without ID, check name match
              return !newFile.id && !file.id && file.name === newFile.name
            })

            if (!fileExists) {
              // This is a new file that doesn't exist in the updated files
              updatedFiles.push(newFile)
            }
          }
        }

        // Check if we exceed file limits before updating
        if (maxImages > 0 || maxVideos > 0) {
          if (!checkFileLimits(updatedFiles)) {
            return // Don't update if limits exceeded
          }
        }

        const fileValues: TFile[] = updatedFiles.map((file) => {
          let fileUrl = file.fileUrl || ''
          if (!fileUrl && file instanceof Blob && !file.id) {
            try {
              fileUrl = URL.createObjectURL(file)
            } catch {
              fileUrl = ''
            }
          }

          return {
            id: file.id ?? undefined,
            fileUrl: fileUrl,
            name: file.name as string,
            status: file.status ?? undefined
          }
        }) as TFile[]

        if (field.onChange) field.onChange(fileValues as unknown as React.ChangeEvent<HTMLInputElement>)
        return setFiles(updatedFiles)
      }
    } catch (error) {
      handleServerError({
        error: error as Error
      })
    }
  }

  const handleReadOnlyDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_newFiles: CustomFile[] | null) => {
      // Không làm gì khi readOnly
    },
    []
  )

  const handleUploadFiles = useCallback(async () => {
    if (readOnly) return

    try {
      const formData = new FormData()
      let filesNeedUpload = false

      files.forEach((file, index) => {
        // Skip files that already have a URL (from the server)
        const mappingFile = (field.value as TFile[])[index]
        if (
          (!!file.fileUrl && !file.fileUrl.includes('blob')) ||
          (!!mappingFile && !!mappingFile.fileUrl && !mappingFile.fileUrl.includes('blob')) ||
          file.id
        )
          return

        filesNeedUpload = true
        formData.append('files', file)
      })

      // If no files need to be uploaded, return the current files without API call
      if (!filesNeedUpload) {
        const currentFiles: TFile[] = files.map((file) => ({
          id: file.id ?? undefined,
          name: file.name,
          fileUrl: file.fileUrl || '',
          status: file.status ?? undefined
        }))

        if (field.onChange) {
          if (fieldType === 'single') {
            field.onChange(currentFiles[0] as unknown as React.ChangeEvent<HTMLInputElement>)
          }
          if (fieldType === 'multiple') {
            field.onChange(currentFiles as unknown as React.ChangeEvent<HTMLInputElement>)
          }
        }
        return
      }

      const constructedFiles: TFile[] = await uploadFilesFn(formData).then((res) => {
        const fileItem = res.data

        let fileIndex = 0
        const result = files.map((file) => {
          if (file.fileUrl && file.fileUrl.includes('http')) {
            return {
              id: file.id ?? undefined,
              name: file.name,
              fileUrl: file.fileUrl,
              status: file.status ?? undefined
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
      // eslint-disable-next-line
      console.error(error)
    }
    // eslint-disable-next-line
  }, [field, fieldType, files, handleServerError, uploadFilesFn, readOnly])

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

  const activeFiles = files
    .map((file, index) => {
      if (file.status === FileStatusEnum.INACTIVE) {
        return null
      }
      Object.assign(file, { index })
      return file
    })
    .filter((value): value is CustomFile => value !== null)

  const isDragActive = false

  // Thêm một Map để lưu trữ liên kết giữa các file và URL của chúng
  const objectUrlCache = useRef<Map<string, string>>(new Map()).current

  // Cải thiện hàm getSafeObjectURL với useCallback để tránh tạo mới liên tục
  const getSafeObjectURL = useCallback((file: CustomFile): string => {
    // Tạo key duy nhất cho file dựa trên id hoặc name
    const fileKey = file.id || file.name || ''

    // Nếu file có URL từ server, trả về trực tiếp
    if (file.fileUrl && typeof file.fileUrl === 'string' && file.fileUrl.startsWith('http')) {
      return file.fileUrl
    }

    // Kiểm tra cache trước khi tạo mới
    if (objectUrlCache.has(fileKey)) {
      return objectUrlCache.get(fileKey) || ''
    }

    // Nếu không có trong cache và là file Blob, tạo mới URL và lưu vào cache
    if (file instanceof Blob) {
      try {
        const objectUrl = URL.createObjectURL(file)
        objectUrlCache.set(fileKey, objectUrl)
        return objectUrl
      } catch {
        // Bỏ qua lỗi
      }
    }

    // Trường hợp có fileUrl là Blob URI, trả về nó
    if (file.fileUrl && typeof file.fileUrl === 'string') {
      objectUrlCache.set(fileKey, file.fileUrl)
      return file.fileUrl
    }

    return ''
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Thêm useEffect để cleanup các URL khi component unmount
  useEffect(() => {
    return () => {
      // Cleanup tất cả ObjectURL khi component unmount
      objectUrlCache.forEach((url) => {
        if (url && !url.startsWith('http')) {
          try {
            URL.revokeObjectURL(url)
          } catch {
            // Bỏ qua lỗi
          }
        }
      })
      objectUrlCache.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Helper function to categorize files by type
  const getFilesByType = (allFiles: CustomFile[]) => {
    const images = allFiles.filter((file) => file.type?.includes('image') || false)
    const videos = allFiles.filter((file) => file.type?.includes('video') || false)
    const others = allFiles.filter((file) => !file.type?.includes('image') && !file.type?.includes('video'))

    return { images, videos, others }
  }

  // Check if file limits are exceeded
  const checkFileLimits = (checkFiles: CustomFile[]): boolean => {
    const { images, videos } = getFilesByType(checkFiles)
    const activeImages = images.filter((file) => file.status !== FileStatusEnum.INACTIVE)
    const activeVideos = videos.filter((file) => file.status !== FileStatusEnum.INACTIVE)
    if (maxImages && activeImages.length > maxImages) {
      handleServerError({
        error: new Error(t('validation.maxImagesExceeded', { count: maxImages }))
      })
      return false
    }

    if (maxVideos && activeVideos.length > maxVideos) {
      handleServerError({
        error: new Error(t('validation.maxVideosExceeded', { count: maxVideos }))
      })
      return false
    }

    return true
  }

  // Get content type for preview dialog
  const getFileContentType = (file: CustomFile) => {
    if (file.type?.includes('image')) return 'image'
    if (file.type?.includes('video')) return 'video'
    return 'text'
  }

  // Thêm component mới để hiển thị tên file bị cắt ở giữa
  const TruncatedFileName = ({ fileName, maxLength = 18 }: { fileName: string; maxLength?: number }) => {
    if (!fileName || fileName.length <= maxLength) return <span>{fileName}</span>

    const extension = fileName.includes('.') ? `.${fileName.split('.').pop()}` : ''
    const nameWithoutExtension = fileName.includes('.') ? fileName.substring(0, fileName.lastIndexOf('.')) : fileName

    const halfMaxLength = Math.floor((maxLength - extension.length) / 2)
    const start = nameWithoutExtension.substring(0, halfMaxLength)
    const end = nameWithoutExtension.substring(nameWithoutExtension.length - halfMaxLength)

    return (
      <span title={fileName}>
        {start}...{end}
        {extension}
      </span>
    )
  }

  // Thêm component hiển thị file extension badge
  const FileExtensionBadge = ({ fileName }: { fileName: string }) => {
    const extension = fileName?.split('.').pop()?.toLowerCase() || ''

    let bgColor = 'bg-gray-200'
    let textColor = 'text-gray-800'

    switch (extension) {
      case 'pdf':
        bgColor = 'bg-red-100'
        textColor = 'text-red-700'
        break
      case 'doc':
      case 'docx':
        bgColor = 'bg-blue-100'
        textColor = 'text-blue-700'
        break
      case 'xls':
      case 'xlsx':
        bgColor = 'bg-green-100'
        textColor = 'text-green-700'
        break
      case 'jpg':
      case 'jpeg':
      case 'png':
        bgColor = 'bg-purple-100'
        textColor = 'text-purple-700'
        break
      case 'mp4':
      case 'mov':
      case 'avi':
        bgColor = 'bg-pink-100'
        textColor = 'text-pink-700'
        break
    }

    if (extension === 'avatar') {
      return null
    }
    return (
      <span
        className={`absolute top-1 left-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-sm ${bgColor} ${textColor}`}
      >
        {extension}
      </span>
    )
  }

  // Cập nhật FileDownloadButton để có giao diện đẹp hơn
  const FileDownloadButton = ({ file }: { file: CustomFile }) => {
    const handleDownload = (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()

      if (file.fileUrl && file.fileUrl.startsWith('http')) {
        const link = document.createElement('a')
        link.href = file.fileUrl
        link.download = file.name || 'download'
        link.target = '_blank'
        link.rel = 'noopener noreferrer'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }

    // Nếu là file thông thường (không phải video/image), hiển thị overlay khi hover
    if (!file.type?.includes('video') && !file.type?.includes('image')) {
      return (
        <div className='absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'>
          <div
            onClick={handleDownload}
            className='flex flex-col items-center gap-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg shadow-sm cursor-pointer hover:bg-white hover:shadow-md'
          >
            <Download className='h-6 w-6 text-primary' />
            <span className='text-xs font-medium text-primary'>
              {t('common.download', { defaultValue: 'Download' })}
            </span>
          </div>
        </div>
      )
    }

    // Nếu là video/image, hiển thị nút nhỏ ở góc
    return (
      <button
        onClick={handleDownload}
        className='absolute bottom-1 right-1 bg-white/90 dark:bg-gray-800/90 p-1 rounded-full shadow-sm hover:bg-white dark:hover:bg-gray-700 transition-colors'
        title={t('common.download', { defaultValue: 'Download file' })}
      >
        <Download className='h-3.5 w-3.5 text-gray-600 dark:text-gray-300' />
      </button>
    )
  }

  // Cập nhật hàm getFileIcon sử dụng các icon đúng
  const getFileIcon = (file: CustomFile) => {
    if (!file.type) return <FileIcon className='w-10 h-10 text-muted-foreground' />

    const extension = file.name?.split('.').pop()?.toLowerCase() || ''

    if (file.type.includes('pdf') || extension === 'pdf') {
      return <FileText className='w-10 h-10 text-red-500' />
    } else if (
      file.type.includes('excel') ||
      file.type.includes('spreadsheet') ||
      extension === 'xlsx' ||
      extension === 'xls'
    ) {
      return <FileSpreadsheet className='w-10 h-10 text-green-600' />
    } else if (
      file.type.includes('word') ||
      file.type.includes('document') ||
      extension === 'doc' ||
      extension === 'docx'
    ) {
      return <FileText className='w-10 h-10 text-blue-600' />
    } else if (file.type.includes('video') || ['mp4', 'mov', 'avi', 'wmv'].includes(extension)) {
      return <Video className='w-10 h-10 text-purple-500' />
    }

    return <File className='w-10 h-10 text-gray-500' />
  }

  // Cập nhật hàm getPreviewContent để sử dụng VideoThumbnail
  const getPreviewContent = (file: CustomFile) => {
    if (file.type?.includes('image')) {
      // Giữ nguyên hiển thị cho image
      return getSafeObjectURL(file)
    } else if (file.type?.includes('video')) {
      // Giữ nguyên hiển thị cho video
      return (
        <div className='flex items-center justify-center p-4 w-full'>
          <div className='flex flex-col w-full gap-3'>
            <div className='text-sm font-medium text-center text-muted-foreground'>
              <TruncatedFileName fileName={file.name} maxLength={30} />
            </div>
            <VideoThumbnail file={file} showControls={true} className='aspect-video' />
            {file.fileUrl && file.fileUrl.startsWith('http') && (
              <div className='flex justify-end mt-2'>
                <a
                  href={file.fileUrl}
                  download={file.name}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20'
                >
                  <Download className='h-4 w-4' />
                  {t('common.download', { defaultValue: 'Download' })}
                </a>
              </div>
            )}
          </div>
        </div>
      )
    } else {
      // Cải thiện hiển thị cho các file khác (không phải image/video)
      return (
        <div className='flex flex-col items-center justify-center gap-4 p-5'>
          {getFileIcon(file)}
          <span className='text-base font-medium text-center max-w-[300px]'>
            <TruncatedFileName fileName={file.name} maxLength={30} />
          </span>
          {file.fileUrl && file.fileUrl.startsWith('http') && (
            <div className='w-full max-w-[200px] mt-2'>
              <a
                href={file.fileUrl}
                download={file.name}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-md hover:bg-primary/90 w-full'
              >
                <Download className='h-5 w-5' />
                <span>{t('common.download', { defaultValue: 'Download file' })}</span>
              </a>
            </div>
          )}
        </div>
      )
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

  const customMessage = getAcceptedFormatsMessage()

  // Cập nhật component VideoThumbnail để đơn giản hơn, không phụ thuộc vào thumbnail
  const VideoThumbnail = ({
    file,
    className = '',
    showControls = false
  }: {
    file: CustomFile
    className?: string
    showControls?: boolean
  }) => {
    const videoUrl = getSafeObjectURL(file)
    const [isLoading, setIsLoading] = useState(true)
    const videoRef = useRef<HTMLVideoElement>(null)

    // Cache video url bằng useMemo
    const memoizedVideoUrl = useMemo(() => videoUrl, [videoUrl])

    // Đặt state loading
    useEffect(() => {
      const video = videoRef.current
      if (video && memoizedVideoUrl) {
        // Video đã load xong
        const handleLoaded = () => {
          setIsLoading(false)
        }

        // Video gặp lỗi
        const handleError = () => {
          setIsLoading(false)
        }

        video.addEventListener('loadeddata', handleLoaded)
        video.addEventListener('error', handleError)

        return () => {
          video.removeEventListener('loadeddata', handleLoaded)
          video.removeEventListener('error', handleError)
        }
      }
    }, [memoizedVideoUrl])

    return (
      <div className={`relative w-full h-full rounded-lg overflow-hidden ${className}`}>
        {/* Hiển thị placeholder khi đang loading */}
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/5 z-10'>
            <Video className='w-10 h-10 text-gray-400 animate-pulse' />
          </div>
        )}

        {/* Video */}
        <video
          ref={videoRef}
          src={memoizedVideoUrl}
          className='object-cover w-full h-full rounded-lg'
          muted
          loop
          preload='metadata'
          playsInline
          controls={showControls}
          onLoadedMetadata={(e) => {
            // Đặt thời gian để hiển thị frame mong muốn
            e.currentTarget.currentTime = 0.1
          }}
          onMouseOver={(e) => {
            if (showControls) return // Không auto-play nếu đang hiển thị controls
            const video = e.currentTarget
            // Đảm bảo video hiển thị frame đầu tiên trước khi phát
            if (video.readyState >= 2) {
              video.play().catch(() => {
                // Bỏ qua lỗi auto-play
              })
            }
          }}
          onMouseOut={(e) => {
            if (showControls) return // Không tự dừng nếu đang hiển thị controls
            e.currentTarget.pause()
            e.currentTarget.currentTime = 0.1
          }}
        >
          {t('validation.videoBrowser')}
        </video>

        {/* Overlay với icon play, chỉ hiển thị khi không có controls */}
        {!showControls && (
          <div className='absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 rounded-lg'>
            <PlayCircle className='text-white w-10 h-10 drop-shadow-md' />
          </div>
        )}

        {/* File extension badge */}
        <FileExtensionBadge fileName={file.name} />

        {/* Download button */}
        {file.fileUrl && file.fileUrl.startsWith('http') && <FileDownloadButton file={file} />}
      </div>
    )
  }

  const triggerRenderFileItem = useCallback(
    (file: CustomFile) => {
      return renderFileItemUI ? (
        renderFileItemUI(file as unknown as File)
      ) : (
        <div
          key={file.name}
          className='w-32 h-32 rounded-lg border border-muted hover:border-primary overflow-hidden relative'
        >
          {file.type?.includes('image') ? (
            <>
              <ImageWithFallback
                fallback={fallBackImage}
                src={getSafeObjectURL(file)}
                alt={file.name}
                className='object-contain w-full h-full rounded-lg'
                onLoad={() => {
                  // Không làm gì ở đây, để cleanup được xử lý khi component unmount
                }}
              />
              <FileExtensionBadge fileName={file.name} />
            </>
          ) : file.type?.includes('video') ? (
            <VideoThumbnail key={file.name} file={file} />
          ) : (
            <div className='w-full h-full flex flex-col items-center justify-center bg-gray-50 p-2 rounded-lg gap-1 relative'>
              {getFileIcon(file)}
              <span className='text-xs text-center font-medium text-gray-700 mt-1 max-w-full'>
                <TruncatedFileName fileName={file.name} maxLength={15} />
              </span>
              <FileExtensionBadge fileName={file.name} />
              {file.fileUrl && file.fileUrl.startsWith('http') && <FileDownloadButton file={file} />}
            </div>
          )}
        </div>
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [renderFileItemUI]
  )

  const { images, videos } = getFilesByType(files)

  return (
    <>
      {header}
      <div
        className={`flex transition-all duration-300 ${isDragActive ? 'border-primary bg-primary/10 dark:bg-accent' : 'border-muted-foreground'}`}
      >
        <FileUploader
          value={files}
          onValueChange={readOnly ? handleReadOnlyDrop : onFileDrop}
          dropzoneOptions={dropZoneConfig}
          className={`${vertical ? '' : 'flex'}`}
          orientation='horizontal'
        >
          <div className='flex w-full flex-wrap'>
            <FileUploaderContent
              className={`flex ${vertical ? 'flex-col' : 'flex-row flex-wrap'} ${centerItem ? 'justify-center' : 'justify-start'} w-full gap-2`}
            >
              {activeFiles && activeFiles.length < dropZoneConfig.maxFiles && (
                <div className={isFullWidth ? 'w-full' : 'min-w-fit'}>
                  <FileInput disabled={isUploadingFiles || readOnly}>
                    {renderInputUI ? (
                      <div>
                        {renderInputUI(
                          isDragActive,
                          activeFiles as unknown as File[],
                          dropZoneConfig.maxFiles,
                          customMessage
                        )}
                      </div>
                    ) : (
                      <div className='w-32 h-32 overflow-hidden hover:bg-primary/15 flex flex-col items-center justify-center text-center border border-dashed rounded-xl border-primary py-2 text-primary transition-all duration-500'>
                        <ImagePlus className='size-8 mb-2 text-primary' />
                        {isDragActive ? (
                          <p className='text-lg font-medium text-foreground'>{t('createProduct.dropFile')}</p>
                        ) : (
                          <div className='px-1'>
                            <p className='text-sm font-medium text-primary'>Kéo & thả hoặc duyệt tệp</p>
                            <p className='mt-1 text-xs text-primary'>
                              {maxImages && maxVideos ? (
                                <div className='flex gap-2 items-center justify-center'>
                                  <span className='flex gap-1 items-center'>
                                    <VideoIcon size={14} /> (
                                    {videos?.filter((video) => video.status !== FileStatusEnum.INACTIVE).length || 0}/
                                    {maxVideos})
                                  </span>
                                  <span className='flex gap-1 items-center'>
                                    <ImageIcon size={12} /> (
                                    {images?.filter((image) => image.status !== FileStatusEnum.INACTIVE).length || 0}/
                                    {maxImages})
                                  </span>
                                </div>
                              ) : (
                                <div>
                                  ({activeFiles?.length || 0}/{dropZoneConfig.maxFiles})
                                </div>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </FileInput>
                </div>
              )}
              {activeFiles && activeFiles.length > 0 && (
                <div className={`${vertical ? 'w-full' : 'flex-1'}`}>
                  {vertical ? (
                    <ScrollArea className='h-40 w-full rounded-md py-2 border-t-4 border-primary'>
                      <div className='flex gap-2 px-4'>
                        {activeFiles.map((file) => (
                          <ProductFileUploaderItem
                            key={file?.index}
                            index={file?.index ?? 0}
                            className='p-0 flex items-center justify-between rounded-lg hover:border-primary'
                          >
                            <div className='w-full h-full'>
                              <PreviewDialog
                                className='lg:max-w-xl md:max-w-md sm:max-w-sm max-w-xs xl:max-w-xl'
                                content={getPreviewContent(file)}
                                trigger={triggerRenderFileItem(file)}
                                contentType={getFileContentType(file)}
                              />
                            </div>
                          </ProductFileUploaderItem>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className='flex flex-wrap gap-2'>
                      {activeFiles.map((file) => {
                        return (
                          <ProductFileUploaderItem
                            key={file?.index}
                            index={file?.index ?? 0}
                            className={`${isFullWidth ? 'w-full h-16' : 'w-32 h-32'} p-0 flex items-center justify-between rounded-lg hover:border-primary`}
                          >
                            <PreviewDialog
                              content={getPreviewContent(file)}
                              trigger={triggerRenderFileItem(file)}
                              contentType={getFileContentType(file)}
                            />
                          </ProductFileUploaderItem>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </FileUploaderContent>
          </div>
        </FileUploader>
      </div>
    </>
  )
}

export default UploadFiles
