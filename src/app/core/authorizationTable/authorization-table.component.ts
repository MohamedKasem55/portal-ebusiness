import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../responsive/datatable-mobile.component'

@Component({
  selector: 'app-levels-table',
  templateUrl: './authorization-table.component.html',
})
export class AuthorizationLevelTableComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('authorizationPageTable') authorizationPageTable: any
  @Input() futureSecurityLevels: any

  pageAuthorizationSize = 20

  bsConfig: any
  today = new Date()

  constructor(public translate: TranslateService) {
    super()
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.authorizationPageTable) {
      tablas.push(this.authorizationPageTable)
    }
    return tablas
  }
}
