import { Component, OnInit, OnDestroy, Injector } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { FormBuilder } from '@angular/forms'

import { AbstractDatatableMobileComponent } from '../../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { StaticService } from '../../../../Common/Services/static.service'
import { CardAllocationRequestService } from './card-allocation-request.service'
import { ModelPipe } from '../../../../../Components/common/Pipes/model-pipe'
import { StatusPipe } from '../../../../../Components/common/Pipes/status-pipe'
import { CardAllocationReactivateEntityService } from './reactivate/card-allocation-reactivate-entity.service'

@Component({
  selector: 'app-card-allocation-request-form',
  templateUrl: './card-allocation-request.component.html',
  styleUrls: ['./card-allocation-request.component.scss'],
})
export class CardAllocationRequestComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  futureLevels = false

  constructor(
    public fb: FormBuilder,
    public service: CardAllocationRequestService,
    public translate: TranslateService,
    public staticService: StaticService,
    public authenticationService: AuthenticationService,
    private serviceData: CardAllocationReactivateEntityService,
    public router: Router,
    public modelPipe: ModelPipe,
    private injector: Injector,
  ) {
    super(fb, translate, authenticationService, router)

    this.order = 'initiationDate'
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
    return row['batchPk']
  }

  getList(searchElement, order, orderType, offset, pageSize) {
    this.subscriptions.push(
      this.service
        .getResults(searchElement, order, orderType, offset, pageSize)
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            result.data.forEach((element) => {
              const tempStatus = element.status.toString()
              element['_statusForExport'] = new StatusPipe(
                this.injector,
              ).transform(tempStatus)
            })
            this.elementsPage = result
          }
        }),
    )
  }

  goActivate(row) {
    this.subscriptions.push(
      this.service
        .requestStatusCardsAllocatedDetails(row)
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.serviceData.clear()
            this.serviceData.setSelectedData(result)
            this.router.navigate([
              '/hajjandumrahcards/reqStatus/card-allocation/activate',
            ])
          }
        }),
    )
  }

  ngOnInit() {
    super.ngOnInit()
    this.search()
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  openModal(row, popup) {
    if (this.futureLevels) popup.openModal(row.futureSecurityLevelsDTOList)
    else {
      popup.openModal(row.securityLevelsDTOList)
    }
  }
}
