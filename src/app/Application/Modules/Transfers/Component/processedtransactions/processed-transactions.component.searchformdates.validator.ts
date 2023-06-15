import { FormControl } from '@angular/forms'

export function searchFormDateToValidators(ctrl: FormControl) {
  if (ctrl == undefined) {
    return null
  }
  if (ctrl.value === null || ctrl.value === '') {
    return null
  }
  let dateTo = ctrl.value
  if (ctrl.parent === undefined || !(dateTo instanceof Date)) {
    return { validDate: false }
  }
  let dateFrom = ctrl.parent.controls['lastApprovalDateFrom'].value
  if (dateFrom instanceof Date) {
    dateTo = new Date(dateTo)
    dateFrom = new Date(dateFrom)
    dateFrom.setHours(0, 0, 0, 0)
    dateTo.setHours(0, 0, 0, 0)
    return dateTo >= dateFrom ? null : { validDate: false }
  } else {
    return null
  }
}
export function searchFormDateFromValidators(ctrl: FormControl) {
  if (ctrl == undefined) {
    return null
  }
  if (ctrl.value === null || ctrl.value === '') {
    return null
  }
  let dateFrom = ctrl.value
  if (ctrl.parent === undefined || !(dateFrom instanceof Date)) {
    return { validDate: false }
  }
  let dateTo = ctrl.parent.controls['lastApprovalDateTo'].value
  if (dateTo instanceof Date) {
    dateTo = new Date(dateTo)
    dateFrom = new Date(dateFrom)
    dateTo.setHours(0, 0, 0, 0)
    dateFrom.setHours(0, 0, 0, 0)
    return dateTo >= dateFrom ? null : { validDate: false }
  } else {
    return null
  }
}
