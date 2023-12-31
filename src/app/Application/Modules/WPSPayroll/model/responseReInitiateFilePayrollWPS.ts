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
import { WPSPayrollFileUploadBatchDSO } from './wPSPayrollFileUploadBatchDSO'

export interface ResponseReInitiateFilePayrollWPS {
  errorCode?: string
  errorDescription?: string
  errorResponse?: ErrorServiceResponse
  generateChallengeAndOTP?: ResponseGenerateChallenge
  newPayrollBatch?: WPSPayrollFileUploadBatchDSO
}
