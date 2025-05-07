import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IMasterConfig } from '@/types/master-config'

interface FinancialSettingsProps {
  data: IMasterConfig
  isEditing: boolean
  onChange: (key: string, value: unknown) => void
}

export default function FinancialSettings({ data, isEditing, onChange }: FinancialSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Settings</CardTitle>
        <CardDescription>Configure financial parameters and fees</CardDescription>
      </CardHeader>
      <CardContent className='grid gap-6'>
        <div className='space-y-2'>
          <Label htmlFor='commissionFee'>Commission Fee</Label>
          <div className='flex items-center'>
            <Input
              id='commissionFee'
              type='number'
              step='0.01'
              min='0'
              max='1'
              value={data.commissionFee}
              onChange={(e) => onChange('commissionFee', e.target.value)}
              disabled={!isEditing}
              className='max-w-[200px]'
            />
            <span className='ml-2 text-muted-foreground'>({Number.parseFloat(data.commissionFee) * 100}%)</span>
          </div>
          <p className='text-xs text-muted-foreground'>Platform commission fee as a decimal (0.1 = 10%)</p>
        </div>
      </CardContent>
    </Card>
  )
}
