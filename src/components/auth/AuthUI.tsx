import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import EmailSignIn from '@/components/auth-ui/EmailSignIn'
import ForgotPassword from '@/components/auth-ui/ForgotPassword'
import OauthSignIn from '@/components/auth-ui/OauthSignIn'
import PasswordSignIn from '@/components/auth-ui/PasswordSignIn'
import Separator from '@/components/auth-ui/Separator'
import SignUp from '@/components/auth-ui/Signup'
import UpdatePassword from '@/components/auth-ui/UpdatePassword'

type Props = {
  viewProp: string
  allowEmail: boolean
  allowPassword: boolean
  allowOauth: boolean
  disableButton: boolean
}

const AuthPaths = ['email_signin', 'password_signin', 'signup', 'forgot_password', 'update_password']

export default function AuthUI() {
  const viewProp = useLocation().pathname.split('/').pop()

  const props: Props = useMemo(() => {
    if (!viewProp)
      return { viewProp: '', allowEmail: false, allowPassword: false, allowOauth: false, disableButton: false }

    return {
      viewProp,
      allowEmail: viewProp === 'email_signin' || viewProp === 'signup' || viewProp === 'forgot_password',
      allowPassword: viewProp === 'password_signin' || viewProp === 'signup' || viewProp === 'email_signin',
      allowOauth:
        viewProp === 'email_signin' ||
        viewProp === 'signup' ||
        viewProp === 'forgot_password' ||
        viewProp === 'password_signin',
      disableButton: viewProp === 'email_signin' || viewProp === 'signup' || viewProp === 'forgot_password',
    }
  }, [viewProp])

  useEffect(() => {
    if (!viewProp || !AuthPaths.includes(viewProp)) {
      window.location.href = '/auth/signin/password_signin'
    }
  })

  return (
    <div className="my-auto mb-auto mt-8 flex flex-col md:mt-[70px] md:max-w-full lg:mt-[130px] lg:max-w-[420px]">
      <p className="text-[32px] font-bold text-zinc-950 dark:text-white">
        {props.viewProp === 'signup'
          ? 'Sign Up'
          : props.viewProp === 'forgot_password'
            ? 'Forgot Password'
            : props.viewProp === 'update_password'
              ? 'Update Password'
              : props.viewProp === 'email_signin'
                ? 'Email Sign In'
                : 'Sign In'}
      </p>
      <p className="mb-2.5 mt-2.5 font-normal text-zinc-950 dark:text-zinc-400">
        {props.viewProp === 'signup'
          ? 'Enter your email and password to sign up!'
          : props.viewProp === 'forgot_password'
            ? 'Enter your email to get a passoword reset link!'
            : props.viewProp === 'update_password'
              ? 'Choose a new password for your account!'
              : props.viewProp === 'email_signin'
                ? 'Enter your email to get a magic link!'
                : 'Enter your email and password to sign in!'}
      </p>
      {props.viewProp !== 'update_password' && props.viewProp !== 'signup' && props.allowOauth && (
        <>
          <OauthSignIn />
          <Separator />
        </>
      )}
      {props.viewProp === 'password_signin' && <PasswordSignIn allowEmail={props.allowEmail} />}
      {props.viewProp === 'email_signin' && (
        <EmailSignIn allowPassword={props.allowPassword} disableButton={props.disableButton} />
      )}
      {props.viewProp === 'forgot_password' && (
        <ForgotPassword allowEmail={props.allowEmail} disableButton={props.disableButton} />
      )}
      {props.viewProp === 'update_password' && <UpdatePassword />}
      {props.viewProp === 'signup' && <SignUp allowEmail={props.allowEmail} />}
    </div>
  )
}
