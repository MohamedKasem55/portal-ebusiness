import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { Exception } from '../../../../Model/exception'
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'
import { SelectedDataService } from '../../../Accounts/Services/selected-data-service'
import { StaticService } from '../../../Common/Services/static.service'
import { EmployeeShareService } from './employee-share.service'
import { ManageEmployeeCompanyService } from './manage-employee-company.service'
import { ManageEmployeeService } from './manage-employee.service'

@Component({
  selector: 'app-manage-employees',
  templateUrl: './manage-employees.component.html',
  styleUrls: ['./manage-employees.component.scss'],
})
export class ManageEmployeesComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('employeePageTable', { static: true }) table: any

  auxData = []
  selectedAccount: any

  employeePage: PagedData<any>
  private order: string
  private orderType: string

  file: File
  uploadName: string

  tableSelectedRows: any = []

  isVisiblesError = false
  isCollapsedContent = true

  bank: any = []
  employeeData: any

  employeeForm: any
  errorDescription

  myForm: FormGroup
  searchForm: FormGroup
  searchFormData: any

  mensajeError: any = {}
  subscriptions: Subscription[] = []
  selectAllOnPage: any = []

  combosSolicitados: string[] = [
    'bankCodeConversion',
    'bankCode',
    'payrollBankCode',
  ]

  constructor(
    public fb: FormBuilder,
    private service: ManageEmployeeService,
    private serviceData: ManageEmployeeCompanyService,
    public staticService: StaticService,
    public translate: TranslateService,
    public router: Router,
    public sharedAccountData: SelectedDataService,
    public employeeShareService: EmployeeShareService,
  ) {
    super()
    this.searchForm = this.fb.group({
      employeeNumber: ['', Validators.minLength(2)],
      employeeName: ['', Validators.minLength(10)],
      civilianId: ['', Validators.minLength(4)],
      departmentId: [''],
    })
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.employeePage = new PagedData<any>()
    this.employeePage.data = []
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 50
    this.employeePage.page = page
    this.order = 'employeeReference'
    this.orderType = 'desc'
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    this.selectedAccount =
      this.sharedAccountData.getModelServiceCurrentAccount()
    this.sharedAccountData.clearModelServiceCurrentAccount()
    this.subscriptions.push(
      this.staticService
        .getAllCombos(this.combosSolicitados)
        .subscribe((result) => {
          //console.log("Combos: ", result);
          const data: Object = result
          this.bank = Object.assign(
            data[this.combosSolicitados.indexOf('bankCode')]['values'],
            data[this.combosSolicitados.indexOf('payrollBankCode')]['values'],
          )
          this.auxData['bankCodePayroll'] = this.bank
        }),
    )
    this.setPage(null)

    console.log(this.serviceData.selectedData)
    if (
      this.serviceData.selectedData &&
      typeof this.serviceData.selectedData != 'undefined' &&
      this.serviceData.selectedData.length > 0
    ) {
      this.tableSelectedRows = this.serviceData.selectedData
    } else {
      this.tableSelectedRows = []
    }
  }

  goAddEmployee() {
    this.subscriptions.push(
      this.service.initEmployee().subscribe((result) => {
        if (
          result.hasOwnProperty('error') &&
          (<any>result).error instanceof Exception
        ) {
          this.onError(result)
          return
        } else {
          this.employeeShareService.setDataInit(result)
          this.employeeShareService.setDepartments(
            this.employeeData['departments'],
          )
          this.sharedAccountData.setModelServiceCurrentAccount(
            this.selectedAccount,
          )
          this.router.navigate([
            '/wpspayroll/wpspayroll-management/manage-employees/addEmployee',
          ])
        }
      }),
    )
  }

  goDetail(employee) {
    this.tableSelectedRows = []
    this.tableSelectedRows.push(employee)
    this.serviceData.setSelectedData(this.tableSelectedRows)
    this.goModifyEmployee()
  }

  goModifyEmployee() {
    this.subscriptions.push(
      this.service.initModifyEmployee().subscribe((result) => {
        if (
          result.hasOwnProperty('error') &&
          (<any>result).error instanceof Exception
        ) {
          this.onError(result)
          return
        } else {
          this.employeeShareService.setDataInit(result)
          this.employeeShareService.setDepartments(
            this.employeeData['departments'],
          )
          this.router.navigate([
            '/wpspayroll/wpspayroll-management/manage-employees/modifyEmployee',
          ])
        }
      }),
    )
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    this.employeePage.page.pageNumber = dataTableEvent.offset
    this.subscriptions.push(
      this.service
        .getEmployList(
          this.searchFormData,
          this.employeePage.page.pageNumber + 1,
          this.employeePage.page.pageSize,
          this.order,
          this.orderType,
        )
        .subscribe((result) => {
          if (
            result.hasOwnProperty('error') &&
            (<any>result).error instanceof Exception
          ) {
            this.onError(result)
            return
          } else {
            this.employeeData = result
            this.employeePage.page = result.page
            this.employeePage.data = result.data
            this.transformLongNameText()
          }
        }),
    )
  }

  setSort(dataTableEvent) {
    if (dataTableEvent.sorts[0]) {
      this.order = dataTableEvent.sorts[0].prop
      this.orderType = dataTableEvent.sorts[0].dir
    }

    this.employeePage.page.pageNumber = 1

    this.subscriptions.push(
      this.service
        .getEmployList(
          this.searchFormData,
          this.employeePage.page.pageNumber,
          this.employeePage.page.pageSize,
          this.order,
          this.orderType,
        )
        .subscribe((result) => {
          if (
            result.hasOwnProperty('error') &&
            (<any>result).error instanceof Exception
          ) {
            this.onError(result)
            return
          } else {
            this.employeeData = result
            this.employeePage.page = result.page
            this.employeePage.data = result.data
            this.transformLongNameText()
          }
        }),
    )
  }

  // onSelect({ selected }) {
  //   this.tableSelectedRows = [];
  //   this.tableSelectedRows.splice(0, selected.length);
  //   this.tableSelectedRows.push(...selected);
  //   this.serviceData.setSelectedData(this.tableSelectedRows);
  //   return this.tableSelectedRows;
  // }

  onSelect({ selected }) {
    // Make sure we are no longer selecting all

    this.selectAllOnPage[this.employeePage.page.pageNumber] = false

    this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
    this.tableSelectedRows.push(...selected)
    this.serviceData.setSelectedData(this.tableSelectedRows)
  }

  selectAll(event) {
    if (!this.selectAllOnPage[this.employeePage.page.pageNumber]) {
      // Unselect all so we dont get duplicates.
      if (this.tableSelectedRows.length > 0) {
        this.employeePage.data.map((bill) => {
          this.tableSelectedRows = this.tableSelectedRows.filter(
            (selected) => this.getId(selected) !== this.getId(bill),
          )
        })
      }
      // Select all again
      this.tableSelectedRows.push(...this.employeePage.data)
      this.selectAllOnPage[this.employeePage.page.pageNumber] = true
      // console.log('-----------Select All----');
      // console.log(this.tableSelected);
    } else {
      // Unselect all
      this.employeePage.data.map((bill) => {
        this.tableSelectedRows = this.tableSelectedRows.filter(
          (selected) => this.getId(selected) !== this.getId(bill),
        )
      })
      this.selectAllOnPage[this.employeePage.page.pageNumber] = false
      // console.log('-----------UnSelect All');
      // console.log(this.tableSelected)
    }
    this.serviceData.setSelectedData(this.tableSelectedRows)
  }

  search() {
    this.cleanSelected()
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.subscriptions.push(
      this.service
        .getEmployList(
          this.searchFormData,
          1,
          this.employeePage.page.pageSize,
          this.order,
          this.orderType,
        )
        .subscribe((result) => {
          if (
            result.hasOwnProperty('error') &&
            (<any>result).error instanceof Exception
          ) {
            this.onError(result)
            return
          } else {
            this.employeeData = result
            this.employeePage.page = result.page
            this.employeePage.data = result.data
            this.employeeShareService.setDepartments(result['departments'])
            this.serviceData.setData(result.data)
            this.transformLongNameText()
          }
        }),
    )
  }

  cleanSelected() {
    this.serviceData.selectedData = []
    this.tableSelectedRows = []
  }

  reset() {
    this.searchForm.reset()
    this.search()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
    //console.log(res.error);
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  fileChange(event) {
    const fileList: FileList = event.target.files
    if (fileList.length > 0) {
      this.file = fileList[0]
      this.uploadName = this.file.name
      //
    }
  }

  getId(row) {
    return row['employeePk']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  transformLongNameText() {
    if (this.employeePage && this.employeePage.data) {
      for (const item of this.employeePage.data) {
        item.nameWrapped = this.wrapText(item.name)
      }
    }
  }

  wrapText(text: string): string {
    if (text == null || text.length == 0) {
      return ''
    }
    const limitLong = 30
    if (
      text.length > limitLong &&
      text.indexOf(' ') == -1 &&
      text.indexOf('.') == -1
    ) {
      // result = text.splice(40, 0, " ");
      const output = [
        text.slice(0, limitLong),
        ' ',
        text.slice(limitLong),
      ].join('')
      return output
    } else {
      return text
    }
  }
}
