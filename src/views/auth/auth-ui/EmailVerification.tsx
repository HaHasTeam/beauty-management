import { useMutation, useQuery } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate } from 'react-router-dom'

import Button from '@/components/button'
import { Routes, routesConfig } from '@/configs/routes'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { activateAccountApi, resendMutateApi } from '@/network/apis/auth'
import type { TEmailDecoded } from '@/types/auth'

export default function EmailVerification() {
  const { t } = useTranslation('layout')
  const navigate = useNavigate()
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const queryParams = new URLSearchParams(window.location.search)
  const email = queryParams.get('email')
  const code = queryParams.get('code')
  const accountId = code ? jwtDecode<TEmailDecoded>(code).accountId : undefined

  const [isCountdownActive, setIsCountdownActive] = useState(false)
  const [countdown, setCountdown] = useState(60)

  const verifyEmailRedirectUrl = `${import.meta.env.VITE_SITE_URL}${routesConfig[Routes.AUTH_EMAIL_VERIFICATION].getPath()}`

  const { mutateAsync: resendMutate, isPending: isResendPending } = useMutation({
    mutationKey: [resendMutateApi.mutationKey],
    mutationFn: resendMutateApi.fn
  })

  const { data: activateAccountData, isFetching: isActivatingAccount } = useQuery({
    queryKey: [activateAccountApi.queryKey, accountId as string],
    queryFn: activateAccountApi.fn,
    enabled: !!accountId
  })

  useEffect(() => {
    let timer: number | undefined
    if (isCountdownActive && countdown > 0) {
      timer = window.setInterval(() => {
        setCountdown((prevCount) => prevCount - 1)
      }, 1000)
    } else if (countdown === 0) {
      setIsCountdownActive(false)
      setCountdown(60)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isCountdownActive, countdown])

  useEffect(() => {
    if (activateAccountData) {
      successToast({
        message: 'Account activated successfully!'
      })
      navigate(routesConfig[Routes.AUTH_LOGIN].getPath(), { replace: true })
    }
  }, [activateAccountData, navigate, successToast])

  const handleResend = async () => {
    if (!isCountdownActive && !isResendPending && email) {
      try {
        await resendMutate({
          email: email,
          url: verifyEmailRedirectUrl
        })
        successToast({ message: 'Verification email sent!' })
        setIsCountdownActive(true)
      } catch (_error) {
        handleServerError({
          error: _error
        })
        // Error handling is managed by the global error handler via useMutation onError
      }
    }
  }

  if (!email && !code && !accountId) {
    return <Navigate to={routesConfig[Routes.AUTH_LOGIN].getPath()} replace />
  }

  const isButtonDisabled = isCountdownActive || isResendPending || isActivatingAccount
  let buttonText = t('authUI.buttons.resendEmail')
  if (isResendPending) {
    buttonText = 'Sending...'
  } else if (isActivatingAccount && accountId) {
    buttonText = 'Verifying...'
  } else if (isCountdownActive) {
    buttonText = `Resend (${countdown}s)`
  }

  return (
    <div className='flex flex-col items-center justify-center pt-2'>
      <div className='flex justify-center py-6'>
        <div className='relative h-48 w-48'>
          <div className='absolute inset-0 transform rounded-lg bg-primary/30 dark:bg-primary/60'>
            <div className='absolute bottom-6 left-6 right-6 top-6 rounded bg-card dark:bg-card'>
              <div className='absolute left-4 top-6 h-2 w-16 rounded bg-primary/20 dark:bg-primary/70'></div>
              <div className='absolute left-4 top-10 h-2 w-24 rounded bg-primary/20 dark:bg-primary/70'></div>
              <div className='absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-green-400'>
                <Check className='h-10 w-10 text-white' />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex w-full flex-col gap-3 sm:flex-row sm:justify-center'>
        <Button
          className='w-full'
          variant={'ghost'}
          onClick={handleResend}
          disabled={isButtonDisabled}
          loading={isResendPending || (isActivatingAccount && !!accountId)}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  )
}
