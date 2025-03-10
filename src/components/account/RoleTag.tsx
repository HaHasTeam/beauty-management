import { useTranslation } from 'react-i18next'

import { UserRoleEnum } from '@/types/role'
import { getRoleIcon } from '@/views/dashboard/accounts-directory/account-table-ui/helper'

interface RoleTagProps {
  role: UserRoleEnum | 'BRAND' | 'MODERATOR'
  size?: 'small' | 'medium' | 'large'
}

const sizeClasses = {
  small: 'text-xs px-2 py-1',
  medium: 'text-sm px-3 py-1.5',
  large: 'text-base px-4 py-2'
}

export function RoleTag({ role, size = 'medium' }: RoleTagProps) {
  const { t } = useTranslation()
  const roleData = getRoleIcon(role)

  return (
    <span
      className={`flex items-center gap-1 rounded-full font-medium ${roleData.bgColor} ${roleData.textColor} ${sizeClasses[size]}`}
    >
      <roleData.icon className={roleData.iconColor} size={16} />

      {t(`role.${role}`)}
    </span>
  )
}
