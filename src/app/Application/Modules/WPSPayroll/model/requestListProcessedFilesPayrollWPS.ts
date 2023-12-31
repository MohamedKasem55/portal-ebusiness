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

export interface RequestListProcessedFilesPayrollWPS {
  amountFrom?: number
  amountTo?: number
  batchName?: string
  customerReference?: string
  debitAccount?: string
  fileType?: string
  initiationDateFrom?: string
  initiationDateTo?: string
  /**
   * Num Page
   */
  page: number
  paymentDatefrom?: string
  paymentDateto?: string
  paymentPurpose?: string
  /**
   * Num Rows for Page
   */
  rows: number
  search?: boolean
  systemFileName?: string
}
