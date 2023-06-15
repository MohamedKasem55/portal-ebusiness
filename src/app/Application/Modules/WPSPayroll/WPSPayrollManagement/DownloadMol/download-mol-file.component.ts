import { Component, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../../core/storage/storage.service'
import { PagedData } from '../../../../Model/paged-data'
import { DownloadMolFileService } from './download-mol-file.service'

@Component({
  templateUrl: './download-mol-file.component.html',
  styleUrls: ['./download-mol-file.component.scss'],
})
export class DownloadMolFileComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('viewMolFilesTable', { static: true }) table: any

  organizationName: any
  cic: any

  isSearchCollapsed = true

  bsConfig: any
  debitAccountNumbers: object[]

  amountFrom: number
  amountTo: number
  batchName = ''
  customerReference = ''
  debitAccount = ''
  initiateDateFrom = ''
  initiateDateTo = ''
  paymentDateFrom = ''
  paymentDateTo = ''
  systemFileName = ''

  amountFromSearch: number
  amountToSearch: number
  batchNameSearch = ''
  customerReferenceSearch = ''
  debitAccountSearch = ''
  initiateDateFromSearch = ''
  initiateDateToSearch = ''
  paymentDateFromSearch = ''
  paymentDateToSearch = ''
  systemFileNameSearch = ''

  tableSelected = []

  viewMolFilesPage: PagedData<any>
  private order: string
  private orderType: string

  protected isFirstSearch = false

  constructor(
    public translate: TranslateService,
    public service: DownloadMolFileService,
    storageService: StorageService,
  ) {
    super()
    this.viewMolFilesPage = new PagedData<any>()
    this.order = 'initiateDate'
    this.orderType = 'desc'
    this.cic = JSON.parse(storageService.retrieve('currentUser'))['company'][
      'profileNumber'
    ]
    this.organizationName = JSON.parse(storageService.retrieve('currentUser'))[
      'company'
    ]['companyName']
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    //this.viewProcessedFilesPage.data = ;
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
    this.isFirstSearch = false
    this.setPage(null)
  }
  canShowSelectPlaceHolder(field) {
    if (field == null) {
      return true
    }
  }
  copyToSearch() {
    this.amountFromSearch = this.amountFrom
    this.amountToSearch = this.amountTo
    this.batchNameSearch = this.batchName
    this.customerReferenceSearch = this.customerReference
    this.debitAccountSearch = this.debitAccount

    this.initiateDateFromSearch = this.initiateDateFrom
    this.initiateDateToSearch = this.initiateDateTo
    this.paymentDateFromSearch = this.paymentDateFrom
    this.paymentDateToSearch = this.paymentDateTo
    this.systemFileNameSearch = this.systemFileName
  }

  reset() {
    this.isFirstSearch = false
    this.amountFrom = null
    this.amountTo = null
    this.batchName = ''
    this.customerReference = ''
    this.debitAccount = ''
    this.initiateDateFrom = ''
    this.initiateDateTo = ''
    this.paymentDateFrom = ''
    this.paymentDateTo = ''
    this.systemFileName = ''
    this.searchProcessedFiles()
  }

  searchProcessedFiles(): void {
    this.copyToSearch()
    this.setPage(null)
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    this.service
      .getDataTableResults(
        this.isFirstSearch,
        dataTableEvent.offset + 1,
        this.viewMolFilesPage.page.pageSize,
        this.amountFromSearch,
        this.amountToSearch,
        this.batchNameSearch,
        this.customerReferenceSearch,
        this.debitAccountSearch,
        this.initiateDateFromSearch,
        this.initiateDateToSearch,
        this.paymentDateFromSearch,
        this.paymentDateToSearch,
        this.systemFileNameSearch,
      )
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.debitAccountNumbers = result['accountList']
          this.viewMolFilesPage = result
          this.isFirstSearch = false
        }
      })
  }

  setSort(dataTableEvent) {}

  onError(result) {}

  downloadFile(data) {
    const subscription = this.service
      .downloadFile(data)
      .subscribe((response) => {
        subscription.unsubscribe()
        if (response === null) {
        } else {
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(response, data.fileName)
          } else {
            const downloadUrl = URL.createObjectURL(response)
            const link = document.createElement('a')
            link.download = data.fileName
            link.href = downloadUrl
            document.body.appendChild(link)
            link.click()
          }
        }
      })
  }

  downloadAllFile() {
    const files = []
    for (let i = 0; i < this.tableSelected.length; ++i) {
      files.push(this.tableSelected[i].fileName)
    }
    const subscription = this.service
      .downloadAllFile(files)
      .subscribe((response) => {
        subscription.unsubscribe()
        if (response === null) {
        } else {
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(response, 'molFile.zip')
          } else {
            const downloadUrl = URL.createObjectURL(response)
            const link = document.createElement('a')
            link.download = 'molFile.zip'
            link.href = downloadUrl
            document.body.appendChild(link)
            link.click()
          }
        }
      })
  }

  onSelect({ selected }) {
    this.tableSelected = []
    this.tableSelected.splice(0, selected.length)
    this.tableSelected.push(...selected)
    return this.tableSelected
  }

  getId(row) {
    return row['fileName']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }
}
