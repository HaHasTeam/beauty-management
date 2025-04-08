import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, Trash2, Upload, X } from 'lucide-react'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'

import Button from '@/components/button'
import { ImagePreviewThumbnail } from '@/components/image-preview'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/useToast'
import { uploadFilesApi } from '@/network/apis/file'
import { completeWithdrawalRequest } from '@/network/apis/withdrawal-request'
import { TWithdrawalRequest } from '@/types/withdrawal-request'

interface CompletedWithdrawalRequestDialogProps {
  withdrawalRequests: TWithdrawalRequest[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  showTrigger?: boolean
  onSuccess?: () => void
}

// Maximum number of files that can be uploaded
const MAX_FILES = 6

export function CompletedWithdrawalRequestDialog({
  withdrawalRequests,
  open,
  onOpenChange,
  showTrigger = true,
  onSuccess
}: CompletedWithdrawalRequestDialogProps) {
  const { successToast, errorToast } = useToast()
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const queryClient = useQueryClient()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    onDrop: (acceptedFiles) => {
      // Check if adding these files would exceed the maximum
      if (uploadedFiles.length + acceptedFiles.length > MAX_FILES) {
        errorToast({
          message: 'Too many files',
          description: `You can upload a maximum of ${MAX_FILES} files. Please remove some files before adding more.`
        })

        // Only add files up to the maximum limit
        const remainingSlots = MAX_FILES - uploadedFiles.length
        if (remainingSlots > 0) {
          setUploadedFiles((prev) => [...prev, ...acceptedFiles.slice(0, remainingSlots)])
        }
        return
      }

      setUploadedFiles((prev) => [...prev, ...acceptedFiles])
    }
  })

  // Remove a file from the uploaded files
  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Mutation for uploading files
  const { mutateAsync: uploadFilesFn, isPending: isUploading } = useMutation({
    mutationKey: [uploadFilesApi.mutationKey],
    mutationFn: uploadFilesApi.fn
  })

  // Mutation for completing withdrawal request
  const { mutateAsync: completeWithdrawalRequestFn, isPending: isCompleting } = useMutation({
    mutationKey: [completeWithdrawalRequest.mutationKey],
    mutationFn: completeWithdrawalRequest.fn,
    onSuccess: () => {
      successToast({
        message: 'Withdrawal request completed',
        description: `Successfully marked ${withdrawalRequests.length} withdrawal request(s) as completed.`
      })

      // Invalidate relevant queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: ['filterWithdrawalRequests']
      })

      // Reset form
      setUploadedFiles([])

      if (onSuccess) onSuccess()
      if (onOpenChange) onOpenChange(false)
    },
    onError: () => {
      errorToast({
        message: 'Error',
        description: 'Failed to complete the withdrawal request(s). Please try again.'
      })
    }
  })

  // Combine pending states
  const isPending = isUploading || isCompleting

  const handleComplete = async () => {
    if (uploadedFiles.length === 0) {
      errorToast({
        message: 'Evidence required',
        description: 'Please upload at least one image as evidence of the completed withdrawal.'
      })
      return
    }

    try {
      // First, upload the evidence files
      let evidenceIds: string[] = []

      if (uploadedFiles.length > 0) {
        const formData = new FormData()
        uploadedFiles.forEach((file) => {
          formData.append('files', file)
        })

        // Upload files and get their IDs
        const uploadResult = await uploadFilesFn(formData)
        evidenceIds = uploadResult.data
      }

      // Then complete the withdrawal requests
      await Promise.all(
        withdrawalRequests.map((request) =>
          completeWithdrawalRequestFn({
            id: request.id,
            evidences: evidenceIds
          })
        )
      )
    } catch {
      // Error handling is done in the mutation
    }
  }

  const content = (
    <DialogContent className='sm:max-w-lg max-h-[70vh] overflow-y-auto'>
      <DialogHeader className=''>
        <DialogTitle>Complete Withdrawal Request{withdrawalRequests.length > 1 ? 's' : ''}</DialogTitle>
        <DialogDescription>
          {withdrawalRequests.length === 1
            ? "Mark this withdrawal request as completed after you have transferred the funds to the user's account."
            : `Mark these ${withdrawalRequests.length} withdrawal requests as completed after you have transferred the funds to the users' accounts.`}
        </DialogDescription>
      </DialogHeader>
      <div className='grid gap-4 py-4 overflow-y-auto'>
        <div className='rounded-md bg-green-50 p-4 mb-2'>
          <div className='flex'>
            <div className='flex-shrink-0'>
              <Check className='h-5 w-5 text-green-500' aria-hidden='true' />
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-green-800'>Completing a Withdrawal</h3>
              <div className='mt-2 text-sm text-green-700'>
                <p className='mb-2'>By marking a withdrawal as completed, you confirm that:</p>
                <ul className='list-disc pl-5 space-y-1'>
                  <li>You have successfully transferred the requested amount to the user's bank account</li>
                  <li>You have the transaction ID or reference from your bank</li>
                  <li>The evidence uploaded clearly shows the completed transaction details</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className='grid gap-2'>
          <Label className='text-sm font-medium'>
            Evidence Upload <span className='text-red-500'>*</span>
            <span className='text-sm font-normal text-gray-500 ml-2'>
              (Max {MAX_FILES} files, {uploadedFiles.length}/{MAX_FILES} used)
            </span>
          </Label>

          {/* File upload area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : uploadedFiles.length >= MAX_FILES
                  ? 'border-orange-500/50 bg-orange-50/30 cursor-not-allowed'
                  : uploadedFiles.length > 0
                    ? 'border-green-500/30 bg-green-50/30'
                    : 'border-gray-300 hover:border-primary/50 hover:bg-slate-50'
            }`}
          >
            {uploadedFiles.length < MAX_FILES ? (
              <>
                <input {...getInputProps()} />
                <div className='flex flex-col items-center justify-center gap-2 py-2'>
                  <Upload className={`h-8 w-8 ${uploadedFiles.length > 0 ? 'text-green-500/70' : 'text-gray-400'}`} />
                  <div className='text-sm text-gray-600'>
                    <p className='font-medium'>
                      {isDragActive
                        ? 'Drop the evidence files here'
                        : 'Drag and drop evidence files here or click to browse'}
                    </p>
                    <p className='mt-1 text-xs text-gray-500'>
                      Upload proof of transfer (screenshots of bank transfer, payment receipt, etc.)
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className='flex flex-col items-center justify-center gap-2 py-4'>
                <div className='text-sm text-orange-700'>
                  <p className='font-medium'>Maximum number of files reached</p>
                  <p className='mt-1 text-xs'>Please remove some files before adding more.</p>
                </div>
              </div>
            )}
          </div>

          {/* Preview uploaded files */}
          {uploadedFiles.length > 0 && (
            <div className='mt-4'>
              <div className='flex items-center justify-between mb-2'>
                <h4 className='text-sm font-medium'>Evidence Files ({uploadedFiles.length})</h4>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='h-8 text-red-600 hover:text-red-700 hover:bg-red-50 p-0 px-2'
                  onClick={() => setUploadedFiles([])}
                >
                  <Trash2 className='h-3.5 w-3.5 mr-1' /> Clear all
                </Button>
              </div>
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className='relative group rounded-md border border-gray-200 overflow-hidden bg-gray-50'
                  >
                    <ImagePreviewThumbnail imageUrl={URL.createObjectURL(file)} alt={file.name} fileType={file.type} />
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(index)
                      }}
                      className='absolute top-1 right-1 bg-red-500 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className='text-xs text-muted-foreground mt-2'>
            Your evidence should clearly show: transaction amount, recipient details, date, and transaction ID
          </p>
        </div>
      </div>
      <DialogFooter className='pt-2 mt-2 border-t'>
        <DialogClose asChild>
          <Button type='button' variant='secondary' loading={isPending}>
            Cancel
          </Button>
        </DialogClose>
        <Button
          type='button'
          variant='default'
          className='bg-green-600 hover:bg-green-700 text-white gap-1'
          loading={isPending}
          onClick={handleComplete}
          disabled={uploadedFiles.length === 0}
        >
          {isPending ? (
            'Completing...'
          ) : (
            <>
              <Check className='h-4 w-4' />
              <span>Confirm Completion</span>
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  )

  if (!showTrigger) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {content}
      </Dialog>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='gap-1 border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
        >
          <Check className='h-3.5 w-3.5' />
          <span>Complete</span>
        </Button>
      </DialogTrigger>
      {content}
    </Dialog>
  )
}
