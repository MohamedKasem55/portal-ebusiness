import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms'
import { DepositorOriginator } from '../../Model/depositor-originator'

export const totalAmountValidator: ValidatorFn = (
  control: FormGroup,
): ValidationErrors | null => {
  const totalAmount: AbstractControl = control.get('totalAmount')
  const amountsArray: FormArray = control.get('subAccountAmounts') as FormArray
  //fail fast has we need compare a lot
  if (
    !totalAmount ||
    !amountsArray ||
    totalAmount.invalid ||
    amountsArray.length == 0 ||
    amountsArray.invalid
  ) {
    return null
  }
  // So now all previous check are true
  const totalAmountValue: number = +control.get('totalAmount').value
  const cumulativeAmount: number = Number(amountsArray.controls
    .map((group) => +group.get('amount').value)
    .reduce((prev: number, next: number) => prev + next, 0).toFixed(2))

  return totalAmountValue !== cumulativeAmount ? { amountNotMatch: true } : null
}
export const compareDepositor = (
  d1: DepositorOriginator,
  d2: DepositorOriginator,
): boolean => {
  return d1 && d2
    ? d1.govRevenueDepositorsPk === d2.govRevenueDepositorsPk
    : d1 === d2
}
