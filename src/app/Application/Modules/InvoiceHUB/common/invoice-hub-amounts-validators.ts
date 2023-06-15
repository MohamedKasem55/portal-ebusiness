import { FormControl } from '@angular/forms'

export function searchFormAmountFromValidator(ctrl: FormControl) {
  if (ctrl === undefined) {
    return null
  }
  if (ctrl.value === null || ctrl.value === '') {
    return null
  }
  const amountFrom = +ctrl.value
  if (ctrl.parent === undefined) {
    return { validAmountFrom: false }
  }
  const amountTo = ctrl.parent.controls['amountTo']
  if (
    amountTo.value !== undefined &&
    amountTo.value !== null &&
    amountTo.value !== ''
  ) {
    const amountToValue = amountTo.value
    if (amountFrom > amountToValue) {
      return { validAmountFrom: false }
    }
  }
  return null
}

export function searchFormAmountToValidator(ctrl: FormControl) {
  if (ctrl === undefined) {
    return null
  }
  if (ctrl.value === null || ctrl.value === '') {
    return null
  }
  const amountTo = +ctrl.value
  if (ctrl.parent === undefined) {
    return { validAmountFrom: false }
  }
  const amountFrom = ctrl.parent.controls['amountFrom']
  if (
    amountFrom.value !== undefined &&
    amountFrom.value !== null &&
    amountFrom.value !== ''
  ) {
    const amountFromFromValue = amountFrom.value
    if (amountFromFromValue > amountTo) {
      return { validAmountFrom: false }
    }
  }
  return null
}
