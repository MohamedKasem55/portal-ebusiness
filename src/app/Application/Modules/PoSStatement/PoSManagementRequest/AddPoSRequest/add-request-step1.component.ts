import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from 'app/core/responsive/datatable-mobile.component'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-add-request-step1',
  templateUrl: './add-request-step1.component.html',
  styleUrls: ['./add-request.component.scss'],
})
export class AddRequestStep1Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('pageTable', { static: true }) table: any
  @Input() form: any
  @Input() types: any
  @Input() cities: any
  @Input() terminals: any
  @Input() accounts: any
  @Input() mobile: any

  tablePageSize = 10
  tableSelectedRows: any = []

  subscriptions: Subscription[] = []

  constructor(public translate: TranslateService) {
    //console.log(this.form);
    super()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    this.subscriptions.push(
      this.form.controls['requestType'].valueChanges.subscribe((values) => {
        this.changeRequestType(values)
      }),
    )
    this.form.controls.mobileNumber.patchValue(this.mobile)
    if (Array.isArray(this.form.controls.terminalNumber.value)) {
      this.tableSelectedRows = this.form.controls.terminalNumber.value
    }
  }

  changeRequestType(value) {
    if (this.isAccount()) {
      this.form.controls['accountNumber'].setValidators(Validators.required)
      this.form.controls['accountNumber'].updateValueAndValidity()
    } else {
      this.form.controls['accountNumber'].clearValidators()
      this.form.controls['accountNumber'].reset()
      this.form.controls['accountNumber'].updateValueAndValidity()
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
  }

  onSelect({ selected }) {
    // console.log(selected);
    this.tableSelectedRows = []
    this.tableSelectedRows.splice(0, selected.length)
    this.tableSelectedRows.push(...selected)
    this.form.controls.terminalNumber.patchValue(this.tableSelectedRows)
    return this.tableSelectedRows
  }

  isAccount() {
    return (
      ['G001', 'G004'].indexOf(this.form.controls['requestType'].value) > -1
    )
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  getId(row): any {
    return row['terminalNumber']
  }
}
