/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatDuration } from '@/lib/masterConfig'
import { IMasterConfig } from '@/types/master-config'

interface TimeSettingsProps {
  data: IMasterConfig
  isEditing: boolean
  onChange: (key: string, value: unknown) => void
}

interface TimeSettingsProps {
  data: IMasterConfig
  isEditing: boolean
  onChange: (key: string, value: unknown) => void
}

// Create a type for the valid time setting keys in IMasterConfig
type TimeSettingKey = keyof Pick<
  IMasterConfig,
  | 'groupBuyingRemainingTime'
  | 'autoCancelOrderTime'
  | 'autoCompleteOrderTime'
  | 'autoApproveRefundRequestTime'
  | 'feedbackTimeExpired'
  | 'refundTimeExpired'
  | 'complaintTimeExpired'
  | 'autoUpdateOrderToRefundedStatusTime'
  | 'expiredReceivedTime'
  | 'pendingAdminCheckRejectRefundRequestTime'
  | 'pendingAdminCheckComplaintRequestTime'
  | 'expiredCustomerReceivedTime'
  | 'pendingCustomerShippingReturnTime'
  | 'expiredBookingToPay'
  | 'expiredBookingWaitForConfirm'
  | 'expiredBookingConfirmed'
  | 'expiredBookinFormSubmited'
  | 'expiredBookinCompletedCall'
>
interface TimeSetting {
  key: TimeSettingKey
  label: string
  description: string
  type: 'number' | 'size'
}
export default function TimeSettings({ data, isEditing, onChange }: TimeSettingsProps) {
  const timeSettings: TimeSetting[] = [
    {
      key: 'groupBuyingRemainingTime',
      label: 'Group Buying Remaining Time',
      description: 'Time in milliseconds for group buying to remain active',
      type: 'number'
    },
    {
      key: 'autoCancelOrderTime',
      label: 'Auto Cancel Order Time',
      description: 'Time in milliseconds before an unpaid order is automatically canceled',
      type: 'number'
    },
    {
      key: 'autoCompleteOrderTime',
      label: 'Auto Complete Order Time',
      description: 'Time in milliseconds before an order is automatically marked as complete',
      type: 'number'
    },
    {
      key: 'autoApproveRefundRequestTime',
      label: 'Auto Approve Refund Request Time',
      description: 'Time in milliseconds before a refund request is automatically approved',
      type: 'number'
    },
    {
      key: 'feedbackTimeExpired',
      label: 'Feedback Time Expired',
      description: 'Time in milliseconds before feedback option expires',
      type: 'number'
    },
    {
      key: 'refundTimeExpired',
      label: 'Refund Time Expired',
      description: 'Time in milliseconds before refund option expires',
      type: 'number'
    },
    {
      key: 'complaintTimeExpired',
      label: 'Complaint Time Expired',
      description: 'Time in milliseconds before complaint option expires',
      type: 'number'
    },
    {
      key: 'autoUpdateOrderToRefundedStatusTime',
      label: 'Auto Update Order To Refunded Status Time',
      description: 'Time in milliseconds before order is automatically updated to refunded status',
      type: 'number'
    },
    {
      key: 'expiredReceivedTime',
      label: 'Expired Received Time',
      description: 'Time in milliseconds before received status expires',
      type: 'number'
    },
    {
      key: 'pendingAdminCheckRejectRefundRequestTime',
      label: 'Pending Admin Check Reject Refund Request Time',
      description: 'Time in milliseconds for admin to check rejected refund requests',
      type: 'number'
    },
    {
      key: 'pendingAdminCheckComplaintRequestTime',
      label: 'Pending Admin Check Complaint Request Time',
      description: 'Time in milliseconds for admin to check complaint requests',
      type: 'number'
    },
    {
      key: 'expiredCustomerReceivedTime',
      label: 'Expired Customer Received Time',
      description: 'Time in milliseconds before customer received status expires',
      type: 'number'
    },
    {
      key: 'pendingCustomerShippingReturnTime',
      label: 'Pending Customer Shipping Return Time',
      description: 'Time in milliseconds for customer to ship return items',
      type: 'number'
    },
    {
      key: 'expiredBookingToPay',
      label: 'Expired Booking To Pay',
      description: 'Time in milliseconds before booking payment expires',
      type: 'number'
    },
    {
      key: 'expiredBookingWaitForConfirm',
      label: 'Expired Booking Wait For Confirm',
      description: 'Time in milliseconds before booking confirmation expires',
      type: 'number'
    },
    {
      key: 'expiredBookingConfirmed',
      label: 'Expired Booking Confirmed',
      description: 'Time in milliseconds before confirmed booking expires',
      type: 'number'
    },
    {
      key: 'expiredBookinFormSubmited',
      label: 'Expired Booking Form Submitted',
      description: 'Time in milliseconds before submitted booking form expires',
      type: 'number'
    },
    {
      key: 'expiredBookinCompletedCall',
      label: 'Expired Booking Completed Call',
      description: 'Time in milliseconds before completed call booking expires',
      type: 'number'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Settings</CardTitle>
        <CardDescription>Configure system timeouts and expiration periods (in milliseconds)</CardDescription>
      </CardHeader>
      <CardContent className='grid gap-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {timeSettings.map((setting, _index) => (
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
              {formatDuration(
                typeof data[setting.key] === 'string'
                  ? Number.parseInt(data[setting.key] as string)
                  : Number(data[setting.key])
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
