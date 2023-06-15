import { Location } from '@angular/common'
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
// Form
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { Subscription } from 'rxjs'
//MODELO VISUALIZACION TABLA
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
import { StaticService } from '../../Common/Services/static.service'
import { AccountsPosTerminalList } from '../accounts-pos-terminal-list.model'
// SERVICIO FORMULARIO
// MODELO Cuentas
import { PoSStatementService } from '../pos-statement.service'
import { FormDataService } from '../shared-form-data.service'

@Component({
  templateUrl: './accounts-pos-search-panel.component.html',
})
export class AccountsPosSearchPanel
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('requestSubmittedModal', { static: true })
  public requestSubmittedModal: ModalDirective
  @ViewChild('accountsPosSearchPanelTable', { static: true }) table: any

  order: string
  orderType: string

  //trae el modelo
  posPage: PagedData<AccountsPosTerminalList>

  jobGroup: FormGroup = new FormGroup({})
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

  subscriptions: Subscription[] = []

  constructor(
    public listDataService: PoSStatementService,
    public formBuilder: FormBuilder,
    public _location: Location,
    public router: Router,
    public translate: TranslateService,
    public staticService: StaticService,
    public sentDataservice: FormDataService,
  ) {
    super()
    // Definimos el objeto model, vació inicialmente para la validación de los campos (necesario)
    this.posPage = new PagedData<AccountsPosTerminalList>()
    const page = new Page()
    page.pageNumber = 0
    page.pageSize = 10
    this.posPage.page = page

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

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
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

  // Create a new POS Statement
  public createNewPosSearch(any): void {
    this.params = {
      accountNumber: '',
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

  setPage(dataTableEvent?) {
    //console.log("entro al set page")
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    if (this.params.length == 0) {
      this.params = {
        page: 1,
        rows: 20,
        order: '',
        orderType: '',
      }
    }

    this.listDataService
      .getDataForDataTable(this.params)
      .subscribe((comboData) => {
        const data: any = comboData

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

        if (comboData.errorCode != 1) {
          this.posPage.page = comboData.page
          this.posPage.data = comboData.terminalOutputDto
        }
      })
  }

  setSort(dataTableEvent) {
    if (dataTableEvent.sorts[0]) {
      this.order = dataTableEvent.sorts[0].prop
      this.orderType = dataTableEvent.sorts[0].dir
    }

    this.posPage.page.pageNumber = 1
    this.loading = true

    // Service Call with new short
    this.listDataService
      .getDataForDataTable(this.params)
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.loading = false
          this.posPage = result
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

  onError(result) {}

  refreshData() {
    const combosSolicitados = ['terminalRegion']
    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: any = comboData
        //this.cities = data[combosSolicitados.indexOf("cityType")]["values"];
        this.regions =
          data[combosSolicitados.indexOf('terminalRegion')]['values']
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
    //this.posPage.page.pageNumber=1

    // Llamada al servio post con los datos del formulario en un json
    // Se espera a la respuesta y se muestra la modal de OK el envío.
    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: any = comboData
        //this.cities = data[combosSolicitados.indexOf("cityType")]["values"];
        this.regions =
          data[combosSolicitados.indexOf('terminalRegion')]['values']
      })

    this.subscriptions.push(
      this.translate.onLangChange.subscribe(
        function (event: LangChangeEvent) {
          this.refreshData()
        }.bind(this),
      ),
    )
    this.setPage({ offset: 0 })
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  sentData() {
    this.sentDataservice.setData(this.selected)
  }

  onSelect({ selected }) {
    //console.log('Select Event', selected, this.tableSelectedRows);
    this.selected.splice(0, this.selected.length)
    this.selected.push(...selected)
  }
}
