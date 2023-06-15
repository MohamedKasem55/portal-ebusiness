import {
  AfterContentChecked,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { DatatableMobileComponent } from '../responsive/datatable-mobile.component'
@Component({
  selector: 'app-levels-popup',
  templateUrl: './authorization-popup.component.html',
})
export class AuthorizationLevelPopUpComponent
  extends DatatableMobileComponent
  implements OnInit, AfterContentChecked
{
  @ViewChild('authorizationPageTable')
  authorizationPageTable: DatatableComponent
  @ViewChild('authorizationPopUp', { static: true })
  public modal: ModalDirective
  futureSecurityLevels: any = []

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

  // This method purpose is to re-paint the table to prevent column colapse
  ngAfterContentChecked() {
    this.futureSecurityLevels = [...this.futureSecurityLevels]
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.authorizationPageTable) {
      tablas.push(this.authorizationPageTable)
    }
    return tablas
  }

  openModal(row) {
    this.modal.show()
    this.futureSecurityLevels = row
  }
}
