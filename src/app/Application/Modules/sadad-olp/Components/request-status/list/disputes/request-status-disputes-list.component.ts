import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { FormBuilder } from '@angular/forms'

import { AbstractDatatableMobileComponent } from '../../../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { AuthenticationService } from '../../../../../../../core/security/authentication.service'
import { StaticService } from '../../../../../Common/Services/static.service'
import { RequestStatusDisputesListService } from './request-status-disputes-list.service'
import { ManageRequestStatusDisputesEntityService } from '../../request-status-disputes-entity.service'
import { ModalDirective } from 'ngx-bootstrap/modal'

@Component({
  selector: 'app-request-status-disputes-list-form',
  templateUrl: './request-status-disputes-list.component.html',
  styleUrls: ['./request-status-disputes-list.component.scss'],
})
export class RequestStatusDisputesListComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('authorizationPopUp', { static: true })
  public modal: ModalDirective
  futureLevels = false

  constructor(
    public fb: FormBuilder,
    public service: RequestStatusDisputesListService,
    public translate: TranslateService,
    public staticService: StaticService,
    private serviceData: ManageRequestStatusDisputesEntityService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, authenticationService, router)

    this.order = 'initiationDate'
    this.orderType = 'desc'
  }

  getId(row) {
    return row['refundId']
  }

  getList(searchElement, order, orderType, offset, pageSize) {
    this.subscriptions.push(
      this.service
        .getResults(searchElement, order, orderType, offset, pageSize)
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.elementsPage = result
          }
        }),
    )
  }

  displayCheck(row) {
    return row.status == 'R'
  }

  onSelect({ selected }) {
    this.tableSelectedRows = []
    this.tableSelectedRows.splice(0, selected.length)
    this.tableSelectedRows.push(...selected)
    this.serviceData.setSelectedData(this.tableSelectedRows)
    return this.tableSelectedRows
  }

  openModal(row, popup) {
    popup.openModal(row)
  }

  ngOnInit() {
    super.ngOnInit()
    this.serviceData.clear()
    this.search()
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }
}
