import { ComponentType } from 'react'

import { UserRoleEnum } from './role'

export type Provider =
  | 'apple'
  | 'azure'
  | 'bitbucket'
  | 'discord'
  | 'facebook'
  | 'figma'
  | 'github'
  | 'gitlab'
  | 'google'
  | 'kakao'
  | 'keycloak'
  | 'linkedin'
  | 'linkedin_oidc'
  | 'notion'
  | 'slack'
  | 'slack_oidc'
  | 'spotify'
  | 'twitch'
  | 'twitter'
  | 'workos'
  | 'zoom'
  | 'fly'

export interface PageMeta {
  title: string
  description: string
  cardImage: string
}

export interface IRoute {
  path: string
  name: string
  layout?: string
  exact?: boolean
  component?: ComponentType
  disabled?: boolean
  icon?: JSX.Element
  secondary?: boolean
  collapse?: boolean
  items?: IRoute[]
  rightElement?: boolean
  invisible?: boolean
  roles?: UserRoleEnum[]
}

export interface IStepper {
  id: string
  title: string
  description: string
}
