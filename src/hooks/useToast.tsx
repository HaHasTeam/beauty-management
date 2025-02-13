import { ShieldAlertIcon, ShieldCheckIcon, ShieldXIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

type ToastOptions = {
  message: string
  description?: string
  duration?: number
  onClose?: () => void
  isShowDescription?: boolean
}

export const useToast = () => {
  const { t } = useTranslation()
  const successToast = ({ message, description, duration, onClose, isShowDescription = true }: ToastOptions) => {
    toast.success(message, {
      description: (
        <span className='text-green-500 text-xs'>{isShowDescription && (description || t('toast.success'))}</span>
      ),
      icon: <ShieldCheckIcon size={20} />,
      duration,
      onDismiss: onClose
    })
  }

  const errorToast = ({ message, description, duration, onClose, isShowDescription = true }: ToastOptions) => {
    toast.error(message, {
      description: (
        <span className='text-red-500 text-xs'>{isShowDescription && (description || t('toast.error'))}</span>
      ),
      duration,
      onDismiss: onClose,
      icon: <ShieldXIcon size={20} />
    })
  }

  const warningToast = ({ message, description, duration, onClose, isShowDescription = true }: ToastOptions) => {
    toast.warning(message, {
      description: (
        <span className='text-yellow-500 text-xs'>{isShowDescription && (description || t('toast.warning'))}</span>
      ),
      duration,
      onDismiss: onClose,
      icon: <ShieldAlertIcon size={20} />
    })
  }

  const infoToast = ({ message, description, duration, onClose, isShowDescription = true }: ToastOptions) => {
    toast.info(message, {
      description: (
        <span className='text-blue-500 text-xs'>{isShowDescription && (description || t('toast.infor'))}</span>
      ),
      duration,
      onDismiss: onClose
    })
  }

  return {
    infoToast,
    successToast,
    errorToast,
    warningToast
  }
}
