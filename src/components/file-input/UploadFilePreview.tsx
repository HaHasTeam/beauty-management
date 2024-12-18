import { FilesIcon, Upload } from 'lucide-react'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { DropzoneOptions } from 'react-dropzone'
import type { ControllerRenderProps, FieldValues } from 'react-hook-form'

import { ScrollArea } from '@/components/ui/scroll-area'
import useHandleServerError from '@/hooks/useHandleServerError'

import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from '.'
import { PreviewDialog } from './PreviewImageDialog'

type UploadFileModalProps<T extends FieldValues> = {
  header?: ReactNode
  dropZoneConfigOptions?: DropzoneOptions
  field: ControllerRenderProps<T>
  renderInputUI?: (isDragActive: boolean, files: File[], maxFiles: number, message?: string) => ReactNode
  renderFileItemUI?: (files: File) => ReactNode
  vertical: boolean
}

const UploadFilePreview = <T extends FieldValues>({
  dropZoneConfigOptions,
  field,
  header,
  renderInputUI,
  renderFileItemUI,
  vertical = true
}: UploadFileModalProps<T>) => {
  const [files, setFiles] = useState<File[]>([])
  const handleServerError = useHandleServerError()

  const { fieldType, fieldValue } = useMemo<{
    fieldType: 'string' | 'array' | 'object'
    fieldValue: string | string[]
  }>(() => {
    if (typeof field?.value === 'string') {
      if (dropZoneConfigOptions?.maxFiles && dropZoneConfigOptions?.maxFiles > 1) {
        throw new Error('Field value must be an array')
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
    throw new Error('Field value must be a string or an array')
  }, [field?.value, dropZoneConfigOptions?.maxFiles])

  const isDragActive = false
  const dropZoneConfig = {
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx']
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

        if (!newFiles) return field.onChange?.([] as unknown as React.ChangeEvent<HTMLInputElement>)
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
  const message = `You can upload up to ${dropZoneConfig.maxFiles} files. Accepted file formats are ${Object.values(
    dropZoneConfig.accept
  )
    .flat()
    .join(', ')}. Each file must be under ${dropZoneConfig.maxSize / (1024 * 1024)}MB.`
  return (
    <>
      {header}
      <div className={`   ${isDragActive ? 'border-primary bg-primary/10 dark:bg-accent' : 'border-muted-foreground'}`}>
        <FileUploader
          value={files}
          onValueChange={onFileDrop}
          dropzoneOptions={dropZoneConfig}
          className={`${vertical ? '' : 'flex '}`}
        >
          <FileInput>
            {renderInputUI ? (
              renderInputUI(isDragActive, files, dropZoneConfig.maxFiles, message)
            ) : (
              <div className='overflow-hidden hover:bg-primary/15 flex flex-col items-center justify-center text-center w-full border border-dashed rounded-xl   border-primary py-4 text-primary transition-all duration-500'>
                <Upload className='w-12 h-12 mb-4 text-muted-foreground' />
                {isDragActive ? (
                  <p className='text-lg font-medium text-foreground'>Drop your file here</p>
                ) : (
                  <>
                    <p className='text-lg font-medium text-primary'>Drag & drop your files here</p>
                    <p className='mt-2 text-sm text-muted-foreground'>or click to select files</p>
                    {files && files.length < dropZoneConfig.maxFiles ? (
                      <span className='mt-2 text-sm text-primary px-8'>{message} </span>
                    ) : (
                      <span className='mt-2 text-sm text-primary px-8'>
                        {`You have reached the maximum number of files allowed`}
                      </span>
                    )}
                  </>
                )}
              </div>
            )}
          </FileInput>
          <FileUploaderContent>
            {files && files.length > 0 && (
              <div className=''>
                {/* <p className='text-sm font-medium text-muted-foreground flex justify-center gap-2 items-center pb-2'>
                  <TbWorldUpload /> <span>{files.length} file(s) selected</span>
                </p> */}

                {vertical ? (
                  <ScrollArea className='h-[120px] w-full rounded-md shadow-2xl py-2 border-t-4 border-primary'>
                    <div className='flex gap-2 px-4'>
                      {files.map((file, index) => (
                        <FileUploaderItem
                          key={index}
                          index={index}
                          className='flex items-center justify-between rounded-lg hover:bg-primary w-full'
                        >
                          <PreviewDialog
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
                                <div key={file.name} className='flex items-center space-x-3'>
                                  <div className='rounded-md flex items-center justify-center'>
                                    {file.type.includes('image') ? (
                                      <img
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        className='size-12 object-cover rounded-lg border-2'
                                        onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                                      />
                                    ) : (
                                      <FilesIcon className='w-12 h-12 text-muted-foreground' />
                                    )}
                                  </div>
                                  <span className='text-sm font-medium truncate max-w-[200px]'>{file.name}</span>
                                </div>
                              )
                            }
                            contentType={file.type.includes('image') ? 'image' : undefined}
                          />
                        </FileUploaderItem>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  // <ScrollArea className='h-[120px] w-full rounded-md shadow-2xl py-2 border-t-4 border-primary'>
                  <div className='flex gap-2 '>
                    {files.map((file, index) => (
                      <FileUploaderItem
                        key={index}
                        index={index}
                        className='flex items-center justify-between rounded-lg hover:bg-primary '
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
                              <div key={file.name} className='flex items-center space-x-3'>
                                <div className='rounded-md flex items-center justify-center'>
                                  {file?.type?.includes('image') ? (
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={file.name}
                                      className='size-12 object-cover rounded-lg border-2'
                                      onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                                    />
                                  ) : (
                                    <FilesIcon className='w-12 h-12 text-muted-foreground' />
                                  )}
                                </div>
                                <span className='text-sm font-medium truncate max-w-[200px]'>{file.name}</span>
                              </div>
                            )
                          }
                          contentType={file?.type?.includes('image') ? 'image' : undefined}
                        />
                      </FileUploaderItem>
                    ))}
                  </div>
                  //</ScrollArea>
                )}
              </div>
            )}
          </FileUploaderContent>
        </FileUploader>
      </div>
    </>
  )
}

export default UploadFilePreview
