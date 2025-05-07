import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { IMasterConfig } from '@/types/master-config'

interface GeneralSettingsProps {
  data: IMasterConfig
  isEditing: boolean
  onChange: (key: string, value: unknown) => void
}

export default function GeneralSettings({ data, isEditing, onChange }: GeneralSettingsProps) {
  const { t } = useTranslation()
  return (
    <div className='grid gap-6'>
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>General platform configuration settings</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-6'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Platform Name</Label>
              <Input
                id='name'
                value={data.name}
                onChange={(e) => onChange('name', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='logo'>Logo</Label>
              <Input
                id='logo'
                value={data.logo}
                onChange={(e) => onChange('logo', e.target.value)}
                placeholder='Please enter url'
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label>Created At</Label>
              <div className='p-2 text-sm border border-muted rounded-md bg-muted/20 text-muted-foreground'>
                {t('date.toLocaleDateTimeString', { val: new Date(data.createdAt) })}
              </div>
            </div>
            <div className='space-y-2'>
              <Label>Updated At</Label>
              <div className='p-2 text-sm border border-muted rounded-md bg-muted/20 text-muted-foreground'>
                {t('date.toLocaleDateTimeString', { val: new Date(data.updatedAt) })}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='maxLevelCategory'>Maximum Category Level</Label>
              <Input
                id='maxLevelCategory'
                type='number'
                value={data.maxLevelCategory}
                onChange={(e) => onChange('maxLevelCategory', Number.parseInt(e.target.value))}
                disabled={!isEditing}
              />
            </div>
            <div className='space-y-2 flex flex-col'>
              <Label htmlFor='status'>Status</Label>
              <Switch
                id='status'
                checked={data.status === 'ACTIVE'}
                onCheckedChange={(checked) => onChange('status', checked ? 'ACTIVE' : 'INACTIVE')}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
