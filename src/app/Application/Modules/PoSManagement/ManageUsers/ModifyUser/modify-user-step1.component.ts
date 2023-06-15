import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'

@Component({
  selector: 'app-modify-user-step1',
  templateUrl: './modify-user-step1.component.html',
  styleUrls: ['./modify-user.component.scss'],
})
export class ModifyUserStep1Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('accountsPosSearchPanelTable', { static: true }) table: any
  @Input() selectedUser: any

  terminalPageSize: any
  mensajeError: any = {}
  subscriptions: Subscription[] = []

  constructor(private fb: FormBuilder, public translate: TranslateService) {
    super()
    this.terminalPageSize = 20
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

  getRegionName(value) {
    return value
  }
}
