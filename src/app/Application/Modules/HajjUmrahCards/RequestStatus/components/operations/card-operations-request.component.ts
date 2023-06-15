import { Component, OnInit, OnDestroy, Injector } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { FormBuilder } from '@angular/forms'

import { AbstractDatatableMobileComponent } from '../../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { StaticService } from '../../../../Common/Services/static.service'
import { CardOperationsRequestService } from './card-operations-request.service'
import { ModelPipe } from '../../../../../Components/common/Pipes/model-pipe'
import { StatusPipe } from '../../../../../Components/common/Pipes/status-pipe'
import { CardOperationsReactivateEntityService } from './reactivate/card-operations-reactivate-entity.service'

@Component({
  selector: 'app-card-operations-request-form',
  templateUrl: './card-operations-request.component.html',
  styleUrls: ['./card-operations-request.component.scss'],
})
export class CardOperationsRequestComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  futureLevels = false

  constructor(
    public fb: FormBuilder,
    public service: CardOperationsRequestService,
    private serviceData: CardOperationsReactivateEntityService,
    public translate: TranslateService,
    public staticService: StaticService,
    public cardOperationsRequestService: CardOperationsRequestService,
    public authenticationService: AuthenticationService,
    public router: Router,
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
              const tempOperationType = element.operation
              element['_opTypeForExport'] = new ModelPipe(
                this.injector,
              ).transform('hajjUmrahcardsOperations', tempOperationType)
            })
            this.elementsPage = result
          }
        }),
    )
  }

  ngOnInit() {
    super.ngOnInit()
    this.search()
    this.initModelData()
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  goActivate(row) {
    this.subscriptions.push(
      this.service
        .requestStatusCardsOperationDetails(row)
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.serviceData.clear()
            this.serviceData.setSelectedData(result)
            this.router.navigate([
              '/hajjandumrahcards/reqStatus/card-operation/activate',
            ])
          }
        }),
    )
  }

  openModal(row, popup) {
    if (this.futureLevels) popup.openModal(row.futureSecurityLevelsDTOList)
    else {
      popup.openModal(row.securityLevelsDTOList)
    }
  }

  public initModelData() {
    const transformData: any = {}
    const combosKeys = ['hajjUmrahcardsOperations', 'hajjCardsStatus']
    transformData['hajjUmrahcardsOperations'] = []
    transformData['hajjCardsStatus'] = []

    this.staticService.getAllCombos(combosKeys).subscribe((comboData) => {
      const data = comboData
      const cardsOperationsValues =
        data[combosKeys.indexOf('hajjUmrahcardsOperations')]['values']
      const cardsStatusValues =
        data[combosKeys.indexOf('hajjCardsStatus')]['values']

      Object.keys(cardsOperationsValues).map((key, index) => {
        transformData['hajjUmrahcardsOperations'][key] =
          cardsOperationsValues[key]
      })
      Object.keys(cardsStatusValues).map((key, index) => {
        transformData['hajjCardsStatus'][key] = cardsStatusValues[key]
      })
      this.cardOperationsRequestService.transformData = transformData
    })
  }
}
