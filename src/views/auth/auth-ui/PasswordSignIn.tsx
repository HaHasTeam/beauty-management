import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useShallow } from 'zustand/react/shallow'

import Button from '@/components/button'
import FormLabel from '@/components/form-label'
import { PasswordInput } from '@/components/password-input'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Routes, routesConfig } from '@/configs/routes'
import { defaultRequiredRegex, emailRegex, passwordRegexEasy } from '@/constants/regex'
import useHandleServerError from '@/hooks/useHandleServerError'
import { useToast } from '@/hooks/useToast'
import { signInWithPasswordApi } from '@/network/apis/user'
import { useStore } from '@/stores/store'

const getFormSchema = () => {
  return z.object({
    email: z
      .string()
      .regex(defaultRequiredRegex.pattern, defaultRequiredRegex.message())
      .regex(emailRegex.pattern, emailRegex.message()),
    password: z.string().regex(passwordRegexEasy.pattern, passwordRegexEasy.message())
  })
}

export default function PasswordSignIn() {
  const { t } = useTranslation()
  const formSchema = getFormSchema()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const { authenticate } = useStore(
    useShallow((state) => ({
      authenticate: state.setAuthState
    }))
  )
  const { successToast } = useToast()
  const handleServerError = useHandleServerError()
  const id = useId()
  const navigate = useNavigate()
  const handleLogin = async (email: string, password: string) => {
    try {
      const { data } = await signInWithPasswordFn({
        email,
        password
      })
      authenticate({
        isAuthenticated: true,
        authData: data
      })
      navigate(routesConfig[Routes.DASHBOARD_HOME].getPath())
    } catch (error) {
      handleServerError({
        error
      })
    }
  }
  const { mutateAsync: signInWithPasswordFn, isPending: isSignInWithPasswordLoading } = useMutation({
    mutationKey: [signInWithPasswordApi.mutationKey],
    mutationFn: signInWithPasswordApi.fn,
    onSuccess: () => {
      successToast({
        message: t('signIn.welcomeBack', { email: form.getValues('email') })
      })
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await handleLogin(values.email, values.password)
  }

  return (
    <div>
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)} className='w-full grid gap-4 mb-8' id={`form-${id}`}>
          <div className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>{t('signIn.email')}</FormLabel>
                  <FormControl>
                    <Input
                      className='h-[50px] focus:outline-0 dark:placeholder:text-zinc-400'
                      placeholder={t('signIn.emailPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>{t('signIn.password')}</FormLabel>
                  <FormControl>
                    <PasswordInput
                      className='h-[50px] w-full focus:outline-0 dark:placeholder:text-zinc-400'
                      placeholder={t('signIn.passwordPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end -mt-2'>
              <Link to='/auth/signin/forgot_password' className='font-medium text-primary text-sm hover:underline'>
                {t('signIn.forgotPassword')}
              </Link>
            </div>
          </div>

          <Button
            loading={isSignInWithPasswordLoading}
            type='submit'
            className='mt-2 flex h-[unset] w-full items-center justify-center rounded-lg px-4 py-4 text-sm font-medium'
          >
            {t('signIn.signInButton')}
          </Button>
        </form>
      </Form>

      <div className='px-8 py-6 border-t border-gray-200 dark:border-gray-600'>
        <p className='text-center text-gray-600 dark:text-gray-300'>
          {t('signIn.noAccount')}{' '}
          <Link to='/auth/signup' className='text-primary hover:underline font-medium'>
            {t('signIn.signUp')}
          </Link>
        </p>
      </div>
    </div>
  )
}
