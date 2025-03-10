import { useMutation, useQuery } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { CircleHelpIcon, LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MdMarkEmailRead } from 'react-icons/md'
import { SiMinutemailer } from 'react-icons/si'
import { Navigate, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Routes, routesConfig } from '@/configs/routes'
import { emailContact } from '@/constants/infor'
import { activateAccountApi, resendMutateApi } from '@/network/apis/auth'
import type { TEmailDecoded } from '@/types/auth'

const EmailVerification = () => {
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(window.location.search)
  const email = queryParams.get('email')
  const code = queryParams.get('code')

  const accountId = code ? jwtDecode<TEmailDecoded>(code).accountId : undefined

  const verifyEmailRedirectUrl = import.meta.env.VITE_SITE_URL + routesConfig[Routes.AUTH_EMAIL_VERIFICATION].getPath()

  // Add state for countdown timer
  const [isCountdownActive, setIsCountdownActive] = useState(false)
  const [countdown, setCountdown] = useState(60)

  // Handle countdown timer
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

  const { mutateAsync, isPending } = useMutation({
    mutationKey: [resendMutateApi.mutationKey],
    mutationFn: resendMutateApi.fn
  })

  const { data: activateAccountData, isFetching: isActivatingAccount } = useQuery({
    queryKey: [activateAccountApi.queryKey, accountId as string],
    queryFn: activateAccountApi.fn,
    enabled: !!accountId
  })

  // Update the handleResend function to handle the case where email could be null
  const handleResend = async () => {
    if (!isCountdownActive && !isPending && email) {
      await mutateAsync({
        email: email,
        url: verifyEmailRedirectUrl
      })
      // Start countdown after successful resend
      setIsCountdownActive(true)
    }
  }

  if (!email && !code) {
    return <Navigate to={routesConfig[Routes.AUTH_LOGIN].getPath()} replace />
  }
  // if (!authData) {
  //   return (
  //     <Navigate
  //       to={routesConfig[Routes.AUTH_LOGIN].getPath({
  //         returnUrl: currentUrl
  //       })}
  //       replace
  //     />
  //   )
  // }

  if (activateAccountData) {
    return <Navigate to={routesConfig[Routes.DASHBOARD_HOME].getPath()} replace />
  }

  if (accountId) {
    return (
      <div className='my-auto mb-auto mt-8 flex flex-col md:mt-[70px] md:max-w-full lg:mt-[130px] lg:max-w-[420px] items-center gap-4 an'>
        {!isActivatingAccount ? (
          <LoaderCircle size={150} className='p-4 rounded-full bg-green-100 text-green-500 animate-spin' />
        ) : (
          <MdMarkEmailRead size={150} className='p-4 rounded-full bg-green-100 text-green-500 shadow-xl' />
        )}
        <a
          className='text-2xl flex items-center gap-2 font-thin py-2 bg-green-100 rounded-3xl px-8 cursor-pointer flex-col'
          href='https://mail.google.com/mail/u/0/#inbox'
        >
          {!isActivatingAccount ? 'Verification in progress' : 'Email Verified'}
        </a>
        <div className='flex items-center gap-2 mt-10'>
          <CircleHelpIcon size={30} />
          <h2 className='text-lg font-extralight flex-1'>
            Your email has been verified. Please wait while we redirect you to the dashboard. Contact{' '}
            <a
              href={`mailto:${emailContact}`}
              className='text-primary underline p-0.5 px-2 font-semibold text-sm rounded-3xl'
            >
              {emailContact}
            </a>{' '}
            if you need help.
          </h2>
        </div>
      </div>
    )
  }
  if (email) {
    return (
      <div className='my-auto mb-auto mt-8 flex flex-col md:mt-[70px] md:max-w-full lg:mt-[130px] lg:max-w-[420px] items-center gap-4 an'>
        <MdMarkEmailRead size={150} className='p-4 rounded-full bg-green-100 text-green-500 shadow-xl' />
        <a
          className='text-2xl flex items-center gap-2 font-thin py-2 bg-green-100 rounded-3xl px-8 cursor-pointer flex-col'
          href='https://mail.google.com/mail/u/0/#inbox'
        >
          <span className='capitalize dark:text-black'>Email Verification</span>
          <div className='flex gap-2 '>
            <SiMinutemailer size={30} className='p-1 rounded-full bg-green-500 animate-pulse text-white' />
            <span className='text-sm p-1 px-2 bg-green-500 text-white rounded-3xl shadow-md'>{email}</span>
          </div>
        </a>
        <div className='flex items-center gap-2 mt-10'>
          <CircleHelpIcon size={30} />
          <h2 className='text-lg font-extralight flex-1'>
            Hi there!, to complete your registration, please check your <b className='underline text-sm'>{email}</b>{' '}
            inbox. Contact{' '}
            <a
              href={`mailto:${emailContact}`}
              className='text-primary underline p-0.5 px-2 font-semibold text-sm rounded-3xl'
            >
              {emailContact}
            </a>{' '}
            if you need help.
          </h2>
        </div>
        <div className='flex items-center gap-2 mt-5'>
          <Button
            variant={'outline'}
            onClick={() => {
              navigate(routesConfig[Routes.DASHBOARD_HOME].path)
            }}
          >
            Register Brand
          </Button>
          <Button variant={'default'} onClick={handleResend} disabled={isCountdownActive || isPending}>
            {isPending ? 'Sending...' : isCountdownActive ? `Resend (${countdown}s)` : 'Resend'}
          </Button>
        </div>
      </div>
    )
  }
}

export default EmailVerification
