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
}
export default function TimeSettings({ data, isEditing, onChange }: TimeSettingsProps) {
  const timeSettings: TimeSetting[] = [
    {
      key: 'groupBuyingRemainingTime',
      label: 'Group Buying Remaining Time',
      description: 'Time in milliseconds for group buying to remain active'
    },
    {
      key: 'autoCancelOrderTime',
      label: 'Auto Cancel Order Time',
      description: 'Time in milliseconds before an unpaid order is automatically canceled'
    },
    {
      key: 'autoCompleteOrderTime',
      label: 'Auto Complete Order Time',
      description: 'Time in milliseconds before an order is automatically marked as complete'
    },
    {
      key: 'autoApproveRefundRequestTime',
      label: 'Auto Approve Refund Request Time',
      description: 'Time in milliseconds before a refund request is automatically approved'
    },
    {
      key: 'feedbackTimeExpired',
      label: 'Feedback Time Expired',
      description: 'Time in milliseconds before feedback option expires'
    },
    {
      key: 'refundTimeExpired',
      label: 'Refund Time Expired',
      description: 'Time in milliseconds before refund option expires'
    },
    {
      key: 'complaintTimeExpired',
      label: 'Complaint Time Expired',
      description: 'Time in milliseconds before complaint option expires'
    },
    {
      key: 'autoUpdateOrderToRefundedStatusTime',
      label: 'Auto Update Order To Refunded Status Time',
      description: 'Time in milliseconds before order is automatically updated to refunded status'
    },
    {
      key: 'expiredReceivedTime',
      label: 'Expired Received Time',
      description: 'Time in milliseconds before received status expires'
    },
    {
      key: 'pendingAdminCheckRejectRefundRequestTime',
      label: 'Pending Admin Check Reject Refund Request Time',
      description: 'Time in milliseconds for admin to check rejected refund requests'
    },
    {
      key: 'pendingAdminCheckComplaintRequestTime',
      label: 'Pending Admin Check Complaint Request Time',
      description: 'Time in milliseconds for admin to check complaint requests'
    },
    {
      key: 'expiredCustomerReceivedTime',
      label: 'Expired Customer Received Time',
      description: 'Time in milliseconds before customer received status expires'
    },
    {
      key: 'pendingCustomerShippingReturnTime',
      label: 'Pending Customer Shipping Return Time',
      description: 'Time in milliseconds for customer to ship return items'
    },
    {
      key: 'expiredBookingToPay',
      label: 'Expired Booking To Pay',
      description: 'Time in milliseconds before booking payment expires'
    },
    {
      key: 'expiredBookingWaitForConfirm',
      label: 'Expired Booking Wait For Confirm',
      description: 'Time in milliseconds before booking confirmation expires'
    },
    {
      key: 'expiredBookingConfirmed',
      label: 'Expired Booking Confirmed',
      description: 'Time in milliseconds before confirmed booking expires'
    },
    {
      key: 'expiredBookinFormSubmited',
      label: 'Expired Booking Form Submitted',
      description: 'Time in milliseconds before submitted booking form expires'
    },
    {
      key: 'expiredBookinCompletedCall',
      label: 'Expired Booking Completed Call',
      description: 'Time in milliseconds before completed call booking expires'
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
                type='number'
                value={data[setting.key]}
                onChange={(e) => onChange(setting.key, e.target.value)}
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
