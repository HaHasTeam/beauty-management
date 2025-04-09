import { enumToArray } from '@/utils'

export enum RoleEnum {
  CUSTOMER = 'CUSTOMER',
  MANAGER = 'MANAGER',
  CONSULTANT = 'CONSULTANT',
  STAFF = 'STAFF',
  KOL = 'KOL',
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR'
}

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum StatusEnum {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED',
  DENIED = 'DENIED'
}
export enum AddressEnum {
  HOME = 'HOME',
  OFFICE = 'OFFICE',
  OTHER = 'OTHER'
}

export enum ProductEnum {
  PRE_ORDER = 'PRE_ORDER',
  FLASH_SALE = 'FLASH_SALE',
  OFFICIAL = 'OFFICIAL',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED',
  UN_PUBLISHED = 'UN_PUBLISHED'
}

export enum FileEnum {
  CERTIFICATE = 'CERTIFICATE',
  AVATAR = 'AVATAR',
  PRODUCT_IMAGE = 'PRODUCT_IMAGE',
  POPUP_IMAGE = 'POPUP_IMAGE',
  BRAND_IMAGE = 'BRAND_IMAGE',
  BRAND_LOGO = 'BRAND_LOGO',
  BRAND_DOCUMENT = 'BRAND_DOCUMENT',
  SERVICE_IMAGE = 'SERVICE_IMAGE'
}

export enum VoucherEnum {
  GROUP_BUYING = 'GROUP_BUYING',
  NORMAL = 'NORMAL'
}

export enum DiscountTypeEnum {
  PERCENTAGE = 'PERCENTAGE',
  AMOUNT = 'AMOUNT'
}

export enum OrderEnum {
  PRE_ORDER = 'PRE_ORDER',
  NORMAL = 'NORMAL',
  GROUP_BUYING = 'GROUP_BUYING',
  FLASH_SALE = 'FLASH_SALE'
}
export enum VoucherVisibilityEnum {
  WALLET = 'WALLET',
  PUBLIC = 'PUBLIC',
  GROUP = 'GROUP'
}

export enum VoucherApplyTypeEnum {
  ALL = 'ALL',
  SPECIFIC = 'SPECIFIC'
}
export enum VoucherWalletStatus {
  USED = 'USED',
  NOT_USED = 'NOT_USED'
}

export const voucherEnumArray = enumToArray(VoucherEnum)
export const discountTypeEnumArray = enumToArray(DiscountTypeEnum)

export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  WALLET = 'WALLET',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

export enum ShippingStatusEnum {
  JOIN_GROUP_BUYING = 'JOIN_GROUP_BUYING',
  TO_PAY = 'TO_PAY',
  WAIT_FOR_CONFIRMATION = 'WAIT_FOR_CONFIRMATION',
  PREPARING_ORDER = 'PREPARING_ORDER',
  TO_SHIP = 'TO_SHIP',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  RETURNING = 'RETURNING',
  BRAND_RECEIVED = 'BRAND_RECEIVED',
  REFUNDED = 'REFUNDED',
  RETURNED_FAIL = 'RETURNED_FAIL',
  CANCELLED = 'CANCELLED'
  // PENDING_CANCELLATION = 'PENDING_CANCELLATION', // FRONT END
  // PENDING_RETURN_APPROVAL = 'PENDING_RETURN_APPROVAL' // FRONT END
}
export enum ProductDiscountEnum {
  ACTIVE = 'ACTIVE',
  SOLD_OUT = 'SOLD_OUT',
  WAITING = 'WAITING',
  INACTIVE = 'INACTIVE',
  CANCELLED = 'CANCELLED'
}

export enum VoucherStatusEnum {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE'
}

export enum ProductCartStatusEnum {
  HIDDEN = 'HIDDEN',
  SOLD_OUT = 'SOLD_OUT'
}
export enum ClassificationTypeEnum {
  DEFAULT = 'DEFAULT',
  CUSTOM = 'CUSTOM'
}

export enum VoucherUsedStatusEnum {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  UNCLAIMED = 'UNCLAIMED'
}

export enum VoucherUnavailableReasonEnum {
  MINIMUM_ORDER_NOT_MET = 'MINIMUM_ORDER_NOT_MET',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  NOT_START_YET = 'NOT_START_YET',
  NOT_APPLICABLE = 'NOT_APPLICABLE'
}

export enum ResultEnum {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  FAILURE = 'FAILURE'
}

export enum RequestStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum ServiceTypeEnum {
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM'
}
export enum WeekDay {
  MONDAY = 2,
  TUESDAY = 3,
  WEDNESDAY = 4,
  THURSDAY = 5,
  FRIDAY = 6,
  SATURDAY = 7,
  SUNDAY = 8
}

export enum BookingTypeEnum {
  SERVICE = 'SERVICE',
  INTERVIEW = 'INTERVIEW'
}
export enum BookingStatusEnum {
  TO_PAY = 'TO_PAY',
  WAIT_FOR_CONFIRMATION = 'WAIT_FOR_CONFIRMATION',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  SERVICE_BOOKING_FORM_SUBMITED = 'SERVICE_BOOKING_FORM_SUBMITED',
  SENDED_RESULT_SHEET = 'SENDED_RESULT_SHEET',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED'
}

export enum ProductQuantityWarningEnum {
  SOLD_OUT = 'SOLD_OUT',
  ALMOST_OUT = 'ALMOST_OUT'
}

export enum FeedbackFilterEnum {
  ALL = 'ALL',
  RATING = 'RATING',
  IMAGE_VIDEO = 'IMAGE_VIDEO',
  CLASSIFICATION = 'CLASSIFICATION'
}

export enum OrderRequestTypeEnum {
  CANCEL = 'CANCEL',
  REFUND = 'REFUND',
  REJECT_REFUND = 'REJECT_REFUND',
  COMPLAINT = 'COMPLAINT'
}

export enum ActionReceivedEnum {
  RECEIVED = 'RECEIVED',
  NOT_RECEIVED = 'NOT_RECEIVED'
}

export enum ModeEnum {
  VIEW = 'VIEW',
  EDIT = 'EDIT'
}
export enum BlogEnum {
  UN_PUBLISHED = 'UN_PUBLISHED',
  PUBLISHED = 'PUBLISHED',
  INACTIVE = 'INACTIVE'
}
