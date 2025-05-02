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
  const { t } = useTranslation()
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
  if (viewProp == 'email-verification') {
    return <EmailVerification />
  }

  const getTitleKey = () => {
    if (props.viewProp === 'signup') return 'signup'
    if (props.viewProp === 'forgot-password') return 'forgotPassword'
    if (props.viewProp === 'update-password') return 'updatePassword'
    if (props.viewProp === 'email-signin') return 'emailSignIn'
    return 'signIn'
  }

  const getDescriptionKey = () => {
    if (props.viewProp === 'signup') return 'signup'
    if (props.viewProp === 'forgot-password') return 'forgotPassword'
    if (props.viewProp === 'update-password') return 'updatePassword'
    if (props.viewProp === 'email-signin') return 'emailSignIn'
    return 'signIn'
  }

  return (
    <div className='my-auto mb-auto flex flex-col md:max-w-full lg:max-w-[420px]'>
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
    </div>
  )
}
