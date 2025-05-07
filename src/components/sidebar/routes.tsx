import {
  Banknote,
  BookA,
  Boxes,
  Brush,
  Calendar,
  CalendarClock,
  Clock,
  Flag,
  Layers2Icon,
  Newspaper,
  Package,
  Package2Icon,
  ReceiptText,
  Settings,
  TicketPercent,
  User,
  Video
} from 'lucide-react'
import { GrSchedule } from 'react-icons/gr'
import { HiOutlineHome } from 'react-icons/hi2'
import { IoIosFlash } from 'react-icons/io'
import { PiCompassToolBold } from 'react-icons/pi'
import { TbBrandAmigo } from 'react-icons/tb'

import { Routes, routesConfig } from '@/configs/routes'
import { UserRoleEnum } from '@/types/role'
import type { IRoute } from '@/types/types'

export const routes: IRoute[] = [
  {
    name: routesConfig[Routes.DASHBOARD_HOME].name,
    path: routesConfig[Routes.DASHBOARD_HOME].path,
    icon: <HiOutlineHome className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.CONSULTANT, UserRoleEnum.OPERATOR]
  },
  {
    name: routesConfig[Routes.MY_BRAND_DASHBOARD].name,
    path: routesConfig[Routes.MY_BRAND_DASHBOARD].path,
    icon: <BookA className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false,
    roles: [UserRoleEnum.MANAGER]
  },
  {
    name: routesConfig[Routes.TRANSACTION_MANAGEMENT].name,
    path: routesConfig[Routes.TRANSACTION_MANAGEMENT].path,
    icon: <Banknote className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR, UserRoleEnum.MANAGER, UserRoleEnum.CONSULTANT]
  },

  {
    name: routesConfig[Routes.ORDER_LIST].name,
    path: routesConfig[Routes.ORDER_LIST].path,
    icon: <ReceiptText className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR, UserRoleEnum.MANAGER, UserRoleEnum.STAFF]
  },
  {
    name: routesConfig[Routes.PRODUCT_LIST].name,
    path: routesConfig[Routes.PRODUCT_LIST].path,
    icon: <Package className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: true,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR, UserRoleEnum.MANAGER, UserRoleEnum.STAFF]
  },
  {
    name: routesConfig[Routes.FLASH_SALE].name,
    path: routesConfig[Routes.FLASH_SALE].path,
    icon: <IoIosFlash className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR, UserRoleEnum.MANAGER, UserRoleEnum.STAFF]
  },
  {
    name: routesConfig[Routes.PRE_ORDER].name,
    path: routesConfig[Routes.PRE_ORDER].path,
    icon: <GrSchedule className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR, UserRoleEnum.MANAGER, UserRoleEnum.STAFF]
  },
  {
    name: routesConfig[Routes.GROUP_PRODUCT].name,
    path: routesConfig[Routes.GROUP_PRODUCT].path,
    icon: <Boxes className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR, UserRoleEnum.MANAGER, UserRoleEnum.STAFF]
  },
  {
    name: routesConfig[Routes.GROUP_BUYING].name,
    path: routesConfig[Routes.GROUP_BUYING].path,
    icon: <Package2Icon className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR, UserRoleEnum.MANAGER, UserRoleEnum.STAFF]
  },
  {
    name: routesConfig[Routes.LIVESTREAM].name,
    path: routesConfig[Routes.LIVESTREAM].path,
    icon: <Video className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR, UserRoleEnum.MANAGER, UserRoleEnum.STAFF, UserRoleEnum.KOL]
  },
  {
    name: routesConfig[Routes.VOUCHER].name,
    path: routesConfig[Routes.VOUCHER].path,
    icon: <TicketPercent className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR, UserRoleEnum.MANAGER, UserRoleEnum.STAFF]
  },
  {
    name: routesConfig[Routes.BOOKINGS_AND_REQUESTS].name,
    path: routesConfig[Routes.BOOKINGS_AND_REQUESTS].path,
    icon: <Calendar className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR, UserRoleEnum.CONSULTANT]
  },
  {
    name: routesConfig[Routes.SCHEDULE_BOOKING].name,
    path: routesConfig[Routes.SCHEDULE_BOOKING].path,
    icon: <CalendarClock className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR, UserRoleEnum.MANAGER, UserRoleEnum.CONSULTANT]
  },
  {
    name: routesConfig[Routes.CONSULTANT_SERVICE].name,
    path: routesConfig[Routes.CONSULTANT_SERVICE].path,
    icon: <TbBrandAmigo className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR, UserRoleEnum.CONSULTANT]
  },
  {
    name: routesConfig[Routes.BRAND].name,
    path: routesConfig[Routes.BRAND].path,
    icon: <TbBrandAmigo className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR]
  },
  {
    name: routesConfig[Routes.CATEGORY].name,
    path: routesConfig[Routes.CATEGORY].path,
    icon: <Layers2Icon className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR]
  },
  {
    name: routesConfig[Routes.SYSTEM_SERVICE_LIST].name,
    path: routesConfig[Routes.SYSTEM_SERVICE_LIST].path,
    icon: <Brush className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: true,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR]
  },
  {
    name: routesConfig[Routes.ACCOUNTS_DIRECTORY].name,
    path: routesConfig[Routes.ACCOUNTS_DIRECTORY].path,
    icon: <PiCompassToolBold className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR, UserRoleEnum.MANAGER]
  },

  {
    name: routesConfig[Routes.WORKING_TIME].name,
    path: routesConfig[Routes.WORKING_TIME].path,
    icon: <Clock className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR]
  },

  {
    name: routesConfig[Routes.REPORTS].name,
    path: routesConfig[Routes.REPORTS].path,
    icon: <Flag className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: true,
    roles: [
      UserRoleEnum.ADMIN,
      UserRoleEnum.OPERATOR,
      UserRoleEnum.MANAGER,
      UserRoleEnum.STAFF,
      UserRoleEnum.CONSULTANT
    ]
  },
  {
    name: routesConfig[Routes.BLOG].name,
    path: routesConfig[Routes.BLOG].path,
    icon: <Newspaper className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: true,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.OPERATOR]
  },
  {
    name: routesConfig[Routes.MASTER_CONFIG_DETAILS].name,
    path: routesConfig[Routes.MASTER_CONFIG_DETAILS].path,
    icon: <Settings className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false,
    roles: [UserRoleEnum.ADMIN]
  },
  {
    name: routesConfig[Routes.PROFILE_SETTINGS].name,
    path: routesConfig[Routes.PROFILE_SETTINGS].path,
    icon: <User className='-mt-[7px] h-4 w-4 stroke-2 text-inherit' />,
    collapse: false,
    roles: [
      UserRoleEnum.ADMIN,
      UserRoleEnum.MANAGER,
      UserRoleEnum.STAFF,
      UserRoleEnum.CONSULTANT,
      UserRoleEnum.KOL,
      UserRoleEnum.OPERATOR
    ]
  }
]
