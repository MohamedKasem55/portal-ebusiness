import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'

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
  @Input() form: FormGroup
  @Input() types: any = []
  @Input() cities: any = []
  @Input() terminals: any
  @Input() mobile: any

  tablePageSize = 10
  tableSelectedRows: any = []

  subscriptions: Subscription[] = []

  constructor(public translate: TranslateService) {
    super()
  }
  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    this.form.controls.mobileNumber.patchValue(this.mobile)
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
    this.tableSelectedRows = []
    this.tableSelectedRows.splice(0, selected.length)
    this.tableSelectedRows.push(...selected)
    this.form.controls.terminalNumber.patchValue(this.tableSelectedRows)
    return this.tableSelectedRows
  }
}
