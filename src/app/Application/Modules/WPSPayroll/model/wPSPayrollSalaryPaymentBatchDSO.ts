/**
 * Api Documentation
 * Api Documentation
 *
 * OpenAPI spec version: 1.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { BatchSecurityDTO } from './batchSecurityDTO'
import { CompanyEmployeeDSO } from './companyEmployeeDSO'
import { HostRequestDTO } from './hostRequestDTO'
import { PayrollDetailsDTO } from './payrollDetailsDTO'
import { SalaryPaymentDetailsDTO } from './salaryPaymentDetailsDTO'
import { WPSPayrollDetailsDTO } from './wPSPayrollDetailsDTO'

export interface WPSPayrollSalaryPaymentBatchDSO {
  accountAlias?: string
  accountFrom15length?: string
  accountNumber?: string
  amount?: number
  batchName?: string
  batchPk?: number
  companyCode?: string
  currencyCode?: string
  customerReference?: string
  details?: Array<PayrollDetailsDTO>
  fileHash?: string
  fileReference?: string
  futureSecurityLevelsDTOList?: Array<BatchSecurityDTO>
  futureStatus?: WPSPayrollSalaryPaymentBatchDSO.FutureStatusEnum
  hostRequest?: HostRequestDTO
  initiationDate?: string
  localRecordAmount?: number
  localRecordCount?: number
  molEstbId?: string
  nextStatus?: string
  payName?: string
  paymentDate?: string
  paymentDateMinus1?: Date
  paymentPurpose?: string
  payrollSalaryPaymentBatchPk?: number
  pdfSecurityLevelsDTOList?: Array<BatchSecurityDTO>
  rajhiRecordAmount?: number
  rajhiRecordCount?: number
  rejectedReason?: string
  remarks?: string
  salaryPaymentDetailsDTO?: SalaryPaymentDetailsDTO
  securityLevelsDTOList?: Array<BatchSecurityDTO>
  selectedEmployeeList?: Array<CompanyEmployeeDSO>
  sequence?: string
  status?: string
  totalAmount?: number
  transferDate?: string
  type?: string
  wpsDetails?: Array<WPSPayrollDetailsDTO>
}
export namespace WPSPayrollSalaryPaymentBatchDSO {
  export type FutureStatusEnum = 'NOT_ALLOWED' | 'PROCESS' | 'PENDING'
  export const FutureStatusEnum = {
    NOTALLOWED: 'NOT_ALLOWED' as FutureStatusEnum,
    PROCESS: 'PROCESS' as FutureStatusEnum,
    PENDING: 'PENDING' as FutureStatusEnum,
  }
}
