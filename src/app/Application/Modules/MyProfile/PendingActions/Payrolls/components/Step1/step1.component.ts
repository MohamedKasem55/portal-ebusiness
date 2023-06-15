import { Component, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../../../../core/storage/storage.service'
import { Page } from '../../../../../../Model/page'
import { PagedData } from '../../../../../../Model/paged-data'
import { PayrollsService } from '../../payrolls.service'
import { DataTableWraperComponent } from '../../../../../../Components/common/data-table-wrapper.component'

@Component({
  templateUrl: './step1.component.html',
})
export class Step1Component extends DatatableMobileComponent implements OnInit {
  @ViewChild('salaryTable', { static: true }) salaryTable: any
  @ViewChild('payrollTable', { static: true }) payrollTable: any

  selectAllPayrollOnPage: any = []
  selectAllSalaryOnPage: any = []
  selectedPayrollSubscription: Subscription
  selectSalarySubscription: Subscription

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

  constructor(
    public service: PayrollsService,
    public translate: TranslateService,
    public storageService: StorageService,
  ) {
    super()
    this.salaryDisplaySize = this.service.salaryDisplaySize
    this.payrollDisplaySize = this.service.payrollDisplaySize
  }

  ngOnInit(): void {
    super.ngOnInit()

    this.salaryDisplaySize = this.service.salaryDisplaySize
    this.payrollDisplaySize = this.service.payrollDisplaySize

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
        // console.log('shared- subscription',billPaymentsSelected);
        this.sharedData.salarySelected = selected
        if (this.sharedData.salarySelected.length == 0) {
          this.selectAllSalaryOnPage = []
        }
        if (this.sharedData.payrollSelected.length == 0) {
          this.selectAllPayrollOnPage = []
        }
      },
    )

    this.payrollSubscription = this.service.payrollSelected.subscribe(
      (selected) => {
        // console.log('shared- subscription',billPaymentsSelected);
        this.sharedData.payrollSelected = selected
        if (this.sharedData.payrollSelected.length == 0) {
          this.selectAllPayrollOnPage = []
        }
        if (this.sharedData.salarySelected.length == 0) {
          this.selectAllSalaryOnPage = []
        }
      },
    )

    // console.log('salary',this.sharedData.salarySelected);
    // console.log('payroll',this.sharedData.payrollSelected)
  }

  changeSalaryTablesPageSize() {
    this.service.salaryDisplaySize = this.salaryDisplaySize
    this.setPageSalary(null)
  }

  changePayrollTablesPageSize() {
    // const tablas = [];
    // tablas.push(this.salaryTable);
    // tablas.push(this.payrollTable);\
    this.service.payrollDisplaySize = this.payrollDisplaySize
    this.setPagePayroll(null)
  }

  setPageSalary(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.salarySubscription = this.service
      .getListSalary(pageInfo.offset + 1, this.salaryDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          //console.log('Salary response: ', result);
          this.salaryPagedResults = result.pendingPayrollList
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
          //console.log('Payroll response: ', result);

          this.payrollPagedResults = result.pendingPayrollUploadList
        }
        this.payrollSubscription.unsubscribe()
      })
  }

  onSelectSalary({ selected }) {
    //console.log(this.payrollTable);
    this.payrollTable.selected.splice(0, this.payrollTable.selected.length)
    const items = Object.assign([], this.payrollPagedResults.items)
    this.payrollPagedResults.items = [] //Object.assign([],this.payrollPagedResults.items);
    this.payrollPagedResults.items.push(...items)

    this.selectAllSalaryOnPage[this.salaryTable.offset] = false
    this.sharedData.salarySelected.splice(
      0,
      this.sharedData.salarySelected.length,
    )
    this.sharedData.salarySelected.push(...selected)

    this.service.setSalarySelected(this.sharedData.salarySelected)
    this.service.setPayrollSelected([])
    this.selectAllPayrollOnPage = []

    // console.log(this.sharedData.salarySelected);
  }

  checkSelectableSalary(event) {
    return this['selected'].indexOf(event) === -1
  }

  selectAllSalary(event) {
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
    this.selectAllPayrollOnPage = []
    this.service.setSalarySelected(this.sharedData.salarySelected)
    this.service.setPayrollSelected([])
    // console.log('-----------Select All');
    // console.log(this.sharedData.salarySelected);
  }

  onSelectPayroll({ selected }) {
    //console.log(this.salaryTable);
    this.salaryTable.selected.splice(0, this.salaryTable.selected.length)
    const items = Object.assign([], this.salaryPagedResults.items)
    this.salaryPagedResults.items = [] //Object.assign([],this.salaryPagedResults.items);
    this.salaryPagedResults.items.push(...items)

    this.selectAllPayrollOnPage[this.payrollTable.offset] = false
    this.sharedData.payrollSelected.splice(
      0,
      this.sharedData.payrollSelected.length,
    )
    this.sharedData.payrollSelected.push(...selected)

    this.service.setPayrollSelected(this.sharedData.payrollSelected)
    this.service.setSalarySelected([])
    this.selectAllSalaryOnPage = []

    // console.log(this.sharedData.payrollSelected);
  }

  checkSelectablePayroll(event) {
    return this['selected'].indexOf(event) === -1
  }

  selectAllPayroll(event) {
    if (!this.selectAllPayrollOnPage[this.payrollTable.offset]) {
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
      this.selectAllPayrollOnPage[this.payrollTable.offset] = true
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
      this.selectAllPayrollOnPage[this.payrollTable.offset] = false
      // console.log('-----------UnSelect All');
      // console.log(this.tableSelected)
    }
    this.selectAllSalaryOnPage = []
    this.service.setSalarySelected([])
    this.service.setPayrollSelected(this.sharedData.payrollSelected)

    // console.log('-----------Select All');
    // console.log(this.sharedData.payrollSelected)
  }

  openModal(row, popup) {
    popup.openModal(row)
  }

  onClickSalaryPaymentItem(row) {
    //console.log('click onClicksalaryPaymentItem');

    this.service.getSalaryPaymentsDetail(row).subscribe((result) => {
      if (result.error == true) {
      } else {
        //console.log(result);
        const currentItem = []
        const user = JSON.parse(this.storageService.retrieve('currentUser'))
        //console.log(user);
        currentItem['customerCIC'] = user.company.profileNumber
        currentItem['organizationName'] = user.company.companyName

        const paymentBatchDTO = []
        paymentBatchDTO.push(...result.batchListsContainer.notAllowed)
        paymentBatchDTO.push(...result.batchListsContainer.toProcess)
        paymentBatchDTO.push(...result.batchListsContainer.toAuthorize)

        const payrollSalaryPaymentBatchDTO =
          paymentBatchDTO.length > 0 ? paymentBatchDTO[0] : {}
        currentItem['accountFrom'] = payrollSalaryPaymentBatchDTO.accountNumber
        currentItem['paymentDate'] = payrollSalaryPaymentBatchDTO.paymentDate
        currentItem['batchName'] = payrollSalaryPaymentBatchDTO.batchName
        currentItem['initiationDate'] =
          payrollSalaryPaymentBatchDTO.initiationDate
        currentItem['customerReference'] =
          payrollSalaryPaymentBatchDTO.customerReference
        currentItem['initiatedBy'] =
          payrollSalaryPaymentBatchDTO.securityLevelsDTOList[0]['updater']
        currentItem['status'] = payrollSalaryPaymentBatchDTO.status

        const authorizationPage = new PagedData<any>()
        authorizationPage.data = []
        const page2 = new Page()
        page2.pageNumber = 1
        page2.pageSize = 20
        authorizationPage.page = page2

        authorizationPage.data =
          payrollSalaryPaymentBatchDTO.futureSecurityLevelsDTOList
        authorizationPage.page.totalPages = 1
        authorizationPage.page.totalElements = authorizationPage.data.length
        authorizationPage.page.size = authorizationPage.data.length
        currentItem['authorizationPage'] = authorizationPage

        const employeePage = new PagedData<any>()
        // employeePage.data = [];
        // const page = new Page();
        employeePage.page.pageNumber = 1
        employeePage.page.pageSize = 20

        employeePage.data = payrollSalaryPaymentBatchDTO.selectedEmployeeList
        employeePage.page.totalPages = 1
        employeePage.page.totalElements = employeePage.data.length
        currentItem['employeeData'] = employeePage

        currentItem['salaryPaymentDetailsDTO'] =
          payrollSalaryPaymentBatchDTO.salaryPaymentDetailsDTO
        currentItem['salaryPaymentItem'] = true

        this.currentItem = currentItem
        this.service.setCurrenItem(currentItem)
      }
    })
  }

  onClickPayrollItem(row) {
    //console.log('click onClickPayrollItem');

    this.service.getPayrollsDetail(row).subscribe((result) => {
      if (result.error == true) {
      } else {
        //console.log(result);
        const currentItem = []
        const user = JSON.parse(this.storageService.retrieve('currentUser'))
        //console.log(user);
        currentItem['customerCIC'] = user.company.profileNumber
        currentItem['organizationName'] = user.company.companyName

        const payrollBatchDTO = []
        payrollBatchDTO.push(...result.batchListsContainer.notAllowed)
        payrollBatchDTO.push(...result.batchListsContainer.toProcess)
        payrollBatchDTO.push(...result.batchListsContainer.toAuthorize)

        const payrollUploadBatchDTO =
          payrollBatchDTO.length > 0 ? payrollBatchDTO[0] : {}
        currentItem['accountFrom'] = payrollUploadBatchDTO.accountNumber
        currentItem['paymentDate'] = payrollUploadBatchDTO.paymentDate
        currentItem['batchName'] = payrollUploadBatchDTO.batchName
        currentItem['initiationDate'] = payrollUploadBatchDTO.initiationDate
        currentItem['customerReference'] = payrollUploadBatchDTO.fileReference
        currentItem['initiatedBy'] =
          payrollUploadBatchDTO.securityLevelsDTOList[0]['updater']
        currentItem['status'] = payrollUploadBatchDTO.status
        currentItem['payrollUploadBatchDTO'] = payrollUploadBatchDTO

        const authorizationPage = new PagedData<any>()
        authorizationPage.data = []
        const page2 = new Page()
        page2.pageNumber = 1
        page2.pageSize = 20
        authorizationPage.page = page2

        authorizationPage.data =
          payrollUploadBatchDTO.futureSecurityLevelsDTOList
        authorizationPage.page.totalPages = 1
        authorizationPage.page.totalElements = authorizationPage.data.length
        currentItem['authorizationPage'] = authorizationPage

        const employeePage = new PagedData<any>()
        employeePage.data = []
        const page = new Page()
        page.pageNumber = 1
        page.pageSize = 20
        employeePage.page = page

        employeePage.data = payrollUploadBatchDTO.listEmployees
        employeePage.page.totalPages = 1
        employeePage.page.totalElements =
          payrollUploadBatchDTO.listEmployees.total
        currentItem['employeeData'] = employeePage

        currentItem['salaryPaymentDetailsDTO'] =
          payrollUploadBatchDTO.salaryPaymentDetailsDTO
        currentItem['salaryPaymentItem'] = false
        this.currentItem = currentItem
        this.service.setCurrenItem(currentItem)
      }
    })
  }

  getId(row) {
    return row['batchPk']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }
}
