import { CheckCircle2, CircleDashed, CircleIcon, CircleX, WifiOff } from 'lucide-react'
import { FcManager } from 'react-icons/fc'
import { GiHumanPyramid } from 'react-icons/gi'
import { GrUserManager } from 'react-icons/gr'
import { ImManWoman } from 'react-icons/im'
import { MdLiveTv } from 'react-icons/md'
import { RiAdminLine } from 'react-icons/ri'
import { VscSymbolOperator } from 'react-icons/vsc'

import { UserRoleEnum } from '@/types/role'
import { UserStatusEnum } from '@/types/user'

export function getStatusIcon(status: UserStatusEnum) {
  const statusIcons = {
    [UserStatusEnum.ACTIVE]: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    [UserStatusEnum.PENDING]: {
      icon: CircleDashed,
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    [UserStatusEnum.INACTIVE]: {
      icon: WifiOff,
      iconColor: 'text-gray-500',
      textColor: 'text-gray-500',
      bgColor: 'bg-gray-100'
    },
    [UserStatusEnum.BANNED]: {
      icon: CircleX,
      iconColor: 'text-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-100'
    }
  }
  return statusIcons[status] || CircleIcon
}

export const getRoleIcon = (role: UserRoleEnum) => {
  const roleIcons = {
    [UserRoleEnum.ADMIN]: {
      icon: RiAdminLine,
      iconColor: 'text-red-500',
      textColor: 'text-red-500',
      bgColor: 'bg-red-100'
    },
    [UserRoleEnum.CONSULTANT]: {
      icon: GiHumanPyramid,
      iconColor: 'text-blue-500',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-100'
    },
    [UserRoleEnum.CUSTOMER]: {
      icon: ImManWoman,
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    [UserRoleEnum.KOL]: {
      icon: MdLiveTv,
      iconColor: 'text-purple-500',
      textColor: 'text-purple-500',
      bgColor: 'bg-purple-100'
    },
    [UserRoleEnum.MANAGER]: {
      icon: FcManager,
      iconColor: 'text-indigo-500',
      textColor: 'text-indigo-500',
      bgColor: 'bg-indigo-100'
    },
    [UserRoleEnum.STAFF]: {
      icon: GrUserManager,
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
      bgColor: 'bg-green-100'
    },
    [UserRoleEnum.OPERATOR]: {
      icon: VscSymbolOperator,
      iconColor: 'text-orange-500',
      textColor: 'text-orange-500',
      bgColor: 'bg-orange-100'
    }
  }
  return roleIcons[role] || CircleIcon
}
