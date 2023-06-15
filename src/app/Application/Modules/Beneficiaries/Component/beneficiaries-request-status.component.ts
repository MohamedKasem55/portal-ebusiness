import {
  AfterViewChecked,
  Component,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { AuthenticationService } from '../../../../core/security/authentication.service'
import { LevelFormatPipe } from '../../../Components/common/Pipes/getLevels-pipe'
import { PagedData } from '../../../Model/paged-data'
import { ModelRequestBeneficiaries } from '../../../Modules/Beneficiaries/Model/beneficiaries-request.model'
import { RequestBeneficiariesService } from '../../../Modules/Beneficiaries/Services/beneficiaries-request.service'
import { StaticService } from '../../Common/Services/static.service'

@Component({
  templateUrl: '../View/beneficiary-resquest.html',
  styles: [
    `
      @media screen and (max-width: 800px) {
        .desktop-hidden {
          display: initial;
        }

        .mobile-hidden {
          display: none;
          width: 0%;
        }
      }

      @media screen and (min-width: 800px) {
        .desktop-hidden {
          display: none;
        }

        .mobile-hidden {
          display: initial;
        }
      }
    `,
  ],
})
export class RequestStatusComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  @ViewChild('table', { static: true }) table: any

  AllRequest: any
  requestTablePage: PagedData<ModelRequestBeneficiaries>

  public innerWidth: any
  public mobile = false

  order: string
  orderType: string
  loading: boolean
  futureLevels = false

  combosSolicitados = ['batchSecurityLevelStatus', 'countryName', 'bankCode']
  subscriptions: Subscription[] = []
  status = []
  countries = []
  banks = []

  rajhiType = 'BW'
  localType = 'BL'
  internationalType = 'BT'

  constructor(
    public service: RequestBeneficiariesService,
    public translate: TranslateService,
    public staticService: StaticService,
    private router: Router,
    private injector: Injector,
    public authenticationService: AuthenticationService,
  ) {
    super()
    this.requestTablePage = new PagedData<ModelRequestBeneficiaries>()
    this.order = 'initiationDate'
    this.orderType = 'desc'
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.refreshData()
    })
  }

  refreshData() {
    this.subscriptions.push(
      this.staticService
        .getAllCombos(this.combosSolicitados)
        .subscribe((comboData) => {
          const data: any = comboData
          this.status =
            data[this.combosSolicitados.indexOf('batchSecurityLevelStatus')][
              'values'
            ]
          this.countries =
            data[this.combosSolicitados.indexOf('countryName')]['values']
          this.banks =
            data[this.combosSolicitados.indexOf('bankCode')]['values']
          this.setPage({ offset: this.requestTablePage.page.pageNumber - 1 })
        }),
    )
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }
    this.loading = true

    this.subscriptions.push(
      this.service
        .getResults(
          dataTableEvent.offset + 1,
          this.requestTablePage.page.pageSize,
        )
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
            //console.log("aqui vamos-->"+result);
          } else {
            this.loading = false
            this.processItemsLevels(result.data)
            this.requestTablePage = result
          }
        }),
    )
  }

  setSort(dataTableEvent) {
    if (dataTableEvent.sorts[0]) {
      this.order = dataTableEvent.sorts[0].prop
      this.orderType = dataTableEvent.sorts[0].dir
    }
    this.requestTablePage.page.pageNumber = 1
    this.loading = true

    // Service Call with new short
    this.subscriptions.push(
      this.service
        .getResults(
          this.requestTablePage.page.pageNumber,
          this.requestTablePage.page.pageSize,
        )
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.loading = false
            //
            this.requestTablePage = result
          }
        }),
    )
  }

  onError(result) {
    //
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    this.innerWidth = window.innerWidth
    this.requestTablePage.page.pageSize = 50
    this.subscriptions.push(
      this.staticService
        .getAllCombos(this.combosSolicitados)
        .subscribe((comboData) => {
          const data: any = comboData
          this.status =
            data[this.combosSolicitados.indexOf('batchSecurityLevelStatus')][
              'values'
            ]
          this.countries =
            data[this.combosSolicitados.indexOf('countryName')]['values']
          this.banks =
            data[this.combosSolicitados.indexOf('bankCode')]['values']
          this.setPage({ offset: 0 })
        }),
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  goActivate(row, name) {
    if (row.batchType === this.rajhiType) {
      this.subscriptions.push(
        this.service.getAlRajhiDetails(row).subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.service.setElement(result)
            this.service.setType('rajhi')
            this.router.navigate(['/beneficiaries/requestStatus/activate'])
          }
        }),
      )
    } else if (row.batchType === this.localType) {
      this.subscriptions.push(
        this.service.getLocalDetails(row).subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.service.setElement(result)
            this.service.setType('local')
            this.router.navigate(['/beneficiaries/requestStatus/activate'])
          }
        }),
      )
    } else if (row.batchType === this.internationalType) {
      this.subscriptions.push(
        this.service.getInternationalDetails(row).subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.service.setElement(result)
            this.service.setType('international')
            this.router.navigate(['/beneficiaries/requestStatus/activate'])
          }
        }),
      )
    }
  }

  onDetailToggle(event) {
    //console.log('Detail Toggled', event);
  }

  openModal(row, popup) {
    if (this.futureLevels) {
      popup.openModal(row.futureSecurityLevelsDTOList)
    } else {
      popup.openModal(row.securityLevels)
    }
  }

  protected processItemsLevels(items) {
    if (Array.isArray(items) && items.length > 0) {
      items.forEach((item) => {
        item['curStatusExport'] = new LevelFormatPipe(this.injector).transform(
          item.securityLevels,
          'status',
        )
        item['nextStatusExport'] = new LevelFormatPipe(this.injector).transform(
          item.securityLevels,
          'nextStatus',
        )
      })
    }
  }
}
