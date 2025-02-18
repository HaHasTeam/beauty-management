// Auth Imports
import { Boxes, Layers2Icon, Package } from 'lucide-react'
import { GrSchedule } from 'react-icons/gr'
import { HiOutlineCog8Tooth, HiOutlineHome, HiOutlineUsers } from 'react-icons/hi2'
import { IoIosFlash } from 'react-icons/io'
import { PiCompassToolBold } from 'react-icons/pi'
import { TbBrandAmigo } from 'react-icons/tb'

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
    name: routesConfig[Routes.BRAND].name,
    path: routesConfig[Routes.BRAND].path,
    icon: <TbBrandAmigo className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false
  },
  {
    name: routesConfig[Routes.CATEGORY].name,
    path: routesConfig[Routes.CATEGORY].path,
    icon: <Layers2Icon className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />
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
    name: routesConfig[Routes.GROUP_PRODUCT].name,
    path: routesConfig[Routes.GROUP_PRODUCT].path,
    icon: <Boxes className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
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
    name: routesConfig[Routes.VOUCHER].name,
    path: routesConfig[Routes.VOUCHER].path,
    icon: <TbBrandAmigo className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
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
    icon: <Package className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: true
  }
]
