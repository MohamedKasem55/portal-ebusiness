import { Component, Injector, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../../../../core/storage/storage.service'
import { LevelFormatPipe } from '../../../../../../Components/common/Pipes/getLevels-pipe'
import { HijraDateFormatPipe } from '../../../../../../Components/common/Pipes/hijra-date-format-pipe'
import { Page } from '../../../../../../Model/page'
import { PagedData } from '../../../../../../Model/paged-data'
import { StaticService } from '../../../../../Common/Services/static.service'
import { PayrollsService } from '../../payrolls.service'
import { DatatableComponent } from '@swimlane/ngx-datatable'

@Component({
  templateUrl: './step1.component.html',
})
export class Step1Component extends DatatableMobileComponent implements OnInit {
  @ViewChild('salaryTable', { static: true }) salaryTable: DatatableComponent
  @ViewChild('wpspayrollTable', { static: true })
  wpspayrollTable: DatatableComponent

  currentItem: any = null
  step = 1
  sharedData: any = {}
  oldSalarySelected: any

  salaryPagedResults: any = {}
  salaryDisplaySize = 20
  salarySubscription: Subscription

  payrollPagedResults: any = {}
  payrollDisplaySize = 20
  payrollSubscription: Subscription
  futureLevels = false
  combosData: any = {}

  selectAllPayrollOnPage: any = []
  selectAllSalaryOnPage: any = []
  selectedPayrollSubscription: Subscription
  selectSalarySubscription: Subscription

  maxAllowedTransactionsPayroll = null
  maxAllowedTransactionsSalary = null

  constructor(
    public service: PayrollsService,
    public translate: TranslateService,
    public storageService: StorageService,
    private injector: Injector,
    private staticService: StaticService,
  ) {
    super()
  }

  ngOnInit(): void {
    super.ngOnInit()

    const combosKeys = ['batchSecurityLevelStatus']
    this.combosData['batchSecurityLevelStatus'] = []

    this.staticService.getAllCombos(combosKeys).subscribe((comboData) => {
      const data = comboData

      const statusValues =
        data[combosKeys.indexOf('batchSecurityLevelStatus')]['values']
      Object.keys(statusValues).map((key, index) => {
        this.combosData['batchSecurityLevelStatus'][key] = statusValues[key]
      })
    })

    this.salaryPagedResults.items = []
    this.salaryPagedResults.size = 0
    this.salaryPagedResults.total = 0
    this.sharedData.salarySelected = []

    this.setPageSalary(null)

    this.payrollPagedResults.items = []
    this.payrollPagedResults.size = 0
    this.payrollPagedResults.total = 0
    this.sharedData.payrollSelected = []

    this.setPagePayroll(null)

    this.salarySubscription = this.service.salarySelected.subscribe(
      (selected) => {
        this.sharedData.salarySelected = selected
        if (this.sharedData.salarySelected.length == 0) {
          this.selectAllSalaryOnPage = []
        }
        // if(this.sharedData.payrollSelected.length == 0){
        //   this.selectAllPayrollOnPage = [];
        // }
      },
    )

    this.payrollSubscription = this.service.payrollSelected.subscribe(
      (selected) => {
        this.sharedData.payrollSelected = selected
        if (this.sharedData.payrollSelected.length == 0) {
          this.selectAllPayrollOnPage = []
        }
        // if(this.sharedData.salarySelected.length == 0){
        //   this.selectAllSalaryOnPage = [];
        // }
      },
    )
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.salaryTable)
    tablas.push(this.wpspayrollTable)
    return tablas
  }

  setPageSalary(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.salarySubscription = this.service
      .getListSalary(pageInfo.offset + 1, this.salaryDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.salaryPagedResults = result.pendingPayrollList
          this.maxAllowedTransactionsSalary=result.maximumAllowedTransactions
          this.processItemsLevels(this.salaryPagedResults.items)
        }
        this.salarySubscription.unsubscribe()
      })
  }

  setPagePayroll(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.payrollSubscription = this.service
      .getListPayroll(pageInfo.offset + 1, this.payrollDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.payrollPagedResults = result.pendingPayrollUploadList
          this.maxAllowedTransactionsPayroll=result.maximumAllowedTransactions
          this.processItemsLevels(this.payrollPagedResults.items)
        }
        this.payrollSubscription.unsubscribe()
      })
  }

  onSelectSalary({ selected }) {
    this.selectAllSalaryOnPage[this.salaryTable.offset] = false
    this.sharedData.salarySelected.splice(
      0,
      this.sharedData.salarySelected.length,
    )
    this.sharedData.salarySelected.push(...selected)
    if(selected.length>this.maxAllowedTransactionsSalary){
      this.sharedData.salarySelected.shift()
    }
    this.service.setSalarySelected(this.sharedData.salarySelected)
    // this.service.setPayrollSelected([]);
    // this.selectAllPayrollOnPage = [];
    this.selectAllPayrollOnPage[this.wpspayrollTable.offset] = true
    this.selectAllPayroll(null)
  }

  selectAllSalary(event = null) {
    if (!this.selectAllSalaryOnPage[this.salaryTable.offset]) {
      // Unselect all so we dont get duplicates.
      if (this.sharedData.salarySelected.length > 0) {
        this.salaryPagedResults.items.map((bill) => {
          this.sharedData.salarySelected =
            this.sharedData.salarySelected.filter(
              (selected) => this.getId(selected) !== this.getId(bill),
            )
        })
      }
      // Select all again
      this.sharedData.salarySelected.push(...this.salaryPagedResults.items)
      this.selectAllSalaryOnPage[this.salaryTable.offset] = true
      // console.log('-----------Select All----');
      // console.log(this.tableSelected);
    } else {
      // Unselect all
      this.salaryPagedResults.items.map((bill) => {
        this.sharedData.salarySelected = this.sharedData.salarySelected.filter(
          (selected) => this.getId(selected) !== this.getId(bill),
        )
      })
      this.selectAllSalaryOnPage[this.salaryTable.offset] = false
      // console.log('-----------UnSelect All');
      // console.log(this.tableSelected)
    }

    this.service.setSalarySelected(this.sharedData.salarySelected)
    // this.selectAllPayrollOnPage = [];
    // this.service.setPayrollSelected([]);
    // console.log('-----------Select All');
    // console.log(this.sharedData.salarySelected);
    if (this.sharedData.salarySelected.length > 0) {
      this.selectAllPayrollOnPage[this.wpspayrollTable.offset] = true
      this.selectAllPayroll(null)
    }
  }

  checkSelectableSalary(event) {
    return this['selected'].indexOf(event) === -1
  }

  onSelectPayroll({ selected }) {
    this.selectAllPayrollOnPage[this.wpspayrollTable.offset] = false
    this.sharedData.payrollSelected.splice(
      0,
      this.sharedData.payrollSelected.length,
    )
    this.sharedData.payrollSelected.push(...selected)
    if(selected.length>this.maxAllowedTransactionsPayroll){
      this.sharedData.payrollSelected.shift()
    }
    this.service.setPayrollSelected(this.sharedData.payrollSelected)
    // this.service.setSalarySelected([]);
    // this.selectAllSalaryOnPage = [];
    this.selectAllSalaryOnPage[this.salaryTable.offset] = true
    this.selectAllSalary(null)
  }

  selectAllPayroll(event = null) {
    if (!this.selectAllPayrollOnPage[this.wpspayrollTable.offset]) {
      // Unselect all so we dont get duplicates.
      if (this.sharedData.payrollSelected.length > 0) {
        this.payrollPagedResults.items.map((payroll) => {
          this.sharedData.payrollSelected =
            this.sharedData.payrollSelected.filter(
              (selected) => this.getId(selected) !== this.getId(payroll),
            )
        })
      }
      // Select all again
      this.sharedData.payrollSelected.push(...this.payrollPagedResults.items)
      this.selectAllPayrollOnPage[this.wpspayrollTable.offset] = true
      // console.log('-----------Select All----');
      // console.log(this.tableSelected);
    } else {
      // Unselect all
      this.payrollPagedResults.items.map((bill) => {
        this.sharedData.payrollSelected =
          this.sharedData.payrollSelected.filter(
            (selected) => this.getId(selected) !== this.getId(bill),
          )
      })
      this.selectAllPayrollOnPage[this.wpspayrollTable.offset] = false
      // console.log('-----------UnSelect All');
      // console.log(this.tableSelected)
    }
    this.service.setPayrollSelected(this.sharedData.payrollSelected)
    // this.service.setSalarySelected([]);
    // this.selectAllSalaryOnPage = [];

    // console.log('-----------Select All');
    // console.log(this.sharedData.payrollSelected)
    if (this.sharedData.payrollSelected.length > 0) {
      this.selectAllSalaryOnPage[this.salaryTable.offset] = true
      this.selectAllSalary(null)
    }
  }

  checkSelectablePayroll(event) {
    return this['selected'].indexOf(event) === -1
  }

  valid() {
    return true
  }

  getId(row) {
    return row['batchPk']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  openModal(
    row: { futureSecurityLevelsDTOList: any; securityLevelsDTOList: any },
    popup: { openModal: { (arg0: any): void; (arg0: any): void } },
  ) {
    if (this.futureLevels) {
      popup.openModal(row.futureSecurityLevelsDTOList)
    } else {
      popup.openModal(row.securityLevelsDTOList)
    }
  }

  onClickSalaryPaymentItem(row) {
    this.service.getSalaryPaymentsDetail(row).subscribe((result) => {
      if (result.error == true) {
      } else {
        const currentItem = []
        const user = JSON.parse(this.storageService.retrieve('currentUser'))

        currentItem['customerCIC'] = user.company.profileNumber
        currentItem['organizationName'] = user.company.companyName

        const payrollSalaryPaymentBatch = result.payrollSalaryPaymentBatch
        currentItem['accountFrom'] = payrollSalaryPaymentBatch.accountNumber
        currentItem['valueDate'] = payrollSalaryPaymentBatch.paymentDate
        currentItem['batchName'] = payrollSalaryPaymentBatch.batchName
        currentItem['molEstbId'] = payrollSalaryPaymentBatch.molEstbId
        currentItem['customerReference'] =
          payrollSalaryPaymentBatch.fileReference
        currentItem['paymentPurpose'] = payrollSalaryPaymentBatch.paymentPurpose
        currentItem['remarks'] = payrollSalaryPaymentBatch.remarks
        currentItem['initiationDate'] = payrollSalaryPaymentBatch.initiationDate
        currentItem['status'] = payrollSalaryPaymentBatch.status

        currentItem['hijraDate'] = new HijraDateFormatPipe(
          this.injector,
        ).transform(payrollSalaryPaymentBatch.paymentDate, 'fullDate')

        const authorizationPage = new PagedData<any>()
        authorizationPage.data = []
        const page2 = new Page()
        page2.pageNumber = 1
        page2.pageSize = 20
        authorizationPage.page = page2

        authorizationPage.data = row.securityLevelsDTOList
        authorizationPage.page.totalPages = 1
        authorizationPage.page.totalElements = authorizationPage.data.length
        authorizationPage.page.size = authorizationPage.data.length
        currentItem['authorizationPage'] = authorizationPage

        const employeePage = new PagedData<any>()
        employeePage.data = []
        const page = new Page()
        page.pageNumber = 1
        page.pageSize = 50
        employeePage.page = page

        employeePage.data = result.selectedEmployeeList
        employeePage.page.totalPages = 1
        employeePage.page.totalElements = employeePage.data.length
        currentItem['employeeData'] = employeePage

        currentItem['salaryPaymentDetailsDTO'] = result.salaryPaymentDetails
        currentItem['salaryPaymentItem'] = true

        this.currentItem = currentItem
        this.service.setCurrenItem(currentItem)
      }
    })
  }

  onClickWPSPayrollItem(row) {
    const payrollSelected = []
    payrollSelected.push(row)
    this.service.getPayrollsDetail(payrollSelected).subscribe((result) => {
      if (result.error == true) {
      } else {
        const currentItem = []
        const user = JSON.parse(this.storageService.retrieve('currentUser'))

        currentItem['customerCIC'] = user.company.profileNumber
        currentItem['organizationName'] = user.company.companyName

        let payrollUploadBatch = result.batchList.toProcess[0]
        if (result.batchList.toProcess.length === 0) {
          payrollUploadBatch = result.batchList.toAuthorize[0]
        }
        currentItem['customerReference'] = payrollUploadBatch.fileReference
        currentItem['batchName'] = payrollUploadBatch.batchName
        currentItem['numberPayments'] = payrollUploadBatch.localRecordCount
        currentItem['totalAmount'] = payrollUploadBatch.totalAmount
        currentItem['accountFrom'] = payrollUploadBatch.accountNumber
        currentItem['fileSendDate'] = payrollUploadBatch.initiationDate // TODO CHECK File Send date
        currentItem['paymentDate'] =
          payrollUploadBatch.payrollFileHeader.valueDate
        currentItem['paymentPurpose'] = payrollUploadBatch.paymentPurpose
        currentItem['remarks'] = payrollUploadBatch.remarks
        currentItem['status'] = payrollUploadBatch.status

        const authorizationPage = new PagedData<any>()
        authorizationPage.data = []
        const page2 = new Page()
        page2.pageNumber = 1
        page2.pageSize = 50
        authorizationPage.page = page2

        authorizationPage.data = row.securityLevelsDTOList //payrollUploadBatch.futureSecurityLevelsDTOList; //TODO Check securityLevelsDTOList
        authorizationPage.page.totalPages = 1
        authorizationPage.page.totalElements = authorizationPage.data.length
        currentItem['authorizationPage'] = authorizationPage

        const employeePage = new PagedData<any>()
        employeePage.data = []
        const page = new Page()
        page.pageNumber = 1
        page.pageSize = 20
        employeePage.page = page

        employeePage.data = payrollUploadBatch.listEmployees
        employeePage.page.totalPages = 1
        employeePage.page.totalElements =
          payrollUploadBatch.listEmployees.length
        currentItem['employeeData'] = employeePage

        currentItem['salaryPaymentDetailsDTO'] = result.salaryPaymentDetails
        currentItem['salaryPaymentItem'] = false
        this.currentItem = currentItem
        this.service.setCurrenItem(currentItem)
      }
    })
  }

  protected processItemsLevels(items) {
    if (Array.isArray(items) && items.length > 0) {
      items.forEach((item) => {
        item['curStatusExport'] = new LevelFormatPipe(this.injector).transform(
          item.securityLevelsDTOList,
          'status',
        )
        item['nextStatusExport'] = new LevelFormatPipe(this.injector).transform(
          item.securityLevelsDTOList,
          'nextStatus',
        )
        item['statusExport'] = this.combosData['batchSecurityLevelStatus'][
          item.status
        ]
          ? this.combosData['batchSecurityLevelStatus'][item.status]
          : item.status
      })
    }
  }
}
