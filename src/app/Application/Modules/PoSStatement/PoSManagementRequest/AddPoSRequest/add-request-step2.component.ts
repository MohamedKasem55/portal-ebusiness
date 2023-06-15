import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'

@Component({
  selector: 'app-add-request-step2',
  templateUrl: './add-request-step2.component.html',
  styleUrls: ['./add-request.component.scss'],
})
export class AddRequestStep2Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('pageTable', { static: true }) table: any
  @Input() form: any
  @Input() types: any
  @Input() cities: any
  @Input() terminals: any
  @Input() accounts: any

  subscriptions: Subscription[] = []
  tablePageSize = 10

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

  isAccount() {
    return ['001', '004'].indexOf(this.form.controls['requestType'].value) > -1
  }
}
