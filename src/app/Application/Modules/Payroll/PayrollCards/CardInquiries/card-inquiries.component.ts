import { Component, Injector, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Exception } from 'app/Application/Model/exception'
import { SimpleMQ } from 'ng2-simple-mq'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { PagedData } from '../../../../Model/paged-data'
import { StaticService } from '../../../Common/Services/static.service'
import { PayrollCardsService } from '../payroll-cards.service'
import { CardInquiriesService } from './card-inquiries.service'

@Component({
  templateUrl: './card-inquiries.component.html',
})
export class CardInquiriesComponent
  extends DatatableMobileComponent
  implements OnInit {
  @ViewChild('table') table: any
  @ViewChild('tableTransaction') table2: any

  subscription: Subscription
  cardInquiriesList: PagedData<any>
  transactionList: PagedData<any>

  isCollapsedContent: boolean
  isCollapsedContentDetails: boolean

  searchForm: any = {}
  searchFormData: any = {}

  searchTransaction: any = {}

  state = 'list'
  cardDetails: any;
  cardNumber: any
  cardName: any
  instituteId: any
  layout: any
  institutionType: any
  bsConfig: any

  today = new Date()

  searchCombosData: any = {}

  constructor(
    private cardInquiryService: CardInquiriesService,
    public translate: TranslateService,
    private payrollCardsService: PayrollCardsService,
    private injector: Injector,
    protected staticService: StaticService,
    public router: Router,
    private smq: SimpleMQ,
  ) {
    super()
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.state == 'list') {
      tablas.push(this.table)
    }
    if (this.state == 'detail') {
      tablas.push(this.table2)
    }
    return tablas
  }

  ngOnInit(): void {
    super.ngOnInit()

    this.searchCombosData = {
      incentiveCardsStatus: [],
    }

    const combosKeys = ['incentiveCardsStatus']

    this.staticService.getAllCombosAsArrays(combosKeys).subscribe((resultC) => {
      if (resultC !== null) {
        const data: Object = resultC
        for (let i = 0; i < combosKeys.length; i++) {
          this.searchCombosData[combosKeys[i]] = data[combosKeys[i]]
        }
      }
    })

    this.payrollCardsService.getInstitution().subscribe((result) => {
      this.instituteId = result.institutionDTO.institutionId
      this.layout = result.institutionDTO.layout
      this.institutionType = result.institutionDTO.institutionType
    })
    this.state = 'list'
    this.cardInquiriesList = new PagedData<any>()
    this.cardInquiriesList.page.pageSize = 20
    this.searchForm.selectedIncentiveCards = 'nationalId'
    this.searchFormData = Object.assign({}, this.searchForm)
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
    this.setPage(null)
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      if (this.state == 'detail') {
        this.setTransactionPage({
          offset: this.transactionList.page.pageNumber - 1,
        })
      }

      this.searchCombosData = {
        incentiveCardsStatus: [],
      }

      this.staticService
        .getAllCombosAsArrays(combosKeys)
        .subscribe((resultC) => {
          if (resultC !== null) {
            const data: Object = resultC
            for (let i = 0; i < combosKeys.length; i++) {
              this.searchCombosData[combosKeys[i]] = data[combosKeys[i]]
            }
          }
        })
    })
  }

  onDetailToggle(event) {
    //console.log('Detail Toggled', event);
  }

  search() {
    this.searchFormData = Object.assign({}, this.searchForm)
    this.searchFormData.searchFlag = true
    this.setPage(null)
  }

  reset() {
    this.searchForm = {}
    this.searchForm.selectedIncentiveCards = 'nationalId'
    this.searchFormData = Object.assign({}, this.searchForm)
    this.setPage(null)
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.cardInquiriesList.page.pageNumber = pageInfo.offset

    this.subscription = this.cardInquiryService
      .getCardInquiriesList(
        this.cardInquiriesList.page.pageSize,
        this.cardInquiriesList.page.pageNumber + 1,
        this.searchFormData.cardNumber,
        this.searchFormData.departmentCodeSelected,
        this.searchFormData.nationalId,
        this.searchFormData.searchFlag,
        this.searchFormData.selectedIncentiveCards,
        this.searchFormData.status,
      )
      .subscribe((result) => {
        //

        this.cardInquiriesList = result
        this.subscription.unsubscribe()
      })
  }

  onCriteriaChange(target) {
    let value = ''
    if (target && target.value) {
      value = target.value
    }
    this.searchForm.selectedIncentiveCards = value
    if (value === 'nationalId') {
      this.searchForm.nationalId = ''
      this.searchForm.cardNumber = ''
      this.searchForm.status = null
    }
    if (value === 'cardReferenceNumber') {
      this.searchForm.nationalId = ''
      this.searchForm.cardNumber = ''
      this.searchForm.status = null
    }
    if (value === 'status') {
      this.searchForm.nationalId = ''
      this.searchForm.cardNumber = ''
      this.searchForm.status = null
    }
  }

  selectStatus(status) {
    this.searchForm.status = status
  }

  details(value) {
    this.state = 'detail'
    this.transactionList = new PagedData<any>()
    this.transactionList.page.pageSize = 20
    this.cardDetails = value
    this.cardNumber = value['cardNumber']
    this.cardName = value['cardHolderName']
    const beforDate = new Date()
    beforDate.setMonth(beforDate.getMonth() - 1)
    this.searchTransaction.dateFrom = beforDate
    this.searchTransaction.dateTo = this.today
    this.setTransactionPage(null)
  }

  setSort(dataTableEvent) {
    //console.log(dataTableEvent);
  }

  setTransactionPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.transactionList.page.pageNumber = pageInfo.offset

    this.subscription = this.cardInquiryService
      .getCardTransaction(
        this.transactionList.page.pageSize,
        this.transactionList.page.pageNumber + 1,
        this.cardNumber,
        this.instituteId,
        this.searchTransaction.dateFrom,
        this.searchTransaction.dateTo,
      )
      .subscribe((result) => {
        //

        this.transactionList = result
        this.subscription.unsubscribe()
      })
  }

  searchDetail() {
    this.setTransactionPage(null)
  }

  getPdf() {
    this.cardInquiryService.getPDFCardStatement(this.cardDetails, this.instituteId,
      this.searchTransaction.dateFrom, this.searchTransaction.dateTo).subscribe((response) => {
        if (response.type == 'text/xml' || response.type == '') {
          const reader = new FileReader()
          reader.addEventListener('loadend', () => {
            const output = JSON.parse(reader.result as string)
            this.handleError(output)
          })
        } else {
          const blobObject = response
          if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(
              blobObject,
              "name",
            )
          } else {
            const downloadUrl = URL.createObjectURL(blobObject)
            const link = document.createElement('a')
            link.download = "PayrollCardStatement"
            link.href = downloadUrl
            document.body.appendChild(link)
            link.click()
          }
        }
      })
  }

  printPdf() {
    this.cardInquiryService.getPDFCardStatement(this.cardDetails, this.instituteId,
      this.searchTransaction.dateFrom, this.searchTransaction.dateTo).subscribe((response) => {
        if (response.type == 'text/xml' || response.type == '') {
          const reader = new FileReader()
          reader.addEventListener('loadend', () => {
            const output = JSON.parse(reader.result as string)
            this.handleError(output)
          })
        } else {
          this.printFile(response, 'PayrollCardStatement.pdf')
        }
      })
  }

  getXlsx() {
    this.cardInquiryService.getXLSCardStatement(this.cardDetails, this.instituteId,
      this.searchTransaction.dateFrom, this.searchTransaction.dateTo).subscribe((res) => {
        if (res.type == 'text/xml' || res.type == '') {
          const reader = new FileReader()
          reader.addEventListener(
            'loadend',
            function () {
              const output = JSON.parse(JSON.stringify(reader.result))
              this.handleError(output)
            }.bind(this),
          )
          reader.readAsText(res)
        } else {
          this.downloadFile(res, 'PayrollCardStatement.xls')
        }
      })
  }

  private downloadFile(blob, name) {
    if (blob === null) {
    } else {
      const blobObject = blob
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blobObject, name)
      } else {
        const downloadUrl = URL.createObjectURL(blobObject)
        const link = document.createElement('a')
        link.download = name
        link.href = downloadUrl
        document.body.appendChild(link)
        link.click()
      }
    }
  }

  private printFile(blob, name) {
    if (blob === null) {
    } else {
      const doc = blob
      const urlBlob = URL.createObjectURL(blob)
      const url = window.location.href
      const docURL =
        url.replace('#' + this.router.url, '') +
        'viewer/viewer.html?file=' +
        urlBlob
      const x = window.open(docURL)
      x.document.body.onload = () => {
        x.document.addEventListener('pagerendered', () =>
          setTimeout((e) => {
            x.document.getElementById('print').click()
          }, 1000),
        )
      }
    }
  }

  private handleError(output) {
    if (output.errorCode && output.errorCode !== '0') {
      let message: string
      if (output.errorCode === '-2') {
        message = 'Following fields contains error:<br/>'
        for (const entry of output.fieldErrors) {
          message =
            message +
            '<b> - Field: ' +
            entry.field +
            ' Error: ' +
            entry.message +
            '</b><br/>'
        }
      } else if (output.errorResponse) {
        if (this.injector.get(TranslateService).currentLang === 'ar') {
          message = output.errorResponse.arabicMessage
        } else {
          message = output.errorResponse.englishMessage
        }
      }

      if (!message || message === '') {
        message = output.errorDescription
      }

      if (!message || message === '') {
        message = 'Operation not available'
      }

      this.translate
        .get(message)
        .subscribe((value) => this.smq.publish('error-mq', value))
    }
  }
}
