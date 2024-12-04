// Auth Imports
import { CiSquareQuestion } from 'react-icons/ci'
import { FaBox } from 'react-icons/fa6'
import { GrSchedule } from 'react-icons/gr'
import { HiOutlineCog8Tooth, HiOutlineHome, HiOutlineUsers } from 'react-icons/hi2'
import { IoIosFlash } from 'react-icons/io'
import { PiCompassToolBold } from 'react-icons/pi'

import { Routes, routesConfig } from '@/configs/routes'
import { IRoute } from '@/types/types'

export const routes: IRoute[] = [
  {
    name: routesConfig[Routes.DASHBOARD_HOME].name,
    path: routesConfig[Routes.DASHBOARD_HOME].path,
    icon: <HiOutlineHome className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false
  },
  {
    name: routesConfig[Routes.PRE_ORDER].name,
    path: routesConfig[Routes.PRE_ORDER].path,
    icon: <GrSchedule className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false
  },
  {
    name: routesConfig[Routes.FLASH_SALE].name,
    path: routesConfig[Routes.FLASH_SALE].path,
    icon: <IoIosFlash className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false
  },
  {
    name: routesConfig[Routes.REQUESTS_QUEUE].name,
    path: routesConfig[Routes.REQUESTS_QUEUE].path,
    icon: <CiSquareQuestion className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false
  },
  {
    name: routesConfig[Routes.ACCOUNTS_DIRECTORY].name,
    path: routesConfig[Routes.ACCOUNTS_DIRECTORY].path,
    icon: <PiCompassToolBold className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false
  },
  {
    name: routesConfig[Routes.MERCHANTS_DIRECTORY].name,
    path: routesConfig[Routes.MERCHANTS_DIRECTORY].path,
    icon: <HiOutlineUsers className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false
  },
  {
    name: routesConfig[Routes.SERVICES_CATALOG].name,
    path: routesConfig[Routes.SERVICES_CATALOG].path,
    icon: <PiCompassToolBold className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false
  },
  {
    name: routesConfig[Routes.PROFILE_SETTINGS].name,
    path: routesConfig[Routes.PROFILE_SETTINGS].path,
    icon: <HiOutlineCog8Tooth className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false
  },
  {
    name: routesConfig[Routes.PRODUCT_LIST].name,
    path: routesConfig[Routes.PRODUCT_LIST].path,
    icon: <FaBox className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: true
  },
  {
    name: routesConfig[Routes.CREATE_PRODUCT].name,
    path: routesConfig[Routes.CREATE_PRODUCT].path,
    icon: <FaBox className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: true
  }
]
