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
import { ErrorServiceResponse } from './errorServiceResponse'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { WPSCompanyEmployeeDSO } from './wPSCompanyEmployeeDSO'
import { WPSPayrollSalaryPaymentBatchDSO } from './wPSPayrollSalaryPaymentBatchDSO'

export interface ResponseGetSelectedBatchPayrollWPS {
  _delete?: boolean
  errorCode?: string
  errorDescription?: string
  errorResponse?: ErrorServiceResponse
  generateChallengeAndOTP?: ResponseGenerateChallenge
  initiate?: boolean
  payrollBatch?: WPSPayrollSalaryPaymentBatchDSO
  selectedEmployeeList?: Array<WPSCompanyEmployeeDSO>
}
