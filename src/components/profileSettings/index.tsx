import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import Notifications from './notification-settings'

const notifications = [
  { message: 'Your call has been confirmed.', time: '1 hour ago' },
  { message: 'You have a new message!', time: '1 hour ago' },
  { message: 'Your subscription is expiring soon!', time: '2 hours ago' },
]

const index = () => {
  return (
    <div className="relative mx-auto flex w-max max-w-full flex-col md:pt-[unset] lg:pt-[100px] lg:pb-[100px]">
      <div className="maw-w-full mx-auto w-full flex-col justify-center md:w-full md:flex-row xl:w-full">
        <Card className={'mb-5 h-min flex items-center aligh-center max-w-full py-8 px-4 dark:border-zinc-800'}>
          <Avatar className="min-h-[68px] min-w-[68px]">
            <AvatarImage src={''} />
            <AvatarFallback className="text-2xl font-bold dark:bg-accent/20">A</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xl font-extrabold  leading-[100%]  pl-4 md:text-3xl">Allure Beauty</p>
            <p className="text-sm font-medium  md:mt-2 pl-4 md:text-base">CEO and Founder</p>
          </div>
        </Card>
        <Card className={'mb-5 h-min max-w-full pt-8 pb-6 px-6 dark:border-zinc-800'}>
          <p className="text-xl font-extrabold  md:text-3xl">Account Details</p>
          <p className="mb-6 mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400 md:mt-4 md:text-base">
            Here you can change your account information
          </p>
          <label className="mb-3 flex cursor-pointer px-2.5 font-bold leading-none " htmlFor={'name'}>
            Your Name
            <p className="ml-1 mt-[1px] text-sm font-medium leading-none text-zinc-500 dark:text-zinc-400">
              (30 characters maximum)
            </p>
          </label>
          <div className="mb-8 flex flex-col md:flex-row">
            <form className="w-full" id="nameForm">
              <Input
                type="text"
                name="fullName"
                // defaultValue={props.user?.user_metadata.full_name ?? ''}
                defaultValue={'Allure Beauty'}
                placeholder="Please enter your full name"
                className={`mb-2 mr-4 flex h-full w-full px-4 py-4 outline-none md:mb-0`}
              />
            </form>
            <Button
              className="flex h-full max-h-full w-full items-center justify-center rounded-lg px-4 py-4 text-base font-medium md:ms-4 md:w-[300px]"
              form="nameForm"
              type="submit"
            >
              Update name
            </Button>
            <div className="mt-8 h-px w-full max-w-[90%] self-center bg-zinc-200 dark:bg-white/10 md:mt-0 md:hidden" />
          </div>

          <label className="mb-3 ml-2.5 flex cursor-pointer px-2.5 font-bold leading-none " htmlFor={'email'}>
            Your Email
            <p className="ml-1 mt-[1px] text-sm font-medium leading-none text-zinc-500 dark:text-zinc-400">
              (We will email you to verify the change)
            </p>
          </label>

          <div className="mb-8 flex flex-col md:flex-row">
            <form className="w-full" id="emailForm">
              <Input
                placeholder="Please enter your email"
                defaultValue={'allure.beauty@gmail.com'}
                type="text"
                name="newEmail"
                className={`mr-4 flex h-full max-w-full w-full items-center justify-center px-4 py-4 outline-none`}
              />
            </form>
            <Button
              className="flex h-full max-h-full w-full items-center justify-center rounded-lg px-4 py-4 text-base md:ms-4 font-medium md:w-[300px]"
              type="submit"
              form="emailForm"
            >
              Update email
            </Button>
          </div>
        </Card>
        <Notifications notifications={notifications} />
      </div>
    </div>
  )
}

export default index
