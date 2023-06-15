import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { FormBuilder } from '@angular/forms'

import { AbstractDatatableMobileComponent } from '../../../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { AuthenticationService } from '../../../../../../../core/security/authentication.service'
import { StaticService } from '../../../../../Common/Services/static.service'
import { RequestStatusRefundsListService } from './request-status-refunds-list.service'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { ManageRequestStatusRefundsEntityService } from '../../request-status-refunds-entity.service'

@Component({
  selector: 'app-request-status-refunds-list-form',
  templateUrl: './request-status-refunds-list.component.html',
  styleUrls: ['./request-status-refunds-list.component.scss'],
})
export class RequestStatusRefundsListComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('authorizationPopUp', { static: true })
  public modal: ModalDirective
  futureLevels = false

  constructor(
    public fb: FormBuilder,
    public service: RequestStatusRefundsListService,
    public translate: TranslateService,
    public staticService: StaticService,
    private serviceData: ManageRequestStatusRefundsEntityService,
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

  onSelect({ selected }) {
    this.tableSelectedRows = []
    this.tableSelectedRows.splice(0, selected.length)
    this.tableSelectedRows.push(...selected)
    this.serviceData.setSelectedData(this.tableSelectedRows)
    return this.tableSelectedRows
  }

  displayCheck(row) {
    return row.status == 'R'
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
