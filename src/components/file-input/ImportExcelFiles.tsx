import { FilesIcon, Upload } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { DropzoneOptions } from 'react-dropzone'
import { useTranslation } from 'react-i18next'

import fallBackImage from '@/assets/images/fallBackImage.jpg'
import { FileInput, FileUploader, FileUploaderContent, ProductFileUploaderItem } from '@/components/file-input'
import useHandleServerError from '@/hooks/useHandleServerError'

import ImageWithFallback from '../image/ImageWithFallback'
import { ScrollArea } from '../ui/scroll-area'
import { PreviewDialog } from './PreviewImageDialog'

type UploadFileModalProps = {
  header?: ReactNode
  dropZoneConfigOptions?: DropzoneOptions
  renderInputUI?: (isDragActive: boolean, files: File[], maxFiles: number, message?: string) => ReactNode
  renderFileItemUI?: (files: File) => ReactNode
  vertical: boolean
  centerItem?: boolean
  isAcceptImage?: boolean
  isAcceptFile?: boolean
  isAcceptExcel?: boolean
  isFullWidth?: boolean
  onFilesChange?: (files: File[]) => void
}
const ImportExcelFiles = ({
  dropZoneConfigOptions,
  renderInputUI,
  renderFileItemUI,
  vertical = true,
  isAcceptImage = true,
  isAcceptFile = false,
  isAcceptExcel = false,
  isFullWidth = false,
  header,
  centerItem,
  onFilesChange
}: UploadFileModalProps) => {
  const { t } = useTranslation()
  const [files, setFiles] = useState<File[]>([])
  const isDragActive = false
  const handleServerError = useHandleServerError()

  const dropZoneConfig = {
    accept: isAcceptImage
      ? { 'image/*': ['.jpg', '.jpeg', '.png'] }
      : isAcceptFile
        ? {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc']
          }
        : isAcceptExcel
          ? {
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
              'application/vnd.ms-excel': ['.xls']
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

  const onFileDrop = (newFiles: File[] | null) => {
    try {
      if (!newFiles) {
        // If no files, reset to empty array
        setFiles([])
        onFilesChange?.([])
        return
      }

      // Prevent exceeding max files
      const filteredFiles = newFiles.slice(0, dropZoneConfigOptions?.maxFiles)

      // Remove duplicate files based on name and last modified
      const uniqueFiles = filteredFiles.filter(
        (file, index, self) =>
          index === self.findIndex((f) => f.name === file.name && f.lastModified === file.lastModified)
      )

      // Update local state
      setFiles(uniqueFiles)

      // Call optional callback with updated files
      onFilesChange?.(uniqueFiles)
    } catch (error) {
      handleServerError({ error })
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
                                      <ImageWithFallback
                                        fallback={fallBackImage}
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
                                  <ImageWithFallback
                                    fallback={fallBackImage}
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
export default ImportExcelFiles
