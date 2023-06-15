import { Location } from '@angular/common'
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
// Form
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { Subscription } from 'rxjs'
//MODELO VISUALIZACION TABLA
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { Exception } from 'app/Application/Model/exception'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
import { StaticService } from '../../Common/Services/static.service'
import { AccountsPosTerminalList } from '../accounts-pos-terminal-list.model'
// SERVICIO FORMULARIO
// MODELO Cuentas
import { PoSStatementService } from '../pos-statement.service'
import { FormDataService } from '../shared-form-data.service'

@Component({
  templateUrl: './list-pos-terminals.component.html',
})
export class ListPoSTerminalsComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('requestSubmittedModal')
  public requestSubmittedModal: ModalDirective
  @ViewChild('accountsPosSearchPanelTable', { static: true }) table: any

  order: string
  orderType: string

  //trae el modelo
  posPage: PagedData<AccountsPosTerminalList>

  //jobGroup: FormGroup = new FormGroup({});
  model: any

  isSearchCollapsed = true
  cities: any = []
  citiesInvert: any = []
  account: string
  accounts = []
  region: string
  regions: any = []
  city: string
  terminalID: string
  terminalName: string
  location: string
  phone: string
  mobileNumber: string
  faxNumber: string
  tableSelected: any[] = []
  wizardStep: number

  posData: any
  params: any = []
  mostrar: string

  loading: boolean

  selected
  initial
  terminalSubscription: Subscription
  subscriptions: Subscription[] = []

  constructor(
    public listDataService: PoSStatementService,
    //public serviceFormData: AccountFormData,
    //public serviceAccountList: AccountsList,
    public formBuilder: FormBuilder,
    public _location: Location,
    public router: Router,
    public translate: TranslateService,
    public staticService: StaticService,
    public sentDataservice: FormDataService,
  ) {
    super()
    // Definimos el objeto model, vació inicialmente para la validación de los campos (necesario)
    this.posPage = new PagedData<any>()
    this.posPage.data = []
    const page = new Page()
    page.pageNumber = 0
    //page.pageSize = 10;
    //this.posPage.page = page;

    // this.order;
    this.orderType = 'desc'
    this.model = {
      account: '',
      region: '',
      city: '',
      terminalID: '',
      terminalName: '',
      location: '',
      phone: '',
      mobileNumber: '',
      faxNumber: '',
    }
  }

  onChangeCity(cityCode): void {
    if (cityCode) {
      this.city = cityCode.target
    }
  }

  onChangeAccount(codeaccount: string): void {
    this.account = codeaccount
  }

  onChangeRegion(regionCode: string): void {
    this.region = regionCode
  }
  canShowSelectPlaceHolder(field) {
    if (field == null) {
      return true
    }
  }
  reset() {
    this.model = {
      account: '',
      region: '',
      city: '',
      terminalID: '',
      terminalName: '',
      location: '',
      phone: '',
      mobileNumber: '',
      faxNumber: '',
    }
    this.createNewPosSearch(null)
  }

  public createNewPosSearch(params): void {
    this.params = {
      accountNumber: this.model.account,
      //  "accountNumber": "204010529874932", //el de rriba carga el formulario
      allTerminals: true,
      asc: '',
      city: this.model.city,
      fax: this.model.faxNumber,
      location: this.model.location,
      mobile: this.model.mobileNumber,
      orderBy: 'terminalId',
      page: 1,
      phone: this.model.phone,
      region: this.model.region,
      rows: this.posPage.page.pageSize,
      sort: '',
      terminalId: this.model.terminalID,
      terminalName: this.model.terminalName,
    }

    this.setPage()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  setPage(dataTableEvent?) {
    if (!dataTableEvent) {
      dataTableEvent = { offset: 0 }
    } else if (!dataTableEvent.offset || Number.isNaN(dataTableEvent.offset)) {
      dataTableEvent.offset = 0
    }

    if (this.params.length == 0) {
      this.params = {
        page: dataTableEvent.offset ? dataTableEvent.offset + 1 : 1,
        rows: this.posPage.page.pageSize ? this.posPage.page.pageSize : 20,
        order: '',
        orderType: '',
      }
    } else {
      this.params.rows = this.posPage.page.pageSize
        ? this.posPage.page.pageSize
        : 20
      this.params.page = dataTableEvent.offset + 1
    }

    this.listDataService
      .getDataForDataTable(this.params)
      .subscribe((comboData) => {
        if (this.initial) {
          for (let i = 0; i < comboData.terminalOutputDto.length; i++) {
            if (
              this.accounts.indexOf(comboData.terminalOutputDto[i].account) ==
              -1
            ) {
              this.accounts.push(comboData.terminalOutputDto[i].account)
            }

            this.initial = false
          }
        }

        if (comboData && comboData.errorCode != 1) {
          this.posPage.page = comboData.page
          this.posPage.page.pageNumber = this.posPage.page.pageNumber - 1
          this.posPage.data = comboData.terminalOutputDto
          comboData.terminalOutputDto.forEach((item) => {
            item['regionName'] = this.getRegionName(item['region'])
          })
          this.posPage.page.size = this.posPage.page.pageSize
          this.posPage.page.totalElements = comboData.page.totalElements
        }
      })
  }

  getRegionName(values) {
    if (this.regions[values] != undefined) {
      return this.regions[values]
    } else {
      return values
    }
  }

  refreshData() {
    const combosSolicitados = ['terminalRegion']
    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: any = comboData
        //this.cities = data[combosSolicitados.indexOf("cityType")]["values"];
        this.regions =
          data[combosSolicitados.indexOf('terminalRegion')]['values']
        this.setPage({ offset: 0 })
      })
  }

  // Gets the data to fill the dropdown of accounts and cities
  ngOnInit() {
    super.ngOnInit()
    this.initial = true
    this.order = 'accountfrom'
    this.orderType = 'desc'

    const combosSolicitados = ['terminalRegion']
    this.selected = []

    this.refreshData()

    this.subscriptions.push(
      this.translate.onLangChange.subscribe(
        function (event: LangChangeEvent) {
          this.refreshData()
        }.bind(this),
      ),
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  getdetails(selectedrowdata) {
    this.terminalSubscription = this.listDataService
      .getDataForDataTable(selectedrowdata)
      .subscribe((result) => {
        if (
          result.hasOwnProperty('error') &&
          (<any>result).error instanceof Exception
        ) {
          return
        } else {
          this.listDataService.setTerminalDetails(result.terminalOutputDto[0])
        }
        this.terminalSubscription.unsubscribe()
        this.router.navigate(['/posstatement/posterminalDetails'])
      })
  }

  getId(row) {
    return row['terminalId']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }
}
