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
import { SalaryFileDetailsDTO } from './salaryFileDetailsDTO'
import { SalaryFileHeaderDTO } from './salaryFileHeaderDTO'
import { WPSSalaryFileDetailsDTO } from './wPSSalaryFileDetailsDTO'

export interface WPSSalaryFileDSO {
  accountFrom?: string
  approvedBy?: string
  approvedDate?: string
  batchName?: string
  batchPk?: number
  cancelled?: boolean
  companyCode?: string
  customerReference?: string
  dataReceived?: string
  dirUploadArchive?: boolean
  fileHash?: string
  fileName?: string
  fileSize?: number
  initiatedBy?: string
  initiationDate?: string
  localRecordAmount?: number
  localRecordCount?: number
  localRecordFees?: number
  molEstbid?: string
  numPaid?: number
  numUnPaid?: number
  paid?: number
  path?: string
  paymentDate?: string
  paymentPurpose?: string
  rajhiRecordAmount?: number
  rajhiRecordCount?: number
  rajhiRecordFees?: number
  salaryDetailsDTOList?: Array<SalaryFileDetailsDTO>
  salaryFileHeaderDTO?: SalaryFileHeaderDTO
  totalAmount?: number
  type?: string
  unPaid?: number
  userFileName?: string
  wpsSalaryDetailsDTOList?: Array<WPSSalaryFileDetailsDTO>
}
