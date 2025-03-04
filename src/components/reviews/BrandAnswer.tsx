import { Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'

import { useStore } from '@/stores/store'
import { RoleEnum } from '@/types/enum'
import { IReplyFeedback, IResponseFeedback } from '@/types/feedback'
import { UserRoleEnum } from '@/types/role'

import RoleTag from '../account/RoleTag'
import Button from '../button'
import { ReplyFeedbackForm } from '../feedback/ReplyFeedbackForm'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface BrandAnswerProps {
  replies: IReplyFeedback[]
  feedback: IResponseFeedback
  isOpen: boolean
  showRep: boolean
  setShowRep: Dispatch<SetStateAction<boolean>>
  replyFormRef: React.RefObject<HTMLDivElement>
  onReplyClick: () => void
}
const BrandAnswer = ({
  replies,
  feedback,
  isOpen,
  showRep,
  setShowRep,
  replyFormRef,
  onReplyClick
}: BrandAnswerProps) => {
  const { t } = useTranslation()

  const { user } = useStore(
    useShallow((state) => ({
      user: state.user
    }))
  )
  const [showAllReplies, setShowAllReplies] = useState(false)

  if (!replies || replies.length === 0) {
    return null
  }

  const displayedReplies = showAllReplies || replies.length <= 2 ? replies : replies.slice(0, 2)

  const toggleReplies = () => {
    setShowAllReplies(!showAllReplies)
  }

  return (
    <div className='pl-6 pr-2'>
      <div>
        {displayedReplies.map((reply) => {
          const brandLogo = ''
          const brandName = ''
          const updatedAt = reply.updatedAt
          const description = reply.content
          const brand = null
          const account = reply.account
          return (
            <>
              <div className='rounded-md'>
                <div className='flex gap-2 items-start'>
                  {brand ? (
                    <Avatar>
                      <AvatarImage src={brandLogo} alt={brandName} />
                      <AvatarFallback>{brandName?.charAt(0) ?? 'A'}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar>
                      <AvatarImage src={account.avatar} alt={account.firstName} />
                      <AvatarFallback>{account.firstName?.charAt(0) ?? 'A'}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className='space-y-1'>
                    <div className='flex gap-2 items-center'>
                      {brand ? (
                        <span className='font-semibold text-sm'>{brandName}</span>
                      ) : (
                        (account.firstName || account.lastName) && (
                          <span className='font-semibold text-sm'>
                            {[account?.firstName, account?.lastName].join(' ')}
                          </span>
                        )
                      )}
                      {brand && <RoleTag role={UserRoleEnum.MANAGER} isBrand size='small' />}
                    </div>
                    {brand &&
                      user.role !== RoleEnum.CUSTOMER &&
                      user.role !== RoleEnum.CONSULTANT &&
                      user.role !== RoleEnum.KOL && (
                        <div className='flex items-center gap-1'>
                          <span className='font-semibold text-sm'>
                            {[account?.firstName, account?.lastName].join(' ')}
                          </span>
                        </div>
                      )}
                    <p className='mt-2 text-sm text-gray-700'>{description}</p>
                  </div>
                </div>
              </div>
              <div className='ml-12 flex items-center gap-2'>
                <span className='text-muted-foreground font-medium text-xs'>
                  {t('date.toLocaleDateTimeString', { val: new Date(updatedAt) })}
                </span>
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-muted-foreground hover:bg-transparent hover:text-muted-foreground/80'
                  onClick={onReplyClick}
                >
                  {t('feedback.reply')}
                </Button>
              </div>
            </>
          )
        })}
      </div>
      {replies.length > 2 && (
        <div className='ml-12'>
          <Button
            variant='ghost'
            size='sm'
            onClick={toggleReplies}
            className='p-0 text-muted-foreground hover:bg-transparent hover:text-muted-foreground/80 hover:underline'
          >
            {showAllReplies ? t('button.showLess') : t('button.showMore', { count: replies.length - 2 })}
          </Button>
        </div>
      )}
      {showRep && <ReplyFeedbackForm ref={replyFormRef} isOpen={isOpen} feedback={feedback} setShowRep={setShowRep} />}
    </div>
  )
}

export default BrandAnswer
