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
import { HostRequestDTO } from './hostRequestDTO'
import { PayrollFileHeaderDSO } from './payrollFileHeaderDSO'
import { WPSCompanyEmployeeDSO } from './wPSCompanyEmployeeDSO'

export interface WPSPayrollFileUploadBatchDSO {
  accountAlias?: string
  accountNumber?: string
  amount?: number
  approvedBy?: string
  approvedDate?: string
  batchName?: string
  batchPk?: number
  cancelled?: boolean
  cancelledFilename?: string
  companyCode?: string
  fileHash?: string
  fileReference?: string
  futureSecurityLevelsDTOList?: Array<BatchSecurityDTO>
  futureStatus?: WPSPayrollFileUploadBatchDSO.FutureStatusEnum
  hostRequest?: HostRequestDTO
  initiatedBy?: string
  initiationDate?: string
  listEmployees?: Array<WPSCompanyEmployeeDSO>
  localRecordAmount?: number
  localRecordCount?: number
  nextStatus?: string
  paymentDate?: string
  paymentPurpose?: string
  payrollFileHeader?: PayrollFileHeaderDSO
  payrollFileUploadBatchPk?: number
  pdfSecurityLevelsDTOList?: Array<BatchSecurityDTO>
  rajhiRecordAmount?: number
  rajhiRecordCount?: number
  rejectedReason?: string
  remarks?: string
  securityLevelsDTOList?: Array<BatchSecurityDTO>
  status?: string
  systemFileName?: string
  totalAmount?: number
  type?: string
  userFileName?: string
}
export namespace WPSPayrollFileUploadBatchDSO {
  export type FutureStatusEnum = 'NOT_ALLOWED' | 'PROCESS' | 'PENDING'
  export const FutureStatusEnum = {
    NOTALLOWED: 'NOT_ALLOWED' as FutureStatusEnum,
    PROCESS: 'PROCESS' as FutureStatusEnum,
    PENDING: 'PENDING' as FutureStatusEnum,
  }
}