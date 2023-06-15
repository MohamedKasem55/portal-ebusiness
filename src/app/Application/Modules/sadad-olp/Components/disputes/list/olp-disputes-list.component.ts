import { Component, OnInit, OnDestroy } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { FormBuilder } from '@angular/forms'

import { AbstractDatatableMobileComponent } from '../../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { StaticService } from '../../../../Common/Services/static.service'
import { OLPDisputesListService } from './olp-disputes-list.service'
import { ManageOLPDisputeEntityService } from '../olp-disputes-entity.service'

@Component({
  selector: 'app-disputes-list-form',
  templateUrl: './olp-disputes-list.component.html',
  styleUrls: ['./olp-disputes-list.component.scss'],
})
export class OLPDisputesListComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  disputeReasonSelect: any[] = []
  statusSelect: any[] = []

  constructor(
    public fb: FormBuilder,
    public service: OLPDisputesListService,
    public translate: TranslateService,
    public staticService: StaticService,
    private serviceData: ManageOLPDisputeEntityService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, authenticationService, router)

    this.order = 'disputeId'
    this.orderType = 'desc'

    this.searchForm = this.fb.group({
      transactionId: [],
      disputeId: [],
      status: [],
      disputeReason: [],
      dateFrom: [''],
      dateTo: [''],
    })
  }

  getId(row) {
    return row['disputeId']
  }

  refreshData() {
    const combosSolicitados = ['olpDisputesStatus']
    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: Object = comboData
        this.statusSelect = this.staticRecoverValues(
          combosSolicitados,
          data,
          'olpDisputesStatus',
        )
      })

    this.subscriptions.push(
      this.service.init().subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          for (let i = 1; i < result.categories.length; i++) {
            this.disputeReasonSelect.push({
              key: result.categories[i].categoryId,
              value: result.categories[i].description,
            })
          }
        }
      }),
    )
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

  getDetails(row: any) {
    this.serviceData.setSelectedData(row)
    this.router.navigate(['/sadadOLP/olp-disputes-detail'])
  }

  ngOnInit() {
    super.ngOnInit()
    this.search()
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }
}
