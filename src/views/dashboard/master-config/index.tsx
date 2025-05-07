import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '@/components/button'
import LoadingLayer from '@/components/loading-icon/LoadingLayer'
import BannerSettings from '@/components/master-config-setting/BannerSetting'
import FinancialSettings from '@/components/master-config-setting/FinancialSetting'
import GeneralSettings from '@/components/master-config-setting/GeneralSetting'
import LimitSettings from '@/components/master-config-setting/LimitSetting'
import TimeSettings from '@/components/master-config-setting/TimeSetting'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/useToast'
import { getMasterConfigApi, updateMasterConfigApi } from '@/network/apis/master-config'
import { TServerFile } from '@/types/file'
import { IMasterConfig } from '@/types/master-config'

const MasterConfig = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [configData, setConfigData] = useState<IMasterConfig | null>(null)
  const { successToast, errorToast } = useToast()
  const [isPending, setIsPending] = useState(false)

  const { data: masterConfig, isLoading } = useQuery({
    queryKey: [getMasterConfigApi.queryKey],
    queryFn: getMasterConfigApi.fn
  })

  const { mutateAsync: updateMasterConfigFn } = useMutation({
    mutationKey: [updateMasterConfigApi.mutationKey],
    mutationFn: updateMasterConfigApi.fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getMasterConfigApi.queryKey] })
      successToast({
        message: 'Configuration updated',
        description: 'Master configuration has been successfully updated.'
      })
      setIsEditing(false)
    },
    onError: () => {
      errorToast({
        message: 'Update failed',
        description: 'Failed to update master configuration. Please try again.'
      })
    }
  })

  const handleSave = async () => {
    setIsPending(true)
    if (configData && masterConfig && masterConfig?.data && masterConfig?.data?.length > 0) {
      await updateMasterConfigFn({ id: masterConfig?.data?.[0]?.id ?? '', data: configData })
    }
    setIsPending(false)
  }

  const handleCancel = () => {
    if (masterConfig?.data && masterConfig?.data?.length > 0) {
      setConfigData(masterConfig?.data[0])
    }

    setIsEditing(false)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleChange = (section: string, key: string, value: TServerFile | string | number | unknown) => {
    if (section === 'root') {
      setConfigData({
        ...configData,
        [key]: value
      })
    } else {
      setConfigData({
        ...configData,
        [section]: configData?.[section]?.map((item: IMasterConfig) => (item.id === key ? { ...item, ...value } : item))
      })
    }
  }

  useEffect(() => {
    if (masterConfig?.data && masterConfig?.data?.length > 0) {
      setConfigData(masterConfig.data[0] || null)
    }
  }, [masterConfig?.data])

  return (
    <div className='container mx-auto py-6 space-y-6'>
      {isLoading && <LoadingLayer />}
      <div>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Master Configuration</h1>
          <p className='text-muted-foreground'>Manage system-wide configuration settings</p>
        </div>
      </div>

      <Separator />

      {configData && (
        <Tabs defaultValue='general' className='w-full'>
          <TabsList className='grid grid-cols-5 w-full max-w-4xl'>
            <TabsTrigger value='general'>General</TabsTrigger>
            <TabsTrigger value='time'>Time Settings</TabsTrigger>
            <TabsTrigger value='limits'>Limits</TabsTrigger>
            <TabsTrigger value='financial'>Financial</TabsTrigger>
            <TabsTrigger value='banners'>Banners</TabsTrigger>
          </TabsList>

          <TabsContent value='general' className='mt-6'>
            <GeneralSettings
              data={configData}
              isEditing={isEditing}
              onChange={(key, value) => handleChange('root', key, value)}
            />
          </TabsContent>

          <TabsContent value='time' className='mt-6'>
            <TimeSettings
              data={configData}
              isEditing={isEditing}
              onChange={(key, value) => handleChange('root', key, value)}
            />
          </TabsContent>

          <TabsContent value='limits' className='mt-6'>
            <LimitSettings
              data={configData}
              isEditing={isEditing}
              onChange={(key, value) => handleChange('root', key, value)}
            />
          </TabsContent>

          <TabsContent value='financial' className='mt-6'>
            <FinancialSettings
              data={configData}
              isEditing={isEditing}
              onChange={(key, value) => handleChange('root', key, value)}
            />
          </TabsContent>

          <TabsContent value='banners' className='mt-6'>
            <BannerSettings
              data={configData}
              isEditing={isEditing}
              onChange={(bannerId, values) => handleChange('banners', bannerId, values)}
              onAddBanner={(banner) =>
                setConfigData({
                  ...configData,
                  banners: [...configData.banners, banner]
                })
              }
              onRemoveBanner={(bannerId) =>
                setConfigData({
                  ...configData,
                  banners: configData.banners.filter((b: TServerFile) => b.id !== bannerId)
                })
              }
            />
          </TabsContent>
        </Tabs>
      )}
      <div className='flex justify-end'>
        <div className='flex gap-2'>
          {isEditing ? (
            <>
              <Button variant='outline' onClick={handleCancel} disabled={isPending}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className='mr-2 h-4 w-4' />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit}>Edit Configuration</Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MasterConfig
