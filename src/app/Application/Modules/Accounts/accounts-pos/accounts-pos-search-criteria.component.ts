import { Location } from '@angular/common'
import { Component, OnInit, ViewChild } from '@angular/core'
// Form
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
// MODELO Cuentas
import { TranslateService } from '@ngx-translate/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { PagedData } from '../../../Model/paged-data'
//MODELO VISUALIZACION TABLA
import { AccountsPosTerminalList } from '../Model/accounts-pos-terminal-list'
// SERVICIO FORMULARIO
import { AccountFormData } from '../Services/accounts-form-data.service'
import { AccountsList } from '../Services/accounts-list-data.service'
import { SelectedDataService } from '../Services/selected-data-service'
import { AccountsPosSearchCriteriaRequest } from './accounts-pos-search-criteria.service'
import { AccountsPosSearchPanelRequest } from './accounts-pos-search-panel.service'

@Component({
  templateUrl: './accounts-pos-search-criteria.component.html',
  styles: [
    `
      .head {
        margin-top: 15px;
        margin-bottom: 15px;
        padding: 15px, 0, 15px, 0;
      }
      .modal-body {
        position: relative;
        padding: 0px 30px;
        text-align: center;
      }
      .btn {
        padding: 10px 10px;
        font-size: 11px;
        line-height: 11px;
        border-radius: 2px;
      }
      .sme-checkbox.checkbox-inline,
      .sme-checkbox.radio-inline,
      .sme-checkbox label,
      .sme-radio.checkbox-inline,
      .sme-radio.radio-inline,
      .sme-radio label {
        padding-left: 22px;
        min-height: 22px;
        min-width: 22px;
        color: #595e72;
        letter-spacing: 0;
        font-size: 12px;
      }
      .bs-datepicker {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: stretch;
        -ms-flex-align: stretch;
        align-items: stretch;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-flow: row wrap;
        flex-flow: row wrap;
        background: #fff;
        box-shadow: 0 0 10px 0 #aaa;
        position: relative;
        z-index: 1;
      }
      .input-group-addon {
        padding: 6px 12px;
        font-size: 14px;
        font-weight: normal;
        line-height: 1;
        color: #555555;
        text-align: center;
        background-color: #ffffff !important;
        border: 1px solid #ffffff;
        border-radius: 0;
      }
    `,
  ],
})
export class AccountsPosSearchCriteria
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('requestSubmittedModal')
  public requestSubmittedModal: ModalDirective
  @ViewChild('accountsPosSearchPanelTable', { static: true }) table: any
  order: string
  orderType: string

  //trae el modelo
  posPage: PagedData<AccountsPosTerminalList>
  datepickerModel: Date
  form: FormGroup = new FormGroup({})
  model: any
  isSearchCollapsed = true
  terminalID: string
  terminalName: string
  posTable: any
  tableAll: any
  params: any = []
  mostrar: string
  terminalIds
  peroIds
  dateto
  dateFromSTR
  dateToSTR
  bsConfig
  pageSize: number
  selected: any[] = []
  selectedback
  dateTo = null
  datefrom = null
  to: any
  minimato: any

  constructor(
    public listDataService: AccountsPosSearchCriteriaRequest,
    public servicePosSearchPanelRequest: AccountsPosSearchPanelRequest,
    public serviceFormData: AccountFormData,
    public serviceAccountList: AccountsList,
    public formBuilder: FormBuilder,
    public _location: Location,
    public router: Router,
    public translate: TranslateService,
    public sentDataservice: SelectedDataService,
  ) {
    super()
    this.posPage = new PagedData<AccountsPosTerminalList>()
    //this.posTable ;
    this.order = 'requestDate'
    this.orderType = 'desc'

    this.bsConfig = Object.assign(
      {},
      { showWeekNumbers: false, containerClass: 'theme-dark-blue' },
    )
    this.model = {
      terminalID: '',
      datefrom: '',
    }
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  setPage(data) {
    const values = this.posTable
    this.posTable = []
    this.posTable = values
  }

  reset() {
    this.model = {
      terminalID: '',
      datefrom: null,
      dateTo: null,
      peroIds: null,
    }
    const dateaux = new Date()
    this.dateFromSTR =
      (dateaux.getFullYear() - 1).toString() +
      '-' +
      (dateaux.getMonth() + 1).toString() +
      '-' +
      dateaux.getDate().toString() +
      ''
    this.dateToSTR =
      dateaux.getFullYear().toString() +
      '-' +
      (dateaux.getMonth() + 1).toString() +
      '-' +
      dateaux.getDate().toString() +
      ''
    this.filtered(this.model)
  }

  filtered(form: any) {
    const arrterminalid = []

    if (form.datefrom && typeof form.datefrom == 'object') {
      this.dateFromSTR =
        form.datefrom.getFullYear().toString() +
        '-' +
        (form.datefrom.getMonth() + 1).toString() +
        '-' +
        form.datefrom.getDate().toString() +
        '' //"T00:00:00.828Z";
    }

    if (form.dateTo && typeof form.dateTo == 'object') {
      this.dateToSTR =
        form.dateTo.getFullYear().toString() +
        '-' +
        (form.dateTo.getMonth() + 1).toString() +
        '-' +
        form.dateTo.getDate().toString() +
        '' //T00:00:00.828Z";
    }
    if (form.terminalId && form.terminalId.length > 0) {
      for (let i = this.selectedback.length - 1; i >= 0; i--) {
        if (form.terminalId == this.selectedback[i].terminalId) {
          arrterminalid.push(this.selectedback[i])
          break
        }
      }
    } else {
      arrterminalid.push(...this.selectedback)
    }
    this.tableAll = []

    form.peroIds = this.model.period == null ? 'D' : [this.model.period]

    this.listDataService
      .getDatacriteria(
        arrterminalid,
        form.peroIds != undefined && form.peroIds != null
          ? form.peroIds
          : this.peroIds,
        this.dateFromSTR,
        this.dateToSTR,
        this.sentDataservice.allTerminalsSearch,
      )
      .subscribe((comboData) => {
        const data: any[] = comboData
        for (let i = data.length - 1; i >= 0; i--) {
          this.tableAll = this.tableAll.concat(data[i].fileList)
          this.posTable.size = this.posTable.size + data[i].size
          this.posTable.total = this.posTable.total + data[i].total
        }
        this.posTable.data = this.tableAll
      })
  }

  ngOnInit() {
    super.ngOnInit()
    this.bsConfig = Object.assign(
      {},
      { showWeekNumbers: false, containerClass: 'theme-dark-blue' },
    )

    this.peroIds = ['Daily', 'Weekly', 'Monthly']

    this.dateto = ''
    this.posTable = []
    this.tableAll = []
    this.dateTo = ''
    this.datefrom = ''
    this.pageSize = 0
    this.selected = []
    this.terminalIds = []
    const dateaux = new Date()
    this.selectedback = this.sentDataservice.getData()

    this.dateFromSTR =
      (dateaux.getFullYear() - 1).toString() +
      '-' +
      (dateaux.getMonth() + 1).toString() +
      '-' +
      dateaux.getDate().toString() +
      ''
    this.dateToSTR =
      dateaux.getFullYear().toString() +
      '-' +
      (dateaux.getMonth() + 1).toString() +
      '-' +
      dateaux.getDate().toString() +
      ''
    if (this.selectedback) {
      for (let x = 0; x < this.selectedback.length; x++) {
        if (this.terminalIds.indexOf(this.selectedback[x].terminalId) == -1) {
          this.terminalIds.push(this.selectedback[x].terminalId)
        }
      }
    }

    this.posTable.size = 0
    this.posTable.total = 0

    this.listDataService
      .getDatacriteria(
        this.selectedback,
        this.peroIds,
        this.dateFromSTR,
        this.dateToSTR,
        this.sentDataservice.allTerminalsSearch,
      )
      .subscribe((comboData) => {
        const data: any[] = comboData
        for (let i = data.length - 1; i >= 0; i--) {
          this.tableAll = this.tableAll.concat(data[i].fileList)
          this.posTable.size = this.posTable.size + data[i].size
          this.posTable.total = this.posTable.total + data[i].total
        }
        this.posTable.data = this.tableAll
      })
  }

  download(fileName: string): void {
    const fileToDownload = (this.posTable.data as any[]).filter(
      (f) => f.fileName === fileName,
    )[0]

    const payload = {
      file: {
        batchName: fileToDownload.batchName,
        dataReceived: fileToDownload.dataReceived,
        dirUploadArchive: true,
        fileName: fileToDownload.fileName,
        fileSize: fileToDownload.fileSize,
        userFileName: fileToDownload.userFileName,
      },
      periodStr: 'D',
    }

    const requests: Promise<any>[] = []
    requests.push(this.listDataService.singleDowload(payload).toPromise())
    payload.periodStr = 'M'
    requests.push(this.listDataService.singleDowload(payload).toPromise())
    payload.periodStr = 'W'
    requests.push(this.listDataService.singleDowload(payload).toPromise())

    Promise.all(requests).then((resp) => {
      for (const r of resp) {
        this.handleDownload(r, payload.file.fileName)
      }
    })
  }

  multipleflies($event) {
    //console.log('DOWNLOADD FILES....');
    const pass = {
      downloadFiles: this.selected,
      periodStr: 'D',
    }
    this.listDataService.multipleDowload(pass).subscribe((response) => {
      if (response === null) {
      } else {
        const blobObject = response
        if (window.navigator.msSaveOrOpenBlob) {
          //console.log('multipleflies IEXPORER');
          window.navigator.msSaveOrOpenBlob(blobObject, 'archives.zip')
        } else {
          //console.log('DOWNLOADD FILES....')
          const downloadUrl = URL.createObjectURL(response)
          const link = document.createElement('a')
          link.download = 'archives.zip'
          link.href = downloadUrl
          // this.servicePosSearchPanelRequest.tableSelectedRows = [];
          document.body.appendChild(link)
          link.click()
        }
      }
    })
  }

  public setSort(event) {}

  onSelect({ selected }) {
    //console.log('Select Event', selected, this.tableSelectedRows);
    this.selected.splice(0, this.selected.length)
    this.selected.push(...selected)
  }

  private handleDownload(response, fileName) {
    let reader = new FileReader()
    reader.onload = function () {
      if (reader.result.toString().indexOf('errorCode') === -1) {
        const downloadUrl = URL.createObjectURL(response)
        const link = document.createElement('a')
        link.download = fileName
        link.href = downloadUrl
        document.body.appendChild(link)
        link.click()
      }
    }

    reader.readAsText(response)
  }
}
