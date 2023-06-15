export interface ErrorResponse {
  englishMessage: string
  arabicMessage: string
  code: string
  description: string
  reference?: string
}

export interface Welcome {
  errorCode: string
  errorDescription: string
  errorResponse: ErrorResponse
  limitCIC: number
  limitUtilized: number
  alertMaxLimit: number
  alertExpirationDate?: any
  crExpiryDate?: any
  utilizedUserSMS: number
  smsAlertExpiryFlag: boolean
  smsAlertAlreadyExpiredFlag: boolean
  smsAlertLeftCount: string
  smsAlertExpiryDate: string
  nationalAdress: string
  dailyTransferLimitRemaining: number
  billPaymentRemaining: number
  bulkPaymentsRemaining: number
  sadadInvoiceHubRemaining: number
  govermentPaymentRemaining: number
  fundLimitRemaining: number
  userDailyTransferLimit: number
  ownLimit: number
  withinLimit: number
  localLimit: number
  internationalLimit: number
}
