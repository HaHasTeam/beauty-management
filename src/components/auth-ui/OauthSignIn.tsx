import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'

import { Button } from '@/components/ui/button'
import { Provider } from '@/types/types'

import { Input } from '../ui/input'

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
      icon: <FcGoogle className="h-5 w-5" />,
    },
    /* Add desired OAuth providers here */
  ]
  const [, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true) // Disable the button while the request is being handled

    setIsSubmitting(false)
  }

  return (
    <div className="mt-8">
      {oAuthProviders.map((provider) => (
        <form key={provider.name} className="pb-2" onSubmit={handleSubmit}>
          <Input type="hidden" name="provider" value={provider.name} />
          <Button variant="outline" type="submit" className="w-full text-zinc-950 py-6 dark:text-white">
            <span className="mr-2">{provider.icon}</span>
            <span>{provider.displayName}</span>
          </Button>
        </form>
      ))}
    </div>
  )
}
