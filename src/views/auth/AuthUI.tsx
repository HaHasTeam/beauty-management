import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useLocation } from 'react-router-dom'

import { Routes, routesConfig } from '@/configs/routes'

import EmailSignIn from './auth-ui/EmailSignIn'
import EmailVerification from './auth-ui/EmailVerification'
import ForgotPassword from './auth-ui/ForgotPassword'
import PasswordSignIn from './auth-ui/PasswordSignIn'
import SignUp from './auth-ui/Signup'
import UpdatePassword from './auth-ui/UpdatePassword'

type Props = {
  viewProp: string
  allowEmail: boolean
  allowPassword: boolean
  allowOauth: boolean
  disableButton: boolean
}

const AuthPaths = [
  'email-signin',
  'password-signin',
  'signup',
  'forgot-password',
  'update-password',
  'email-verification'
]

export default function AuthUI() {
  const { t } = useTranslation('layout')
  const viewProp = useLocation().pathname.split('/').pop()

  const props: Props = useMemo(() => {
    if (!viewProp)
      return { viewProp: '', allowEmail: false, allowPassword: false, allowOauth: false, disableButton: false }

    return {
      viewProp,
      allowEmail: viewProp === 'email-signin' || viewProp === 'signup' || viewProp === 'forgot-password',
      allowPassword: viewProp === 'password-signin' || viewProp === 'signup' || viewProp === 'email-signin',
      allowOauth:
        viewProp === 'email-signin' ||
        viewProp === 'signup' ||
        viewProp === 'forgot-password' ||
        viewProp === 'password-signin',
      disableButton: viewProp === 'email-signin' || viewProp === 'signup' || viewProp === 'forgot-password'
    }
  }, [viewProp])

  if (!viewProp || !AuthPaths.includes(viewProp)) {
    return <Navigate to={routesConfig[Routes.AUTH_LOGIN].getPath()} replace />
  }

  const getTitleKey = () => {
    switch (props.viewProp) {
      case 'signin':
        return 'signIn'
      case 'password-signin':
        return 'signIn'
      case 'email-signin':
        return 'emailSignIn'
      case 'forgot-password':
        return 'forgotPassword'
      case 'update-password':
        return 'updatePassword'
      case 'signup':
        return 'signup'
      case 'email-verification':
        return 'emailVerification'
      default:
        return 'signIn'
    }
  }

  const getDescriptionKey = () => {
    switch (props.viewProp) {
      case 'signin':
        return 'signIn'
      case 'password-signin':
        return 'signIn'
      case 'email-signin':
        return 'emailSignIn'
      case 'forgot-password':
        return 'forgotPassword'
      case 'update-password':
        return 'updatePassword'
      case 'signup':
        return 'signup'
      case 'email-verification':
        return 'emailVerification'
      default:
        return 'signIn'
    }
  }

  return (
    <div className='flex flex-col md:max-w-full'>
      <p className='text-[32px] font-bold text-zinc-950 dark:text-white'>{t(`authUI.titles.${getTitleKey()}`)}</p>
      <p className='mb-2.5 mt-2.5 font-normal text-zinc-950 dark:text-zinc-400'>
        {t(`authUI.descriptions.${getDescriptionKey()}`)}
      </p>
      {props.viewProp === 'password-signin' && <PasswordSignIn />}
      {props.viewProp === 'email-signin' && (
        <EmailSignIn allowPassword={props.allowPassword} disableButton={props.disableButton} />
      )}
      {props.viewProp === 'forgot-password' && (
        <ForgotPassword allowEmail={props.allowEmail} disableButton={props.disableButton} />
      )}
      {props.viewProp === 'update-password' && <UpdatePassword />}
      {props.viewProp === 'signup' && <SignUp />}
      {props.viewProp === 'email-verification' && <EmailVerification />}
    </div>
  )
}
