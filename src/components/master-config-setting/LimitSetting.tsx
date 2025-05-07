import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatFileSize } from '@/lib/masterConfig'
import { IMasterConfig } from '@/types/master-config'

interface LimitSettingsProps {
  data: IMasterConfig
  isEditing: boolean
  onChange: (key: string, value: unknown) => void
}

export default function LimitSettings({ data, isEditing, onChange }: LimitSettingsProps) {
  const limitSettings = [
    {
      key: 'maximumUpdateBrandProfileTime',
      label: 'Maximum Update Brand Profile Time',
      description: 'Maximum number of times a brand profile can be updated',
      type: 'number'
    },
    {
      key: 'maxFeedbackImages',
      label: 'Max Feedback Images',
      description: 'Maximum number of images allowed in feedback',
      type: 'number'
    },
    {
      key: 'maxFeedbackVideos',
      label: 'Max Feedback Videos',
      description: 'Maximum number of videos allowed in feedback',
      type: 'number'
    },
    {
      key: 'maxFeedbackSize',
      label: 'Max Feedback Size',
      description: 'Maximum size (in bytes) for feedback attachments',
      type: 'size'
    },
    {
      key: 'maxProductImages',
      label: 'Max Product Images',
      description: 'Maximum number of images allowed per product',
      type: 'number'
    },
    {
      key: 'maxProductClassificationImages',
      label: 'Max Product Classification Images',
      description: 'Maximum number of classification images per product',
      type: 'number'
    },
    {
      key: 'amountProductWarning',
      label: 'Amount Product Warning',
      description: 'Threshold for low product inventory warning',
      type: 'number'
    },
    {
      key: 'maxEvidenceImages',
      label: 'Max Evidence Images',
      description: 'Maximum number of evidence images allowed',
      type: 'number'
    },
    {
      key: 'maxEvidenceVideos',
      label: 'Max Evidence Videos',
      description: 'Maximum number of evidence videos allowed',
      type: 'number'
    },
    {
      key: 'maxEvidenceSize',
      label: 'Max Evidence Size',
      description: 'Maximum size (in bytes) for evidence attachments',
      type: 'size'
    },
    {
      key: 'requestReturnOrderMaxImages',
      label: 'Request Return Order Max Images',
      description: 'Maximum number of images for return order requests',
      type: 'number'
    },
    {
      key: 'requestReturnOrderMaxVideos',
      label: 'Request Return Order Max Videos',
      description: 'Maximum number of videos for return order requests',
      type: 'number'
    },
    {
      key: 'requestReturnOrderMaxSize',
      label: 'Request Return Order Max Size',
      description: 'Maximum size (in bytes) for return order request attachments',
      type: 'size'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Limit Settings</CardTitle>
        <CardDescription>Configure system limits for uploads, counts, and sizes</CardDescription>
      </CardHeader>
      <CardContent className='grid gap-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {limitSettings.map((setting) => (
            <div key={setting.key} className='space-y-2'>
              <Label htmlFor={setting.key}>{setting.label}</Label>
              <Input
                id={setting.key}
                type='text'
                value={data[setting.key]}
                onChange={(e) =>
                  onChange(setting.key, setting.type === 'number' ? Number.parseInt(e.target.value) : e.target.value)
                }
                disabled={!isEditing}
              />
              <p className='text-xs text-muted-foreground'>{setting.description}</p>
              {setting.type === 'size' && data[setting.key] && (
                <p className='text-xs font-medium'>{formatFileSize(Number.parseInt(data[setting.key]))}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
