import { Component, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { AuthenticationService } from '../../../../core/security/authentication.service'
import { StorageService } from '../../../../core/storage/storage.service'
import { PagedData } from '../../../Model/paged-data'
// General service to optain static data
import { ViewProcessedFilesService } from './view-processed-files-service'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { interval } from 'rxjs'

@UntilDestroy()
@Component({
  selector: 'app-view-processed-files',
  templateUrl: './view-processed-files.component.html',
  styleUrls: ['./view-processed-files.component.scss'],
})
export class ViewProcessedFilesComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('viewProcessedFilesTable') table: any
  @ViewChild('authorization') authorization: any
  @ViewChild('viewFileDetail') viewFileDetail: any

  cic: any
  rowDetail: any
  fileType: string

  viewProcessedFilesPage: PagedData<any>
  viewProcessedFilesGetFiles: PagedData<any>
  accountFrom: any
  viewFileDetails: any
  finishResult = {}

  private order: string
  private orderType: string

  bsConfig: any

  fileTypes: string[] = []

  amountFrom: number
  amountTo: number
  batchName = ''
  customerReference = ''
  debitAccount = ''
  initiationDateFrom = ''
  initiationDateTo = ''
  paymentDateFrom = ''
  paymentDateTo = ''
  systemFileName = ''

  amountFromSearch: number
  amountToSearch: number
  batchNameSearch = ''
  customerReferenceSearch = ''
  initiationDateFromSearch = ''
  initiationDateToSearch = ''
  paymentDateFromSearch = ''
  paymentDateToSearch = ''
  systemFileNameSearch = ''

  tableSelected = []
  tableSelectedGetFiles = []

  step = 'list'
  currentFileDetail: any

  generateChallengeAndOTP = new ResponseGenerateChallenge()
  requestValidate = new RequestValidate()

  isSearchCollapsed = true
  currentRow: any

  today = new Date()
  sizePage = 20

  constructor(
    public authenticationService: AuthenticationService,
    public translate: TranslateService,
    public service: ViewProcessedFilesService,
    public storageService: StorageService,
  ) {
    super()
    this.cic = JSON.parse(storageService.retrieve('currentUser'))['company'][
      'profileNumber'
    ]
    this.viewProcessedFilesPage = new PagedData<any>()
    this.viewProcessedFilesGetFiles = new PagedData<any>()
    this.order = 'requestDate'
    this.orderType = 'desc'
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.table) {
      tablas.push(this.table)
    }
    if (this.viewFileDetail) {
      tablas.push(this.viewFileDetail)
    }
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    interval(1000).pipe(untilDestroyed(this)).subscribe()
    this.isSearchCollapsed = true
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )

    // Get static data
    const combosSolicitados = ['payrollFileType']

    this.service.getStaticData(combosSolicitados).subscribe((comboData) => {
      const data: Object = comboData
      this.fileTypes =
        data[combosSolicitados.indexOf('payrollFileType')]['values']
      //console.log(this.fileTypes);
    })

    this.setPage(null)
  }

  returnList(): void {
    this.step = 'list'
  }

  copyToSearch() {
    this.amountFromSearch = this.amountFrom
    this.amountToSearch = this.amountTo
    this.batchNameSearch = this.batchName
    this.customerReferenceSearch = this.customerReference
    this.initiationDateFromSearch = this.initiationDateFrom
    this.initiationDateToSearch = this.initiationDateTo
    this.paymentDateFromSearch = this.paymentDateFrom
    this.paymentDateToSearch = this.paymentDateTo
    this.systemFileNameSearch = this.systemFileName
  }

  reset() {
    this.amountFrom = null
    this.amountTo = null
    this.batchName = ''
    this.customerReference = ''
    this.debitAccount = ''
    this.initiationDateFrom = ''
    this.initiationDateTo = ''
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

    // Service Call
    this.service
      .processedFiles(
        dataTableEvent.offset + 1,
        this.viewProcessedFilesPage &&
          this.viewProcessedFilesPage.page &&
          this.viewProcessedFilesPage.page.pageSize
          ? this.viewProcessedFilesPage.page.pageSize
          : 50,
        this.amountFromSearch,
        this.amountToSearch,
        this.batchNameSearch,
        this.customerReferenceSearch,
        null,
        null,
        this.initiationDateFromSearch,
        this.initiationDateToSearch,
        this.paymentDateFromSearch,
        this.paymentDateToSearch,
        this.systemFileNameSearch,
        null,
      )
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.viewProcessedFilesPage = result.page
          this.accountFrom = result.accountFrom
        }
      })
  }

  setSort(dataTableEvent) {}

  goToDetails(file) {
    this.rowDetail = null
    this.fileType = ''
    this.fileType = file.fileType
    this.getFileDetails(file)
  }

  getFileDetails(file) {
    //console.log(type);
    this.currentFileDetail = file
    this.requestValidate = new RequestValidate()

    this.service.getFileDetail(file).subscribe((result) => {
      if (result === null) {
        this.onError(result)
      } else {
        this.step = 'detail'
        this.generateChallengeAndOTP = result.generateChallengeAndOTP
        this.viewFileDetails = result
        //console.log(this.viewFileDetails);
      }
    })
  }

  onError(result) {}

  toggleExpandRow(row) {
    this.table.rowDetail.collapseAllRows()
    this.currentRow = row
    // Service Call
    this.service.relatedProcessedFile(row.fileName).subscribe((result) => {
      if (result === null) {
        this.onError(result)
      } else {
        this.viewProcessedFilesGetFiles = result
        if (this.rowDetail != row) {
          this.table.rowDetail.toggleExpandRow(row)
          this.rowDetail = row
        } else {
          this.rowDetail = null
        }
      }
    })
  }

  toggleExpandRowMobile(row) {
    const data = row
    // Service Call
    this.currentRow = row
    this.service.relatedProcessedFile(row.fileName).subscribe((result) => {
      if (result === null) {
        this.onError(result)
      } else {
        this.viewProcessedFilesGetFiles = result
        if (this.rowDetail != row) {
          this.rowDetail = row
        } else {
          this.rowDetail = null
        }
      }
    })
  }

  cancelFile() {
    this.service.delete(this.currentFileDetail).subscribe((result) => {
      if (result === null) {
        this.onError(result)
      } else {
        this.finishResult = result
        this.step = 'finish'
      }
    })
  }

  valid(): boolean {
    if (this.authorization) {
      return this.authorization.valid()
    } else {
      return true
    }
  }

  allowCancel() {
    const allow = true
    if (this.currentFileDetail['type'] != 's') {
      return allow
    }
    return this.step == 'detail' && allow
  }

  downloadFile() {
    const subscription = this.service
      .downloadFile(
        this.currentFileDetail,
        this.viewFileDetails['fileFormat'],
        this.fileType,
      )
      .subscribe((response) => {
        subscription.unsubscribe()

        if (response === null) {
        } else {
          const blobObject = response
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(
              blobObject,
              this.currentFileDetail['fileName'],
            )
          } else {
            const downloadUrl = URL.createObjectURL(blobObject)
            const link = document.createElement('a')
            link.download = this.currentFileDetail['fileName']
            link.href = downloadUrl
            document.body.appendChild(link)
            link.click()
          }
        }
      })
  }

  pad(valor, char, size) {
    let str = valor
    while (str.length < size) {
      str = char + str
    }
    return str
  }
}
