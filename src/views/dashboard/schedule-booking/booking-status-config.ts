import { FileText } from 'lucide-react'

import { BookingStatusEnum } from '@/types/enum'

export function getBookingStatusConfig(t: (key: string) => string) {
  return {
    [BookingStatusEnum.WAIT_FOR_CONFIRMATION]: {
      borderColor: 'border-lime-300',
      bgColor: 'bg-lime-100',
      bgTagColor: 'bg-lime-200',
      alertVariant: 'bg-lime-100 rounded-lg p-3 border',
      titleColor: 'text-lime-600',
      buttonBg: 'bg-purple-600 hover:bg-purple-800',
      alertTitle: t('booking.waitConfirm'),
      buttonText: t('booking.confirmBooking'),
      alertDescription: t('booking.statusDescription.waitConfirm'),
      nextStatus: BookingStatusEnum.BOOKING_CONFIRMED
    },
    [BookingStatusEnum.BOOKING_CONFIRMED]: {
      borderColor: 'border-purple-300',
      bgColor: 'bg-purple-100',
      bgTagColor: 'bg-purple-200',
      titleColor: 'text-purple-600',
      alertVariant: 'bg-purple-100 rounded-lg p-3 border',
      buttonBg: 'bg-blue-600 hover:bg-blue-800',
      alertTitle: t('booking.confirmed'),
      buttonText: t('booking.markAsCompleted'),
      alertDescription: t('booking.statusDescription.confirmed'),
      nextStatus: BookingStatusEnum.COMPLETED
    },
    [BookingStatusEnum.COMPLETED]: {
      borderColor: 'border-green-300',
      bgColor: 'bg-green-100',
      bgTagColor: 'bg-green-300',
      titleColor: 'text-green-600',
      alertVariant: 'bg-green-100 rounded-lg p-3 border',
      buttonBg: '',
      alertTitle: t('booking.completed'),
      buttonText: '',
      alertDescription: t('booking.statusDescription.completed'),
      nextStatus: ''
    },
    [BookingStatusEnum.CANCELLED]: {
      borderColor: 'border-red-300',
      bgColor: 'bg-red-100',
      bgTagColor: 'bg-red-200',
      titleColor: 'text-red-600',
      alertVariant: 'bg-red-100 rounded-lg p-3 border',
      buttonBg: '',
      alertTitle: t('booking.cancelled'),
      buttonText: '',
      alertDescription: t('booking.statusDescription.cancelled'),
      nextStatus: ''
    },
    [BookingStatusEnum.TO_PAY]: {
      borderColor: 'border-yellow-300',
      bgColor: 'bg-yellow-100',
      bgTagColor: 'bg-yellow-200',
      titleColor: 'text-yellow-600',
      alertVariant: 'bg-yellow-100 rounded-lg p-3 border',
      buttonBg: 'bg-yellow-600 hover:bg-yellow-800',
      alertTitle: t('booking.toPay'),
      buttonText: t('booking.payNow'),
      alertDescription: t('booking.statusDescription.toPay'),
      nextStatus: BookingStatusEnum.WAIT_FOR_CONFIRMATION
    },
    [BookingStatusEnum.SERVICE_BOOKING_FORM_SUBMITED]: {
      borderColor: 'border-blue-300',
      bgColor: 'bg-blue-100',
      bgTagColor: 'bg-blue-200',
      titleColor: 'text-blue-600',
      alertVariant: 'bg-blue-100 rounded-lg p-3 border',
      buttonBg: 'bg-blue-600 hover:bg-blue-800',
      alertTitle: t('booking.formSubmitted'),
      buttonText: t('booking.reviewForm'),
      alertDescription: t('booking.statusDescription.formSubmitted'),
      nextStatus: BookingStatusEnum.WAIT_FOR_CONFIRMATION
    },
    [BookingStatusEnum.COMPLETED_CONSULTING_CALL]: {
      borderColor: 'border-blue-300',
      bgColor: 'bg-blue-100',
      bgTagColor: 'bg-blue-300',
      titleColor: 'text-blue-600',
      alertVariant: 'bg-blue-100 rounded-lg p-3 border',
      buttonBg: 'bg-green-600 hover:bg-green-800',
      alertTitle: t('booking.status.completedConsultingCall'),
      buttonText: t('booking.status.sendResultSheet'),
      icon: FileText,
      alertDescription: t('booking.statusDescription.completedConsultingCall'),
      nextStatus: BookingStatusEnum.SENDED_RESULT_SHEET
    },
    [BookingStatusEnum.SENDED_RESULT_SHEET]: {
      borderColor: 'border-indigo-300',
      bgColor: 'bg-indigo-100',
      bgTagColor: 'bg-indigo-200',
      titleColor: 'text-indigo-600',
      alertVariant: 'bg-indigo-100 rounded-lg p-3 border',
      buttonBg: 'bg-indigo-600 hover:bg-indigo-800',
      alertTitle: t('booking.resultSheetSent'),
      buttonText: t('booking.viewResults'),
      alertDescription: t('booking.statusDescription.resultSheetSent'),
      nextStatus: BookingStatusEnum.COMPLETED
    },
    [BookingStatusEnum.REFUNDED]: {
      borderColor: 'border-gray-300',
      bgColor: 'bg-gray-100',
      bgTagColor: 'bg-gray-200',
      titleColor: 'text-gray-600',
      alertVariant: 'bg-gray-100 rounded-lg p-3 border',
      buttonBg: '',
      alertTitle: t('booking.refunded'),
      buttonText: '',
      alertDescription: t('booking.statusDescription.refunded'),
      nextStatus: ''
    },
    [BookingStatusEnum.COMPLETED_CONSULTING_CALL]: {
      borderColor: 'border-purple-300',
      bgColor: 'bg-purple-100',
      bgTagColor: 'bg-purple-200',
      titleColor: 'text-purple-600',
      alertVariant: 'bg-purple-100 rounded-lg p-3 border',
      buttonBg: 'bg-purple-600 hover:bg-purple-800',
      alertTitle: t('booking.completedConsultingCall'),
      buttonText: t('booking.viewConsultingCall'),
      alertDescription: t('booking.statusDescription.completedConsultingCall'),
      nextStatus: ''
    }
  }
}
