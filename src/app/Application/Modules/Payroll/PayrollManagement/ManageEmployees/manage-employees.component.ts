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
  @ViewChild('employeePageTable') table: any
  selectedAccount: any

  employeePage: PagedData<any>
  private order: string
  private orderType: string

  file: File
  uploadName: string

  tableSelectedRows: any = []

  isVisiblesError = false
  isCollapsedContent = true

  bank: any
  employeeData: any

  employeeForm: any
  errorDescription

  myForm: FormGroup
  searchForm: FormGroup
  searchFormData: any

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  combosSolicitados: string[] = ['payrollBankCode']
  selectAllOnPage: any = []

  constructor(
    public fb: FormBuilder,
    private service: ManageEmployeeService,
    private serviceData: ManageEmployeeCompanyService,
    public staticService: StaticService,
    public translate: TranslateService,
    public router: Router,
    public sharedAccountData: SelectedDataService,
  ) {
    super()
    this.order = 'civilianId'
    this.orderType = 'desc'
    this.searchForm = this.fb.group({
      employeeNumber: ['', Validators.minLength(2)],
      employeeName: ['', Validators.minLength(10)],
      civilianId: ['', Validators.minLength(4)],
    })
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.employeePage = new PagedData<any>()
    this.employeePage.data = []
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 50
    this.employeePage.page = page
    this.order = 'employeeNumber'
    this.orderType = 'desc'
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
          const data: Object = result
          this.bank =
            data[this.combosSolicitados.indexOf('payrollBankCode')]['values']
        }),
    )
    this.setPage(null)

    if (
      this.serviceData.tableSelectedRows &&
      this.serviceData.tableSelectedRows.length == 0
    ) {
      this.tableSelectedRows = []
    } else {
      this.tableSelectedRows = this.serviceData.tableSelectedRows
      this.serviceData.setSelectedData(this.tableSelectedRows)
    }
    //console.log( this.tableSelectedRows);
  }

  goAddEmployee() {
    this.sharedAccountData.setModelServiceCurrentAccount(this.selectedAccount)
    this.router.navigate([
      '/payroll/payroll-management/manage-employees/addEmployee',
    ])
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
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.employeeData = result
            this.employeePage.page = result.page
            this.employeePage.data = result.data.employeesList
            this.serviceData.setData(result.data.employeesList)
          }
        }),
    )
  }

  getIdFunction() {
    return this.getId.bind(this)
  }
  getId(row) {
    return row['employeePk']
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
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.employeeData = result
            this.employeePage.page = result.page
            this.employeePage.data = result.data.employeesList
            this.serviceData.setData(result.data.employeesList)

            let selectedData = this.serviceData.getSelectedData()
            selectedData = selectedData ? selectedData : []
            this.tableSelectedRows = []
            this.tableSelectedRows = selectedData
            // this.tableSelectedRows.splice(0, selectedData.length);
            // this.tableSelectedRows.push(...selectedData);
            this.serviceData.setSelectedData(this.tableSelectedRows)
            //console.log( '----INIT-----------------');
            //console.log( this.tableSelectedRows);
          }
        }),
    )
  }

  onSelect({ selected }) {
    // Make sure we are no longer selecting all
    //console.log('---select one---');
    //console.log(selected.length);
    this.selectAllOnPage[this.employeePage.page.pageNumber] = false

    this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
    this.tableSelectedRows.push(...selected)
    this.serviceData.setSelectedData(this.tableSelectedRows)
    this.serviceData.tableSelectedRows = this.tableSelectedRows
  }

  selectAll(event) {
    if (!this.selectAllOnPage[this.employeePage.page.pageNumber]) {
      // Unselect all so we dont get duplicates.
      if (this.tableSelectedRows.length > 0) {
        this.employeePage.data.map((employee) => {
          this.tableSelectedRows = this.tableSelectedRows.filter(
            (selected) => selected.employeePk !== employee.employeePk,
          )
        })
      }
      // Select all again
      this.tableSelectedRows.push(...this.employeePage.data)
      this.selectAllOnPage[this.employeePage.page.pageNumber] = true
      //console.log('-----------Select All----');
      //
    } else {
      // Unselect all
      this.employeePage.data.map((employee) => {
        this.tableSelectedRows = this.tableSelectedRows.filter(
          (selected) => selected.employeePk !== employee.employeePk,
        )
      })
      this.selectAllOnPage[this.employeePage.page.pageNumber] = false
      //console.log('-----------UnSelect All');
      //console.log(this.tableSelectedRows)
    }
    this.serviceData.setSelectedData(this.tableSelectedRows)
    this.serviceData.tableSelectedRows = this.tableSelectedRows
  }

  search() {
    this.cleanSelected()
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.subscriptions.push(
      this.service
        .getEmployList(this.searchFormData, 1, this.employeePage.page.pageSize)
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.employeeData = result
            this.employeePage.page = result.page
            this.employeePage.data = result.data.employeesList
            this.serviceData.setData(result.data.employeesList)
          }
        }),
    )
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  cleanSelected() {
    this.tableSelectedRows = []
    this.serviceData.tableSelectedRows = []
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
    this.mensajeError['code'] = res.errorCode
    this.mensajeError['description'] = res.errorDescription
  }

  fileChange(event) {
    const fileList: FileList = event.target.files
    if (fileList.length > 0) {
      this.file = fileList[0]
      this.uploadName = this.file.name
      //
    }
  }
}
