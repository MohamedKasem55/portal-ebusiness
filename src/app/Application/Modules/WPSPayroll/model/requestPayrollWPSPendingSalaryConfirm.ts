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
import { RequestValidatePayments } from './requestValidatePayments'
import { WPSPayrollSalaryPaymentBatchDSO } from './wPSPayrollSalaryPaymentBatchDSO'

export interface RequestPayrollWPSPendingSalaryConfirm {
  payrollSalaryPaymentBatch?: WPSPayrollSalaryPaymentBatchDSO
  requestValidate?: RequestValidatePayments
}
