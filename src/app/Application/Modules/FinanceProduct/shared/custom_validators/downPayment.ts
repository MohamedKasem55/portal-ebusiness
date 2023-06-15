import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export function DownPayment(minLimit: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let controlValue: number = control.value
    if (controlValue > 50 || controlValue < minLimit)
      return { validDownPayment: false }
    else return null
  }
}
