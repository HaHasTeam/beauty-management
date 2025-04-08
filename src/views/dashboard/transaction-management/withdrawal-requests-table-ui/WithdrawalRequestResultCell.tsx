import { format } from 'date-fns'
import { AlertCircleIcon, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

import { ImagePreviewThumbnail } from '@/components/image-preview'
import { Button } from '@/components/ui/button'
import { TWithdrawalRequest, WithdrawalStatusEnum } from '@/types/withdrawal-request'

interface WithdrawalRequestResultCellProps {
  withdrawalRequest: TWithdrawalRequest
}

export function WithdrawalRequestResultCell({ withdrawalRequest }: WithdrawalRequestResultCellProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Helper to format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm')
  }

  // For requests that have a processor
  const renderProcessor = () => {
    if (!withdrawalRequest.processedBy) return null

    return (
      <div className='flex items-center space-x-3 w-full'>
        <div className='flex-shrink-0'>
          {withdrawalRequest.processedBy.avatar ? (
            <img
              src={withdrawalRequest.processedBy.avatar}
              alt={withdrawalRequest.processedBy.username}
              className='h-8 w-8 rounded-full object-cover'
            />
          ) : (
            <div className='h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center'>
              <span className='text-xs font-medium text-gray-500'>
                {withdrawalRequest.processedBy.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className='flex flex-col min-w-0'>
          <div className='flex items-center'>
            <span className='text-sm font-medium mr-1'>Processed by:</span>
            <span className='text-sm font-semibold'>{withdrawalRequest.processedBy.username}</span>
          </div>
          <p className='text-xs text-gray-500'>{formatDate(withdrawalRequest.updatedAt)}</p>
        </div>
      </div>
    )
  }

  // For rejected requests
  const renderRejectionReason = () => {
    if (!withdrawalRequest.rejectedReason) return null

    return (
      <div className='mt-2 rounded-md bg-red-50 p-3 w-full'>
        <div className='flex'>
          <div className='flex-shrink-0'>
            <AlertCircleIcon className='h-5 w-5 text-red-400' />
          </div>
          <div className='ml-3 flex-1 min-w-0'>
            <h3 className='text-sm font-medium text-red-800'>Rejection Reason:</h3>
            <div className='mt-1 text-sm text-red-700'>
              <p className='break-words'>{withdrawalRequest.rejectedReason}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // For completed requests with evidence files
  const renderEvidence = () => {
    if (!withdrawalRequest.evidences || withdrawalRequest.evidences.length === 0) return null

    return (
      <div className='mt-3 w-full'>
        <div className='flex items-center justify-between mb-2'>
          <h4 className='text-sm font-medium'>Evidence Files ({withdrawalRequest.evidences.length})</h4>
        </div>
        <div className='grid grid-cols-3 gap-3'>
          {withdrawalRequest.evidences.map((evidence) => (
            <ImagePreviewThumbnail
              key={evidence.id}
              imageUrl={evidence.fileUrl}
              alt={evidence.name || 'Evidence image'}
            />
          ))}
        </div>
      </div>
    )
  }

  // For completed requests that have transaction ID - placeholder for now
  const renderTransactionId = () => {
    // This would need to be implemented based on your actual data structure
    // For now, let's assume there's no transaction ID field in the schema
    return null
  }

  const toggleDetails = () => {
    setIsDetailsOpen(!isDetailsOpen)
  }

  // Return different UI based on status
  switch (withdrawalRequest.status) {
    case WithdrawalStatusEnum.PENDING:
      return (
        <div className='text-sm text-gray-600 w-full'>
          <span>Awaiting review</span>
        </div>
      )

    case WithdrawalStatusEnum.APPROVED:
      return (
        <div className='w-full'>
          {renderProcessor()}
          <div className='mt-2 text-xs text-gray-500'>Being processed by admin</div>
        </div>
      )

    case WithdrawalStatusEnum.COMPLETED:
      return (
        <div className='w-full'>
          <div className='flex items-center justify-between w-full'>
            <div className='flex-1 min-w-0'>
              {renderProcessor()}
              {renderTransactionId()}
            </div>
            {withdrawalRequest.evidences && withdrawalRequest.evidences.length > 0 && (
              <Button variant='ghost' size='sm' className='h-7 px-2 flex-shrink-0 ml-2' onClick={toggleDetails}>
                {isDetailsOpen ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
              </Button>
            )}
          </div>
          {isDetailsOpen && renderEvidence()}
        </div>
      )

    case WithdrawalStatusEnum.REJECTED:
      return (
        <div className='w-full'>
          {renderProcessor()}
          {renderRejectionReason()}
        </div>
      )

    case WithdrawalStatusEnum.CANCELLED:
      return (
        <div className='text-sm text-gray-600 w-full'>
          <span>Cancelled by user</span>
          <p className='text-xs text-gray-500'>{formatDate(withdrawalRequest.updatedAt)}</p>
        </div>
      )

    default:
      return (
        <div className='text-sm text-gray-600 w-full'>
          <span>No data available</span>
        </div>
      )
  }
}
