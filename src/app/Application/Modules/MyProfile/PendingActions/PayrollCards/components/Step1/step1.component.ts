import { Component, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../../core/responsive/datatable-mobile.component'
import { LevelFormatPipe } from '../../../../../../Components/common/Pipes/getLevels-pipe'
import { PayrollCardsService } from '../../payroll-cards.service'

@Component({
  templateUrl: './step1.component.html',
})
export class Step1Component extends DatatableMobileComponent implements OnInit {
  @ViewChild('tableOperations', { static: true }) tableOperations: any
  @ViewChild('tablePayments', { static: true }) tablePayments: any
  @ViewChild('tableUploadFiles', { static: true }) tableUploadFiles: any
  @ViewChild('tableNewCards', { static: true }) tableNewCards: any

  step = 1
  sharedData: any = {}

  operationsSubscription: Subscription
  tableOperationsLimit = 20
  listOperationsDTO: any = {}

  paymentsSubscription: Subscription
  tablePaymentsLimit = 20
  listPayrolCardPayment: any = {}

  uploadFilesSubscription: Subscription
  tableUploadFilesLimit = 20
  listPayrolCardUploadFile: any = {}

  newCardsSubscription: Subscription
  tableNewCardsLimit = 20
  listPayrolCard: any = {}
  futureLevels = false

  selectAllOnPageOperations: any = []
  selectAllOnPagePayments: any = []
  selectAllOnPageUploadFiles: any = []
  selectAllOnPageNewCards: any = []

  constructor(
    private service: PayrollCardsService,
    public translate: TranslateService,
    private levelsPipe: LevelFormatPipe,
  ) {
    super()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.tableOperations)
    tablas.push(this.tablePayments)
    tablas.push(this.tableUploadFiles)
    tablas.push(this.tableNewCards)
    return tablas
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.listOperationsDTO.items = []
    this.listOperationsDTO.size = 0
    this.listOperationsDTO.total = 0
    this.sharedData.operationsSelected = []
    this.setPageOperations(null)

    this.listPayrolCardPayment.items = []
    this.listPayrolCardPayment.size = 0
    this.listPayrolCardPayment.total = 0
    this.sharedData.paymentsSelected = []
    this.setPagePayments(null)

    this.listPayrolCardUploadFile.items = []
    this.listPayrolCardUploadFile.size = 0
    this.listPayrolCardUploadFile.total = 0
    this.sharedData.uploadFilesSelected = []
    this.setPageUploadFiles(null)

    this.listPayrolCard.items = []
    this.listPayrolCard.size = 0
    this.listPayrolCard.total = 0
    this.sharedData.payrolCardsSelected = []
    this.setPageNewCards(null)
  }

  setPageOperations(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.operationsSubscription = this.service
      .operationsGetList(pageInfo.offset + 1, this.tableOperationsLimit)
      .subscribe((result) => {
        this.operationsSubscription.unsubscribe()
        if (!result.error) {
          this.listOperationsDTO = result.listOperations
          this.translateLevels()
        }
      })
  }

  setPagePayments(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.paymentsSubscription = this.service
      .paymentsGetList(pageInfo.offset + 1, this.tablePaymentsLimit)
      .subscribe((result) => {
        this.paymentsSubscription.unsubscribe()
        if (!result.error) {
          this.listPayrolCardPayment = result.batchListPayrolCardPayment
          this.translateLevels()
        }
      })
  }

  setPageUploadFiles(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.uploadFilesSubscription = this.service
      .uploadFilesGetList(pageInfo.offset + 1, this.tableUploadFilesLimit)
      .subscribe((result) => {
        this.uploadFilesSubscription.unsubscribe()
        if (!result.error) {
          this.listPayrolCardUploadFile = result.batchListPayrolCardUploadFile
          this.translateLevels()
        }
      })
  }

  setPageNewCards(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.newCardsSubscription = this.service
      .newCardGetList(pageInfo.offset + 1, this.tableNewCardsLimit)
      .subscribe((result) => {
        this.newCardsSubscription.unsubscribe()
        if (!result.error) {
          this.listPayrolCard = result.batchListPayrolCard
          this.translateLevels()
        }
      })
  }

  cleanSelectionTableOperations() {
    this.tableOperations.selected.splice(
      0,
      this.tableOperations.selected.length,
    )
    const items = Object.assign([], this.listOperationsDTO.items)
    this.listOperationsDTO.items = []
    this.listOperationsDTO.items.push(...items)
    this.service.tableSelectedRowsOperations = []
  }

  cleanSelectionTablePayments() {
    this.tablePayments.selected.splice(0, this.tablePayments.selected.length)
    const items = Object.assign([], this.listPayrolCardPayment.items)
    this.listPayrolCardPayment.items = []
    this.listPayrolCardPayment.items.push(...items)
    this.service.tableSelectedRowsPayments = []
  }

  cleanSelectionTableUploadFiles() {
    this.tableUploadFiles.selected.splice(
      0,
      this.tableUploadFiles.selected.length,
    )
    const items = Object.assign([], this.listPayrolCardUploadFile.items)
    this.listPayrolCardUploadFile.items = []
    this.listPayrolCardUploadFile.items.push(...items)
    this.service.tableSelectedRowsUploadFiles = []
  }

  cleanSelectionTableNewCards() {
    this.tableNewCards.selected.splice(0, this.tableNewCards.selected.length)
    const items = Object.assign([], this.listPayrolCard.items)
    this.listPayrolCard.items = []
    this.listPayrolCard.items.push(...items)
    this.service.tableSelectedRowsNewCards = []
  }

  onSelectOperations({ selected }) {
    this.cleanSelectionTablePayments()
    this.cleanSelectionTableUploadFiles()
    this.cleanSelectionTableNewCards()

    this.selectAllOnPageOperations[this.tableOperations.offset] = false
    this.sharedData.operationsSelected.splice(
      0,
      this.sharedData.operationsSelected.length,
    )
    this.sharedData.operationsSelected.push(...selected)
    this.service.tableSelectedRowsOperations =
      this.sharedData.operationsSelected
  }
  selectAllOperations(event) {
    const offset = this.tableOperations.offset
    if (!this.selectAllOnPageOperations[offset]) {
      // Unselect all so we dont get duplicates.
      if (this.sharedData.operationsSelected.length > 0) {
        this.listOperationsDTO.items.map((bill) => {
          this.sharedData.operationsSelected =
            this.sharedData.operationsSelected.filter(
              (selected) => this.getId(selected) !== this.getId(bill),
            )
        })
      }
      // Select all again
      this.sharedData.operationsSelected.push(...this.listOperationsDTO.items)
      this.selectAllOnPageOperations[offset] = true
      // console.log('-----------Select All----');
      // console.log(this.tableSelected);
    } else {
      // Unselect all
      this.listOperationsDTO.items.map((bill) => {
        this.sharedData.operationsSelected =
          this.sharedData.operationsSelected.filter(
            (selected) => this.getId(selected) !== this.getId(bill),
          )
      })
      this.selectAllOnPageOperations[offset] = false
      // console.log('-----------UnSelect All');
      // console.log(this.tableSelected)
    }
    //   //console.log('Select Event', selected, this.tableSelected);
    this.service.tableSelectedRowsOperations =
      this.sharedData.operationsSelected
  }
  onSelectPayrolCardPayment({ selected }) {
    this.cleanSelectionTableOperations()
    this.cleanSelectionTableUploadFiles()
    this.cleanSelectionTableNewCards()

    this.selectAllOnPagePayments[this.tableOperations.offset] = false
    this.sharedData.paymentsSelected.splice(
      0,
      this.sharedData.paymentsSelected.length,
    )
    this.sharedData.paymentsSelected.push(...selected)
    this.service.tableSelectedRowsPayments = this.sharedData.paymentsSelected
  }
  selectAllPayments(event) {
    const offset = this.tablePayments.offset
    if (!this.selectAllOnPagePayments[offset]) {
      // Unselect all so we dont get duplicates.
      if (this.sharedData.paymentsSelected.length > 0) {
        this.listPayrolCardPayment.items.map((bill) => {
          this.sharedData.paymentsSelected =
            this.sharedData.paymentsSelected.filter(
              (selected) => this.getId(selected) !== this.getId(bill),
            )
        })
      }
      // Select all again
      this.sharedData.paymentsSelected.push(...this.listPayrolCardPayment.items)
      this.selectAllOnPagePayments[offset] = true
      // console.log('-----------Select All----');
      // console.log(this.tableSelected);
    } else {
      // Unselect all
      this.listPayrolCardPayment.items.map((bill) => {
        this.sharedData.paymentsSelected =
          this.sharedData.paymentsSelected.filter(
            (selected) => this.getId(selected) !== this.getId(bill),
          )
      })
      this.selectAllOnPagePayments[offset] = false
      // console.log('-----------UnSelect All');
      // console.log(this.tableSelected)
    }
    //   //console.log('Select Event', selected, this.tableSelected);
    this.service.tableSelectedRowsPayments = this.sharedData.paymentsSelected
  }
  onSelectPayrolCardUploadFile({ selected }) {
    this.cleanSelectionTableOperations()
    this.cleanSelectionTablePayments()
    this.cleanSelectionTableNewCards()
    this.selectAllOnPageUploadFiles[this.tableUploadFiles.offset] = false
    this.sharedData.uploadFilesSelected.splice(
      0,
      this.sharedData.uploadFilesSelected.length,
    )
    this.sharedData.uploadFilesSelected.push(...selected)
    this.service.tableSelectedRowsUploadFiles =
      this.sharedData.uploadFilesSelected
  }
  selectAllUploadFiles(event) {
    const offset = this.tableUploadFiles.offset
    if (!this.selectAllOnPageUploadFiles[offset]) {
      // Unselect all so we dont get duplicates.
      if (this.sharedData.uploadFilesSelected.length > 0) {
        this.listPayrolCardUploadFile.items.map((bill) => {
          this.sharedData.uploadFilesSelected =
            this.sharedData.uploadFilesSelected.filter(
              (selected) => this.getId(selected) !== this.getId(bill),
            )
        })
      }
      // Select all again
      this.sharedData.uploadFilesSelected.push(
        ...this.listPayrolCardUploadFile.items,
      )
      this.selectAllOnPageUploadFiles[offset] = true
      // console.log('-----------Select All----');
      // console.log(this.tableSelected);
    } else {
      // Unselect all
      this.listPayrolCardUploadFile.items.map((bill) => {
        this.sharedData.uploadFilesSelected =
          this.sharedData.uploadFilesSelected.filter(
            (selected) => this.getId(selected) !== this.getId(bill),
          )
      })
      this.selectAllOnPageUploadFiles[offset] = false
      // console.log('-----------UnSelect All');
      // console.log(this.tableSelected)
    }
    //   //console.log('Select Event', selected, this.tableSelected);
    this.service.tableSelectedRowsUploadFiles =
      this.sharedData.uploadFilesSelected
  }
  onSelectPayrolCard({ selected }) {
    this.cleanSelectionTableOperations()
    this.cleanSelectionTablePayments()
    this.cleanSelectionTableUploadFiles()
    this.selectAllOnPageNewCards[this.tableNewCards.offset] = false
    this.sharedData.payrolCardsSelected.splice(
      0,
      this.sharedData.payrolCardsSelected.length,
    )
    this.sharedData.payrolCardsSelected.push(...selected)
    this.service.tableSelectedRowsNewCards = this.sharedData.payrolCardsSelected
  }

  selectAllPayrollCards(event) {
    const offset = this.tableNewCards.offset
    if (!this.selectAllOnPageNewCards[offset]) {
      // Unselect all so we dont get duplicates.
      if (this.sharedData.payrolCardsSelected.length > 0) {
        this.listPayrolCard.items.map((bill) => {
          this.sharedData.payrolCardsSelected =
            this.sharedData.payrolCardsSelected.filter(
              (selected) => this.getId(selected) !== this.getId(bill),
            )
        })
      }
      // Select all again
      this.sharedData.payrolCardsSelected.push(...this.listPayrolCard.items)
      this.selectAllOnPageNewCards[offset] = true
      // console.log('-----------Select All----');
      // console.log(this.tableSelected);
    } else {
      // Unselect all
      this.listPayrolCard.items.map((bill) => {
        this.sharedData.payrolCardsSelected =
          this.sharedData.payrolCardsSelected.filter(
            (selected) => this.getId(selected) !== this.getId(bill),
          )
      })
      this.selectAllOnPageNewCards[offset] = false
      // console.log('-----------UnSelect All');
      // console.log(this.tableSelected)
    }
    //   //console.log('Select Event', selected, this.tableSelected);
    this.service.tableSelectedRowsNewCards = this.sharedData.payrolCardsSelected
  }

  checkSelectableOperations(event) {
    return this['selected'].indexOf(event) === -1
  }
  checkSelectablePayrolCardPayment(event) {
    return this['selected'].indexOf(event) === -1
  }
  checkSelectablePayrolCardUploadFile(event) {
    return this['selected'].indexOf(event) === -1
  }
  checkSelectablePayrolCard(event) {
    return this['selected'].indexOf(event) === -1
  }

  getId(row) {
    return row['batchPk']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  openModal(row, popup) {
    if (this.futureLevels) {
      popup.openModal(row.futureSecurityLevelsDTOList)
    } else {
      popup.openModal(row.securityLevelsDTOList)
    }
  }

  private translateLevels(): void {
    if (this.listOperationsDTO && this.listOperationsDTO.items) {
      let levels
      for (const item of this.listOperationsDTO.items) {
        levels = item.futureSecurityLevelsDTOList
          ? item.futureSecurityLevelsDTOList
          : item.securityLevelsDTOList
        item.statusTrans = this.levelsPipe.transform(levels, 'status')
        item.nextStatusTrans = this.levelsPipe.transform(levels, 'nextStatus')
      }
    }

    if (this.listPayrolCardPayment && this.listPayrolCardPayment.items) {
      let levels
      for (const item of this.listPayrolCardPayment.items) {
        levels = item.futureSecurityLevelsDTOList
          ? item.futureSecurityLevelsDTOList
          : item.securityLevelsDTOList
        item.statusTrans = this.levelsPipe.transform(levels, 'status')
        item.nextStatusTrans = this.levelsPipe.transform(levels, 'nextStatus')
      }
    }

    if (this.listPayrolCardUploadFile && this.listPayrolCardUploadFile.items) {
      let levels
      for (const item of this.listPayrolCardUploadFile.items) {
        levels = item.futureSecurityLevelsDTOList
          ? item.futureSecurityLevelsDTOList
          : item.securityLevelsDTOList
        item.statusTrans = this.levelsPipe.transform(levels, 'status')
        item.nextStatusTrans = this.levelsPipe.transform(levels, 'nextStatus')
      }
    }

    if (this.listPayrolCard && this.listPayrolCard.items) {
      let levels
      for (const item of this.listPayrolCard.items) {
        levels = item.futureSecurityLevelsDTOList
          ? item.futureSecurityLevelsDTOList
          : item.securityLevelsDTOList
        item.statusTrans = this.levelsPipe.transform(levels, 'status')
        item.nextStatusTrans = this.levelsPipe.transform(levels, 'nextStatus')
      }
    }
  }
}
