import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export function TenureLimit(tenureLimit: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    console.log("tenureLimit=> ",tenureLimit);
    
    let controlValue: number = control.value
    if (controlValue > tenureLimit || controlValue < 12)
      return { validTenure: false }
    else return null
  }
}
