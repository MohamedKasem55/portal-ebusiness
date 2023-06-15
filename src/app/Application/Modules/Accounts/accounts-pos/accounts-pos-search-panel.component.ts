import { Location } from '@angular/common'
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
// Form
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
//MODELO VISUALIZACION TABLA
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
import { StaticService } from '../../Common/Services/static.service'
import { AccountsPosTerminalList } from '../Model/accounts-pos-terminal-list'
// SERVICIO FORMULARIO
import { AccountFormData } from '../Services/accounts-form-data.service'
// MODELO Cuentas
import { AccountsList } from '../Services/accounts-list-data.service'
import { SelectedDataService } from '../Services/selected-data-service'
import { AccountsPosSearchPanelRequest } from './accounts-pos-search-panel.service'

@Component({
  templateUrl: './accounts-pos-search-panel.component.html',
})
export class AccountsPosSearchPanel
  extends DatatableMobileComponent
  implements OnInit, OnDestroy {
  @ViewChild('requestSubmittedModal')
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

  selectAllOnPage: any = []

  constructor(
    public listDataService: AccountsPosSearchPanelRequest,
    public serviceFormData: AccountFormData,
    public serviceAccountList: AccountsList,
    public formBuilder: FormBuilder,
    public _location: Location,
    public router: Router,
    public translate: TranslateService,
    public staticService: StaticService,
    public sentDataservice: SelectedDataService,
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
      this.city = cityCode
    }
  }

  onChangeAccount(codeaccount: string): void {
    this.account = codeaccount
  }

  onChangeRegion(regionCode: string): void {
    this.region = regionCode
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
    this.listDataService.tableSelectedRows = []
    this.selected = []

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
            comboData.terminalOutputDto[i]['_city'] =
              comboData.terminalOutputDto[i]['city']
          }
          this.accounts = comboData.accountListPos
          this.initial = false
        }
        if (comboData && comboData.errorCode != 1) {
          this.posPage.page = comboData.page
          this.posPage.page.pageNumber = this.posPage.page.pageNumber - 1
          this.posPage.data = comboData.terminalOutputDto
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
        const data: Object = comboData
        //this.cities = data[combosSolicitados.indexOf("cityType")]["values"];
        this.regions =
          data[combosSolicitados.indexOf('terminalRegion')]['values']
      })
  }
  canShowSelectPlaceHolder(field) {
    if (field == null) {
      return true
    }
  }
  // Gets the data to fill the dropdown of accounts and cities
  ngOnInit() {
    super.ngOnInit()
    this.initial = true
    this.order = 'accountfrom'
    this.orderType = 'desc'

    const combosSolicitados = ['terminalRegion']

    if (
      typeof this.listDataService.tableSelectedRows != 'undefined' &&
      this.listDataService.tableSelectedRows.length > 0
    ) {
      this.selected = this.listDataService.tableSelectedRows
    } else {
      this.selected = []
    }

    // Llamada al servio post con los datos del formulario en un json
    // Se espera a la respuesta y se muestra la modal de OK el envío.
    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: Object = comboData
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

  sentData(allTerminals: boolean) {
    this.sentDataservice.allTerminalsSearch = allTerminals
    this.sentDataservice.setData(this.selected)
  }

  // onSelect({ selected }) {
  //   this.selected.splice(0, this.selected.length);
  //   this.selected.push(...selected);
  // }

  onSelect({ selected }) {
    // Make sure we are no longer selecting all

    this.selectAllOnPage[this.posPage.page.pageNumber] = false

    this.selected.splice(0, this.selected.length)
    this.selected.push(...selected)
    this.listDataService.tableSelectedRows = this.selected
  }

  selectAll(event) {
    if (!this.selectAllOnPage[this.posPage.page.pageNumber]) {
      // Unselect all so we dont get duplicates.
      if (this.selected.length > 0) {
        this.posPage.data.map((bill) => {
          this.selected = this.selected.filter(
            (selected) => this.getId(selected) !== this.getId(bill),
          )
        })
      }
      // Select all again
      this.selected.push(...this.posPage.data)
      this.selectAllOnPage[this.posPage.page.pageNumber] = true
      // console.log('-----------Select All----');
      // console.log(this.tableSelected);
    } else {
      // Unselect all
      this.posPage.data.map((bill) => {
        this.selected = this.selected.filter(
          (selected) => this.getId(selected) !== this.getId(bill),
        )
      })
      this.selectAllOnPage[this.posPage.page.pageNumber] = false
      // console.log('-----------UnSelect All');
      // console.log(this.tableSelected)
    }
    this.listDataService.tableSelectedRows = this.selected
    //   //console.log('Select Event', selected, this.tableSelected);
  }

  getId(row) {
    return row['terminalId']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }
}
