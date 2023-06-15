import { FormControl } from '@angular/forms'
import { isDate } from 'ngx-bootstrap/chronos'

export function searchFormDateFromValidators(ctrl: FormControl) {
  if (ctrl == undefined) {
    return null
  }
  if (ctrl.value === null || ctrl.value === '') {
    return null
  }
  const dateFrom = ctrl.value
  if (ctrl.parent === undefined || !isDate(dateFrom)) {
    return { validDate: false }
  }
  const dateTo = ctrl.parent.controls['dateTo'].value
  if (isDate(dateTo)) {
    dateFrom.setHours(0, 0, 0, 0)
    dateTo.setHours(0, 0, 0, 0)
    return dateTo >= dateFrom ? null : { validDate: false }
  } else {
    return null
  }
}

export function searchFormDateToValidators(ctrl: FormControl) {
  if (ctrl == undefined) {
    return null
  }
  if (ctrl.value === null || ctrl.value === '') {
    return null
  }
  const dateTo = ctrl.value
  if (ctrl.parent === undefined || !isDate(dateTo)) {
    return { validDate: false }
  }
  const dateFrom = ctrl.parent.controls['dateFrom'].value
  if (isDate(dateFrom)) {
    dateFrom.setHours(0, 0, 0, 0)
    dateTo.setHours(0, 0, 0, 0)
    return dateTo >= dateFrom ? null : { validDate: false }
  } else {
    return null
  }
}
