import { Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'
import { StaticService } from '../../../Common/Services/static.service'
import { LokbxstatementService } from './lokbxstatement.service'

@Component({
  selector: 'app-lokbxstatement',
  templateUrl: './lokbxstatement.component.html',
  styleUrls: ['./lokbxstatement.component.scss'],
})
export class LokbxstatementComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('table', { static: true }) table: any

  filter: FormGroup
  combosSolicitados: string[] = ['hajjCardsStatusFilter']
  bsConfig: any
  isSearchCollapsed = false
  isCollapsed = true
  tableSelected = []
  selected
  show = 'list'
  searchlistPage

  terminalsComboList: any
  terminalStatementsList
  viewProcessedFilesPage: PagedData<any>
  request
  requestData = []
  institution
  lokbxterminalId

  constructor(
    public translate: TranslateService,
    private formBuilder: FormBuilder,
    public lockboxstatmentservice: LokbxstatementService,
    public cardinquiresservice: LokbxstatementService,
    public staticService: StaticService,
    public storageService: StorageService,
  ) {
    super()
    this.searchlistPage = new PagedData<any>()
    this.searchlistPage.data = []
    const page = new Page()
    page.pageNumber = 0
    page.pageSize = 10
    this.searchlistPage.page = page
    this.institution = JSON.parse(this.storageService.retrieve('currentUser'))[
      'company'
    ]['institution']
  }

  ngOnInit() {
    super.ngOnInit()
    this.getTerminalsComboListData()
    this.searchListOfStatementData()
  }

  clearValue() {
    this.requestData = []
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.table) {
      tablas.push(this.table)
    }
    return tablas
  }

  onSelect({ selected }) {
    //console.log('Select Event', selected, this.tableSelectedRows);
    this.selected.splice(0, this.selected.length)
    this.selected.push(...selected)
  }

  getTerminalsComboListData() {
    this.lockboxstatmentservice.getTerminalslist().subscribe(
      (data) => {
        this.terminalsComboList = data.terminalList
        if (this.terminalsComboList && this.terminalsComboList.length > 0) {
          this.lokbxterminalId = this.terminalsComboList[0].serialNumber
          this.searchListOfStatementData()
        }
      },
      (err) => {
        //console.log(err);
      },
    )
  }

  searchListOfStatementData() {
    if (!this.lokbxterminalId) {
      this.searchlistPage.data = []
      this.searchlistPage.page.size = 0
      this.searchlistPage.page.totalElements = 0
      this.searchlistPage.page.pageSize = 20
      this.searchlistPage.size = 0
      this.searchlistPage.total = 0
      this.selected = []
      return
    }
    this.request = {
      page: this.searchlistPage.page.pageNumber
        ? this.searchlistPage.page.pageNumber
        : 1,
      rows: this.searchlistPage.page.pageSize
        ? this.searchlistPage.page.pageSize
        : 20,
      serialNumber: this.lokbxterminalId != '' ? this.lokbxterminalId : null,
      order: 'transactionDate',
      orderType: 'ASC',
    }
    this.lockboxstatmentservice.listStatementData(this.request).subscribe(
      (data) => {
        if (data) {
          this.searchlistPage.data = []
          this.searchlistPage.data = data.statement.items
          this.searchlistPage.page.size = data.statement.size
          this.searchlistPage.page.totalElements = data.statement.total
        }
      },
      (err) => {
        //console.log(err);
      },
    )
  }

  downloadStatement() {
    if (this.lokbxterminalId) {
      this.request = {
        page: 1,
        rows: 100,
        serialNumber: this.lokbxterminalId,
        order: 'transactionDate',
        orderType: 'ASC',
      }
      //this.request.rows = 20;
      this.lockboxstatmentservice.getFileDetail(this.request).subscribe(
        (response) => {
          if (response === null) {
          } else {
            const blobObject = response
            if (window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(
                blobObject,
                'lockboxstatements.xls',
              )
            } else {
              const downloadUrl = URL.createObjectURL(blobObject)
              const link = document.createElement('a')
              link.download = 'lockboxstatements.xls'
              link.href = downloadUrl
              document.body.appendChild(link)
              link.click()
            }
          }
        },
        (err) => {
          //console.log(err);
        },
      )
    }
  }

  reset() {
    this.lokbxterminalId = null
    this.searchListOfStatementData()
  }

  convert(str) {
    //console.log(str);
    if (str) {
      //console.log(str, "str");
      const date = new Date(str)
      const mnth = ('0' + (date.getMonth() + 1)).slice(-2)
      const day = ('0' + date.getDate()).slice(-2)
      return [date.getFullYear(), mnth, day].join('-')
    } else {
      //console.log("else");
      return ''
    }
  }

  setPage(dataTableEvent) {
    this.request = {
      serialNumber: this.lokbxterminalId,
      order: 'transactionDate',
      orderType: 'ASC',
    }

    this.request.rows = this.searchlistPage.page.pageSize
    this.request.page = 1
    this.lockboxstatmentservice.listStatementData(this.request).subscribe(
      (data) => {
        this.searchlistPage.data = []
        this.searchlistPage.data = data.statement.items
        this.searchlistPage.page.size = data.statement.size
        this.searchlistPage.page.totalElements = data.statement.total
      },
      (err) => {
        //console.log(err);
      },
    )
  }
}
