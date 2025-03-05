import { useMemo } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { Routes, routesConfig } from '@/configs/routes'

import EmailSignIn from './auth-ui/EmailSignIn'
import EmailVerification from './auth-ui/EmailVerification'
import ForgotPassword from './auth-ui/ForgotPassword'
import OauthSignIn from './auth-ui/OauthSignIn'
import PasswordSignIn from './auth-ui/PasswordSignIn'
import Separator from './auth-ui/Separator'
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
  if (viewProp === 'email-verification') {
    return <EmailVerification />
  }

  return (
    <div className='my-auto mb-auto  flex flex-col md:max-w-full  lg:max-w-[420px]'>
      <p className='text-[32px] font-bold text-zinc-950 dark:text-white'>
        {props.viewProp === 'signup'
          ? 'Đăng ký'
          : props.viewProp === 'forgot-password'
            ? 'Forgot Password'
            : props.viewProp === 'update-password'
              ? 'Update Password'
              : props.viewProp === 'email-signin'
                ? 'Email Sign In'
                : 'Sign In'}
      </p>
      <p className='mb-2.5 mt-2.5 font-normal text-zinc-950 dark:text-zinc-400'>
        {props.viewProp === 'signup'
          ? 'Đăng ký bán hàng cùng Allure'
          : props.viewProp === 'forgot-password'
            ? 'Enter your email to get a password reset link!'
            : props.viewProp === 'update-password'
              ? 'Choose a new password for your account!'
              : props.viewProp === 'email-signin'
                ? 'Enter your email to get a magic link!'
                : 'Enter your email and password to sign in!'}
      </p>

      {props.viewProp === 'password-signin' && <PasswordSignIn allowEmail={props.allowEmail} />}
      {props.viewProp === 'email-signin' && (
        <EmailSignIn allowPassword={props.allowPassword} disableButton={props.disableButton} />
      )}
      {props.viewProp === 'forgot-password' && (
        <ForgotPassword allowEmail={props.allowEmail} disableButton={props.disableButton} />
      )}
      {props.viewProp === 'update-password' && <UpdatePassword />}
      {props.viewProp === 'signup' && <SignUp />}
      {props.viewProp !== 'update-password' && props.allowOauth && (
        <>
          <OauthSignIn />
          <Separator />
        </>
      )}
    </div>
  )
}
