import { FcGoogle } from 'react-icons/fc'

import { Button } from '@/components/ui/button'
import { getOauthGoogleUrl } from '@/configs/contants'
import { Provider } from '@/types/types'

type OAuthProviders = {
  name: Provider
  displayName: string
  icon: JSX.Element
}

export default function OauthSignIn() {
  const oAuthProviders: OAuthProviders[] = [
    {
      name: 'google',
      displayName: 'Google',
      icon: <FcGoogle className='h-5 w-5' />
    }
    /* Add desired OAuth providers here */
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // setIsSubmitting(true)
    window.location.href = getOauthGoogleUrl()
    // setIsSubmitting(false)
  }

  return (
    <div className='mt-8'>
      {oAuthProviders.map((provider) => (
        <form key={provider.name} className='pb-2' onSubmit={handleSubmit}>
          <Button variant='outline' type='submit' className='w-full border-primary text-zinc-950 py-6 dark:text-white'>
            <span className='mr-2'>{provider.icon}</span>
            <span>{provider.displayName}</span>
          </Button>
        </form>
      ))}
    </div>
  )
}
