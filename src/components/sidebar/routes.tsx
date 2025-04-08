// Auth Imports
import {
  Banknote,
  BookA,
  Boxes,
  Brush,
  CalendarClock,
  Clock,
  Flag,
  Layers2Icon,
  Package,
  ReceiptText,
  TicketPercent
} from 'lucide-react'
import { GrSchedule } from 'react-icons/gr'
import { HiOutlineCog8Tooth, HiOutlineHome } from 'react-icons/hi2'
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
    name: routesConfig[Routes.MY_BRAND_DASHBOARD].name,
    path: routesConfig[Routes.MY_BRAND_DASHBOARD].path,
    icon: <BookA className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false
  },
  {
    name: routesConfig[Routes.TRANSACTION_MANAGEMENT].name,
    path: routesConfig[Routes.TRANSACTION_MANAGEMENT].path,
    icon: <Banknote className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false
  },
  {
    name: routesConfig[Routes.BRAND].name,
    path: routesConfig[Routes.BRAND].path,
    icon: <TbBrandAmigo className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false
  },
  {
    name: routesConfig[Routes.CONSULTANT_SERVICE].name,
    path: routesConfig[Routes.CONSULTANT_SERVICE].path,
    icon: <TbBrandAmigo className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />
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
    name: routesConfig[Routes.ORDER_LIST].name,
    path: routesConfig[Routes.ORDER_LIST].path,
    icon: <ReceiptText className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false
  },
  {
    name: routesConfig[Routes.ACCOUNTS_DIRECTORY].name,
    path: routesConfig[Routes.ACCOUNTS_DIRECTORY].path,
    icon: <PiCompassToolBold className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false
  },
  {
    name: routesConfig[Routes.SCHEDULE_BOOKING].name,
    path: routesConfig[Routes.SCHEDULE_BOOKING].path,
    icon: <CalendarClock className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false
  },
  {
    name: routesConfig[Routes.WORKING_TIME].name,
    path: routesConfig[Routes.WORKING_TIME].path,
    icon: <Clock className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false
  },
  {
    name: routesConfig[Routes.VOUCHER].name,
    path: routesConfig[Routes.VOUCHER].path,
    icon: <TicketPercent className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
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
  },
  {
    name: routesConfig[Routes.SYSTEM_SERVICE_LIST].name,
    path: routesConfig[Routes.SYSTEM_SERVICE_LIST].path,
    icon: <Brush className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: true
  },
  {
    name: routesConfig[Routes.REPORTS].name,
    path: routesConfig[Routes.REPORTS].path,
    icon: <Flag className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: true
  }
]
