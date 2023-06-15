import { Component, OnInit, ViewChild } from '@angular/core'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { StorageService } from '../../../../../core/storage/storage.service'
import { PagedData } from '../../../../Model/paged-data'
// General service to optain static data
import { ViewProcessedFilesService } from './view-processed-files-service'

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
  @ViewChild('filesGetFiles') filesGetFiles: any
  @ViewChild('viewFileDetail') viewFileDetail: any
  @ViewChild('getFilesModal', { static: true }) getFilesModal: ModalDirective
  @ViewChild('authorization') authorization: any
  subcriptions: Subject<boolean> = new Subject<boolean>()

  ImgeData: any
  sizePage = 10
  cic: any
  customerName: any
  rowDetail: any

  viewProcessedFilesPage: PagedData<any>
  viewFileDetails: any
  viewProcessedFilesGetFiles: PagedData<any>
  salaryFileDetails: any
  detailsFile: any
  finishResult = {}

  private order: string
  private orderType: string

  objectKeys = Object.keys
  bsConfig: any

  debitAccountNumbers: object[]
  fileTypes: string[] = []
  purpose: string[] = []

  amountFrom: number
  amountTo: number
  batchName = ''
  customerReference = ''
  debitAccount = ''
  fileType = ''
  initiationDateFrom = ''
  initiationDateTo = ''
  paymentDateFrom = ''
  paymentDateTo = ''
  systemFileName = ''
  paymentPurpose = ''

  amountFromSearch: number
  amountToSearch: number
  batchNameSearch = ''
  customerReferenceSearch = ''
  debitAccountSearch = ''
  fileTypeSearch = ''
  initiationDateFromSearch = ''
  initiationDateToSearch = ''
  paymentDateFromSearch = ''
  paymentDateToSearch = ''
  systemFileNameSearch = ''
  paymentPurposeSearch = ''

  propous: any = []
  tableSelected = []
  tableSelectedGetFiles = []

  modalMostrada = false
  step = 'list'
  currentFileDetail = ''

  generateChallengeAndOTP = new ResponseGenerateChallenge()
  requestValidate = new RequestValidate()

  isSearchCollapsed = true

  today = new Date()

  constructor(
    public authenticationService: AuthenticationService,
    public viewProcessedFiles: ViewProcessedFilesService,
    public storageService: StorageService,
    public translate: TranslateService,
  ) {
    super()
    this.cic = JSON.parse(storageService.retrieve('currentUser'))['company'][
      'profileNumber'
    ]
    this.customerName = JSON.parse(storageService.retrieve('currentUser'))[
      'company'
    ]['companyName']
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
    if (this.filesGetFiles) {
      tablas.push(this.filesGetFiles)
    }
    if (this.viewFileDetail) {
      tablas.push(this.viewFileDetail)
    }
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    this.isSearchCollapsed = true
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

    this.refreshCombos()
    this.translate.onLangChange
      .pipe(takeUntil(this.subcriptions))
      .subscribe((event: LangChangeEvent) => {
        this.refreshCombos()
      })
    // Get all company accounts
    this.viewProcessedFiles.getAccounts().subscribe((result) => {
      this.debitAccountNumbers = result
    })

    this.setPage(null)
    //this.getAllFilesModal(null);
  }

  refreshCombos() {
    // Get static data
    const combosSolicitados = ['payrollFileType', 'payrollPaymentPurpose']

    this.viewProcessedFiles
      .getStaticData(combosSolicitados)
      .subscribe((comboData) => {
        const data: Object = comboData
        this.fileTypes =
          data[combosSolicitados.indexOf('payrollFileType')]['values']
        //console.log(this.fileTypes);
        const propuoses =
          data[combosSolicitados.indexOf('payrollPaymentPurpose')]['values']
        this.propous = []
        Object.keys(propuoses).map((key, index) => {
          this.propous.push({ key, value: propuoses[key] })
        })
        this.purpose = propuoses
      })
  }

  returnList(): void {
    this.setPage(null)
    this.step = 'list'
  }

  copyToSearch() {
    this.amountFromSearch = this.amountFrom
    this.amountToSearch = this.amountTo
    this.batchNameSearch = this.batchName
    this.customerReferenceSearch = this.customerReference
    this.debitAccountSearch = this.debitAccount
    this.fileTypeSearch = this.fileType
    this.initiationDateFromSearch = this.initiationDateFrom
    this.initiationDateToSearch = this.initiationDateTo
    this.paymentDateFromSearch = this.paymentDateFrom
    this.paymentDateToSearch = this.paymentDateTo
    this.systemFileNameSearch = this.systemFileName
    this.paymentPurposeSearch = this.paymentPurpose
  }

  reset() {
    this.amountFrom = null
    this.amountTo = null
    this.batchName = ''
    this.customerReference = ''
    this.debitAccount = ''
    this.fileType = ''
    this.initiationDateFrom = ''
    this.initiationDateTo = ''
    this.paymentDateFrom = ''
    this.paymentDateTo = ''
    this.systemFileName = ''
    this.paymentPurpose = ''

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
    this.viewProcessedFiles
      .getDataTableResults(
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
        this.debitAccountSearch,
        this.fileTypeSearch,
        this.initiationDateFromSearch,
        this.initiationDateToSearch,
        this.paymentDateFromSearch,
        this.paymentDateToSearch,
        this.systemFileNameSearch,
        this.paymentPurposeSearch,
      )
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.viewProcessedFilesPage = result
        }
      })
  }

  setSort(dataTableEvent) {}

  setPageRelated(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
      return dataTableEvent.offset
    }
  }

  goToDetailsCancel(value, type) {
    this.rowDetail = null
    this.viewFileDetails = null
    this.salaryFileDetails = null
    this.detailsFile = null
    this.getFileDetails(value, type, 'cancel')
  }
  goToDetails(value, type) {
    this.rowDetail = null
    this.viewFileDetails = null
    this.salaryFileDetails = null
    this.detailsFile = null
    this.getFileDetails(value, type, 'detail')
  }

  goToRelatedFiles(value) {
    const offset = this.setPageRelated(null)
    this.getFileRelated(value, offset)
  }

  getFileRelated(value, offset) {
    const data = value
    //console.log(data, value,this.viewProcessedFilesGetFiles.page.pageSize);
    // Service Call
    this.viewProcessedFiles
      .getDataTableGetFilesResults(
        offset + 1,
        this.viewProcessedFilesGetFiles.page.pageSize,
        data,
        this.viewProcessedFilesPage['payrollCompanyDetails'],
      )
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.viewProcessedFilesGetFiles = result
          this.modalMostrada = true
          this.getFilesModal.show()
          //console.log(this.viewProcessedFilesGetFiles);
        }
      })
  }

  getFileDetails(value, type, view = 'detail') {
    this.currentFileDetail = value
    let data: any = {}
    for (let i = 0; i < this.viewProcessedFilesPage.data.length; i++) {
      if (this.viewProcessedFilesPage.data[i]['fileName'] === value) {
        data = this.viewProcessedFilesPage.data[i]
      }
    }
    for (let i = 0; i < this.viewProcessedFilesGetFiles.data.length; i++) {
      if (this.viewProcessedFilesGetFiles.data[i]['fileName'] === value) {
        data = this.viewProcessedFilesGetFiles.data[i]
      }
    }

    this.requestValidate = new RequestValidate()
    if (view == 'detail') {
      // Service Call for Details
      this.viewProcessedFiles
        .getFileDetail(
          data,
          this.viewProcessedFilesPage['payrollCompanyDetails'],
        )
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.generateChallengeAndOTP = result.generateChallengeAndOTP

            for (
              let i = 0;
              result['salaryFileDetails']['wpsSalaryDetailsDTOList'].length > i;
              i++
            ) {
              result['salaryFileDetails']['wpsSalaryDetailsDTOList'][i][
                'employeeNumber'
              ] = this.pad(
                result['salaryFileDetails']['wpsSalaryDetailsDTOList'][i][
                  'employeeNumber'
                ],
                '0',
                12,
              )
            }
            this.viewFileDetails = result
            this.salaryFileDetails = result.salaryFileDetails
            this.detailsFile = result.details
            this.step = view
          }
          this.getFilesModal.hide()
        })
    } else if (view == 'cancel') {
      this.validateCancel(data)
    }
  }

  onError(result) {}

  toggleExpandRow(row) {
    this.table.rowDetail.collapseAllRows()
    const data = row
    // Service Call
    this.viewProcessedFiles
      .getDataTableGetFilesResults(
        1,
        this.viewProcessedFilesGetFiles.page.pageSize,
        data,
        this.viewProcessedFilesPage['payrollCompanyDetails'],
      )
      .subscribe((result) => {
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
    this.viewProcessedFiles
      .getDataTableGetFilesResults(
        1,
        this.viewProcessedFilesGetFiles.page.pageSize,
        data,
        this.viewProcessedFilesPage['payrollCompanyDetails'],
      )
      .subscribe((result) => {
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
    this.viewProcessedFiles
      .cancel(this.salaryFileDetails, this.requestValidate)
      .subscribe((result) => {
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
    return this.authenticationService.activateOption(
      'WMSPayrollMenu',
      ['WMSPAYROLL_PRIVILEGE'],
      ['PayrollFileCancellationGroup'],
    )
  }
  allowCancelOnDetail() {
    return this.detailsFile.fileCancellation && this.allowCancel()
  }

  allowCancelOnList(file) {
    return this.allowCancel() && file.allowCancellation
  }

  downloadFile() {
    const subscription = this.viewProcessedFiles
      .downloadFile(this.detailsFile, this.salaryFileDetails)
      .subscribe((response) => {
        subscription.unsubscribe()

        if (response === null) {
        } else {
          const blobObject = response
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(
              blobObject,
              this.salaryFileDetails['fileName'],
            )
          } else {
            const downloadUrl = URL.createObjectURL(blobObject)
            const link = document.createElement('a')
            link.download = this.salaryFileDetails['fileName']
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

  validateCancel(data = null) {
    const value = data ? data : this.salaryFileDetails
    this.viewProcessedFiles
      .getCancelFileDetail(
        value,
        this.viewProcessedFilesPage['payrollCompanyDetails'],
      )
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.step = 'cancel'
          this.generateChallengeAndOTP = result.generateChallengeAndOTP
          this.viewFileDetails = result
          this.salaryFileDetails = result.salaryFileDetails
          this.detailsFile = result.detailsFile
        }
      })
  }
}
