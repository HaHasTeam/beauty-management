import _ from 'lodash'

import { TUser } from '@/types/user'

export const convertProfileIntoForm = (profile: TUser) => {
  let form = _.cloneDeepWith<Partial<TUser>>(profile)
  form = _.omitBy(form, _.isNil)
  form = _.omit(form, 'role')
  return form
}

export const convertFormIntoProfile = (form: Partial<TUser>) => {
  let profile = _.cloneDeepWith(form)
  profile = _.omitBy(profile, _.isNil)
  return profile
}
