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
import { WPSCompanyEmployeeDSO } from './wPSCompanyEmployeeDSO'
import { WPSSalaryPaymentDetailsDSO } from './wPSSalaryPaymentDetailsDSO'

export interface RequestValidateSalaryPaymentPayrollWPS {
  accountNumber?: string
  salaryPaymentDetails?: WPSSalaryPaymentDetailsDSO
  selectedEmployeesList?: Array<WPSCompanyEmployeeDSO>
}
