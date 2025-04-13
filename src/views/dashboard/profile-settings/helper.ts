import _ from 'lodash'

import { FileStatusEnum, TFile } from '@/types/file'
import { TUser } from '@/types/user'

import { WorkingProfileFormValues } from './WorkingProfile'

export const convertProfileIntoForm = (profile: TUser) => {
  let form = _.cloneDeepWith<Partial<TUser>>(profile)
  form = _.omitBy(form, _.isNil)
  form = _.omit(form, 'role')
  return form
}

/**
 * Converts form data into a profile object suitable for API submission
 * Note: The returned type is compatible with the updateProfile API
 */
export const convertFormIntoProfile = (form: Partial<TUser>) => {
  let profile = _.cloneDeepWith(form)
  profile = _.omitBy(profile, (value) => _.isNil(value) || _.isEmpty(value) || Array.isArray(value))

  // if (!profile.role) {
  //   profile.role = UserRoleEnum.CUSTOMER
  // }

  return profile
}

export const convertWorkingProfileFormValuesIntoProfile = (formValues: WorkingProfileFormValues): Partial<TUser> => {
  // Create a base profile object
  const profile: Partial<TUser> = {
    majorTitle: formValues.majorTitle,
    description: formValues.description,
    yoe: formValues.yoe ? parseInt(formValues.yoe, 10) : undefined,
    introduceVideo: formValues.introduceVideo?.[0]?.fileUrl,
    thumbnailImageList: formValues.thumbnailImageList?.map((img) => ({
      ...img,
      name: img.name || ''
    }))
  }

  // Process certificates comparing initialCertificates with current certificates
  const certificates: TFile[] = []

  // First, process current certificates
  if (formValues.certificates && formValues.certificates.length > 0) {
    formValues.certificates.forEach((cer) => {
      if (cer.files && cer.files.length > 0) {
        // Format the certificate with the right naming pattern
        certificates.push({
          ...cer.files[0],
          name: cer.title + '_' + cer.year
        })
      }
    })
  }

  // Then, process initialCertificates to find deleted ones
  if (formValues.initialCertificates && formValues.initialCertificates.length > 0) {
    formValues.initialCertificates.forEach((initialCer) => {
      if (initialCer.files && initialCer.files.length > 0) {
        const initialFile = initialCer.files[0]

        // Skip if the file doesn't have an ID (not saved in the backend yet)
        if (!initialFile.id) return

        // Check if this certificate still exists in current certificates
        const stillExists = certificates.some((cert) => cert.id === initialFile.id)

        if (!stillExists) {
          // Certificate was removed, mark as inactive and add to the list
          certificates.push({
            ...initialFile,
            status: FileStatusEnum.INACTIVE
          })
        }
      }
    })
  }

  // Add certificates to the profile
  profile.certificates = certificates

  return profile
}

export const convertUserIntoWorkingProfileFormValues = (user: TUser): WorkingProfileFormValues => {
  if (!user) return {} as WorkingProfileFormValues

  // Map certificates to the expected format
  const certificates =
    user.certificates?.map((cert) => {
      const [title, year] = cert.name?.split('_') || []
      return {
        title: title || '',
        year: year || '',
        files: [
          {
            ...cert,
            name: title || ''
          }
        ]
      }
    }) || []

  // Create working profile form values
  return {
    majorTitle: user.majorTitle || '',
    description: user.description || '',
    yoe: user.yoe ? String(user.yoe) : '',
    introduceVideo: user.introduceVideo ? [{ fileUrl: user.introduceVideo, name: 'introduction_video.mp4' }] : [],
    certificates: certificates,
    initialCertificates: JSON.parse(JSON.stringify(certificates)),
    thumbnailImageList:
      user.thumbnailImageList?.map((img) => ({
        ...img,
        name: img.name || ''
      })) || []
  }
}
