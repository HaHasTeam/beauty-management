import { ShieldAlertIcon, ShieldCheckIcon, ShieldXIcon } from 'lucide-react'
import { toast } from 'sonner'

type ToastOptions = {
  message: string
  description?: string
  duration?: number
  onClose?: () => void
}

export const useToast = () => {
  const successToast = ({ message, description, duration, onClose }: ToastOptions) => {
    toast.success(message, {
      description: (
        <span className='text-green-500 text-xs'>
          {description || 'Your request has been successfully processed, continue with your work.'}
        </span>
      ),
      icon: <ShieldCheckIcon size={20} />,
      duration,
      onDismiss: onClose
    })
  }

  const errorToast = ({ message, description, duration, onClose }: ToastOptions) => {
    toast.error(message, {
      description: (
        <span className='text-red-500 text-xs'>
          {description ||
            'An error occurred while processing your request, please try again later. If the problem persists, please contact the support team.'}
        </span>
      ),
      duration,
      onDismiss: onClose,
      icon: <ShieldXIcon size={20} />
    })
  }

  const warningToast = ({ message, description, duration, onClose }: ToastOptions) => {
    toast.warning(message, {
      description: (
        <span className='text-yellow-500 text-xs'>
          {description ||
            'You are about to perform a unsafe action, please be cautious. If you are not sure, please contact the support team.'}
        </span>
      ),
      duration,
      onDismiss: onClose,
      icon: <ShieldAlertIcon size={20} />
    })
  }

  const infoToast = ({ message, description, duration, onClose }: ToastOptions) => {
    toast.info(message, {
      description: (
        <span className='text-blue-500 text-xs'>
          {description ||
            'This is an information message, you can use it to provide additional information to the user. If you are not sure, please contact the support team.'}
        </span>
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
