import { useContext } from 'react'
import { FiAlignJustify } from 'react-icons/fi'
import { HiX } from 'react-icons/hi'
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineInformationCircle,
  HiOutlineMoon,
  HiOutlineSun,
} from 'react-icons/hi2'
import { Link, useNavigate } from 'react-router-dom'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { OpenContext } from '@/contexts/layout'
import { useTheme } from '@/contexts/theme-provider'

export default function HeaderLinks() {
  const { open, setOpen } = useContext(OpenContext)
  const { theme, setTheme } = useTheme()
  const router = useNavigate()
  const onOpen = () => {
    setOpen(!open)
  }

  const onToggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const handleSignOut = () => {
    router('/auth/password_signin')
  }

  return (
    <div className="relative flex min-w-max max-w-max flex-grow items-center justify-around gap-1 rounded-lg md:px-2 md:py-2 md:pl-3 xl:gap-2">
      <Button
        variant="outline"
        className="flex h-9 min-w-9 cursor-pointer rounded-full border-zinc-200 p-0 text-xl text-zinc-950 dark:border-zinc-800 dark:text-white md:min-h-10 md:min-w-10 xl:hidden"
        onClick={onOpen}
      >
        {!open ? <FiAlignJustify className="h-4 w-4" /> : <HiX className="h-4 w-4" />}
      </Button>
      <Button
        onClick={onToggleTheme}
        variant="outline"
        className="flex h-9 min-w-9 cursor-pointer rounded-full border-zinc-200 p-0 text-xl text-zinc-950 dark:border-zinc-800 dark:text-white md:min-h-10 md:min-w-10"
      >
        {theme == 'light' ? (
          <HiOutlineMoon className="h-4 w-4 stroke-2" />
        ) : (
          <HiOutlineSun className="h-5 w-5 stroke-2" />
        )}
      </Button>

      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex h-9 min-w-9 cursor-pointer rounded-full border-zinc-200 p-0 text-xl text-zinc-950 dark:border-zinc-800 dark:text-white md:min-h-10 md:min-w-10"
          >
            <HiOutlineInformationCircle className="h-[20px] w-[20px] text-zinc-950 dark:text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 p-2">
          <a
            target="blank"
            href="https://horizon-ui.com/boilerplate-shadcn#pricing"
            // className="w-full"
            className="flex h-[44px] w-full min-w-[44px] cursor-pointer items-center rounded-lg border border-zinc-200 bg-transparent text-center text-sm font-medium text-zinc-950 duration-100 placeholder:text-zinc-950 hover:bg-gray-100 focus:bg-zinc-200 active:bg-zinc-200 dark:border-white/10 dark:bg-zinc-950 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/20 dark:active:bg-white/20"
          >
            <Button variant="outline" className="mb-2 w-full">
              Pricing
            </Button>
          </a>
          <a target="blank" href="mailto:hello@horizon-ui.com">
            <Button variant="outline" className="mb-2 w-full">
              Help & Support
            </Button>
          </a>
          <a target="blank" href="/#faqs">
            <Button variant="outline" className="w-full">
              FAQs & More
            </Button>
          </a>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        onClick={handleSignOut}
        variant="outline"
        className="flex h-9 min-w-9 cursor-pointer rounded-full border-zinc-200 p-0 text-xl text-zinc-950 dark:border-zinc-800 dark:text-white md:min-h-10 md:min-w-10"
      >
        <HiOutlineArrowRightOnRectangle className="h-4 w-4 stroke-2 text-zinc-950 dark:text-white" />
      </Button>
      <Link className="w-full" to="/dashboard/profile-settings">
        <Avatar className="h-9 min-w-9 md:min-h-10 md:min-w-10">
          <AvatarImage src={''} />
          <AvatarFallback className="font-bold">{'A'}</AvatarFallback>
        </Avatar>
      </Link>
    </div>
  )
}
