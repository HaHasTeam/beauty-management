// Auth Imports
import { CiSquareQuestion } from 'react-icons/ci'
import { FaBox } from 'react-icons/fa6'
import { HiOutlineCog8Tooth, HiOutlineHome, HiOutlineUsers } from 'react-icons/hi2'
import { PiCompassToolBold } from 'react-icons/pi'

import { IRoute } from '@/types/types'

export const routes: IRoute[] = [
  {
    name: 'Main Dashboard',
    path: '/dashboard/home',
    icon: <HiOutlineHome className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false
  },
  {
    name: 'Requests Queue',
    path: '/dashboard/requests-queue',
    icon: <CiSquareQuestion className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false
  },
  {
    name: 'Merchants Directory',
    path: '/dashboard/merchants-directory',
    icon: <HiOutlineUsers className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false
  },
  {
    name: 'Services Catalog',
    path: '/dashboard/services-catalog',
    icon: <PiCompassToolBold className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false
  },
  {
    name: 'Profile Settings',
    path: '/dashboard/profile-settings',
    icon: <HiOutlineCog8Tooth className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false
  },
  {
    name: 'Product Management',
    path: '/dashboard/product-management',
    icon: <FaBox className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false
  }
]
