import {
  AfterViewInit,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../../core/storage/storage.service'
import { HijraDateFormatPipe } from '../../../../Components/common/Pipes/hijra-date-format-pipe'
import { Exception } from '../../../../Model/exception'
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'
import { SelectedDataService } from '../../../Accounts/Services/selected-data-service'
import { StaticService } from '../../../Common/Services/static.service'
import { ManageEmployeeService } from '../ManageEmployees/manage-employee.service'
import { SalaryPaymentsService } from './salary-payments.service'
import { WpsPayrollService } from '../../../NewProduct/WpsPayrollNew/wps-payroll-new.service'

@Component({
  selector: 'app-salary-payments-step1',
  templateUrl: './salary-payments-step1.component.html',
  styleUrls: ['./salary-payments.component.scss'],
})
export class SalaryPaymentsStep1Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('employeePageTable', { static: true }) table: any

  @Input() formSalary: FormGroup
  @Input() bank: any
  @Input() accounts: any
  @Input() tableSelectedRows: any

  propous: any
  employeePage: PagedData<any>
  private order: string
  private orderType: string

  payrollDetails: any
  employeeData: any

  bsConfig: any

  isCollapsedContent = true
  searchForm: FormGroup
  searchFormData: any

  combosSolicitados: string[] = ['payrollBankCode', 'payrollPaymentPurpose']

  selectedAccount: any
  hijri
  selectAllOnPage: any = []

  juridicalState: string

  constructor(
    private fb: FormBuilder,
    public service: SalaryPaymentsService,
    public storageService: StorageService,
    public serviceEmployee: ManageEmployeeService,
    public staticService: StaticService,
    public translate: TranslateService,
    public router: Router,
    public sharedAccountData: SelectedDataService,
    private injector: Injector,
    private wpsPayrollService: WpsPayrollService
  ) {
    super()
    this.searchForm = this.fb.group({
      employeeNumber: '',
      employeeName: '',
      civilianId: '',
    })

    this.employeePage = new PagedData<any>()
    this.employeePage.data = []
    const page = new Page()
    page.pageNumber = 0
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
    const hijra = new HijraDateFormatPipe(this.injector)
    this.selectedAccount =
      this.sharedAccountData.getModelServiceCurrentAccount()
    this.sharedAccountData.clearModelServiceCurrentAccount()
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.subscriptions.push(
      this.formSalary.controls['valueDate'].valueChanges.subscribe((values) => {
        this.formSalary.controls['hijraDate'].setValue(
          hijra.transform(values, 'dd/MM/yyyy'),
        )
      }),
    )
    this.subscriptions.push(
      this.translate.onLangChange.subscribe((res) => {
        this.formSalary.controls['hijraDate'].setValue(
          hijra.transform(
            this.formSalary.controls['valueDate'].value,
            'dd/MM/yyyy',
          ),
        )
      }),
    )
    this.subscriptions.push(
      this.staticService
        .getAllCombos(this.combosSolicitados)
        .subscribe((result) => {
          const data: Object = result
          this.bank =
            data[this.combosSolicitados.indexOf('payrollBankCode')]['values']
          // const propuoses =
          //   data[this.combosSolicitados.indexOf('payrollPaymentPurpose')][
          //     'values'
          //     ]
          this.propous = []
          this.translate.get('wpspayroll.payroll').subscribe((result) => {
            this.propous.push({ key: 'PAYR', value: result })
          })
          // Object.keys(propuoses).map((key, index) => {
          //   this.propous.push({ key, value: propuoses[key] })
          // })
        }),
    )

    this.formSalary.controls.paymentPurpose.setValue('PAYR')
    this.formSalary.controls.paymentPurpose.disable()

    this.subscriptions.push(
      this.service.initSalaryPayment().subscribe((result) => {
        if (result instanceof Exception) {
          this.onError(result)
          return
        } else {

          this.juridicalState = result.juridicalState
          if (this.juridicalState === '0014') {
            this.formSalary.controls.paymentPurpose.enable()
            this.translate.get('wpspayroll.charity').subscribe((result) => {
              this.propous.push({ key: 'PCHA', value: result })
            })
          }

          //Esperar a que vengan las cuentas
          this.accounts = this.extractAccountKeyValue(result.accountList)

          if (this.selectedAccount) {
            this.formSalary.controls['accountFrom'].patchValue(
              this.getAccountSelected(this.selectedAccount),
            )
          }
          this.payrollDetails = result.salaryPaymentDetails
          this.formSalary.controls.molId.setValue(this.payrollDetails.molId)
          if (
            this.payrollDetails.customerReference &&
            this.payrollDetails.customerReference != ''
          ) {
            this.formSalary.controls.customerReference.setValue(
              this.payrollDetails.customerReference,
            )
          }
        }
      }),
    )

    this.setPage(null)

    const user = JSON.parse(this.storageService.retrieve('currentUser'))
    this.formSalary.controls.customerCIC.setValue(user.company.profileNumber)
    this.formSalary.controls.organizationName.setValue(user.company.companyName)
  }

  ngAfterViewInit(): void {
    const company = this.storageService.retrieve('company')
    this.formSalary.get('molId').patchValue(company.wpsMolEstbid)
  }

  canShowSelectPlaceHolder(field) {
    if (field == null) {
      return true
    }
  }

  findUser(users) {
    const rows = []
    let selected = false
    for (let i = 0; i < users.length; ++i) {
      selected = false
      for (let j = 0; j < this.employeePage.data.length; ++j) {
        if (users[i].employeePk === this.employeePage.data[j].employeePk) {
          rows.push(this.employeePage.data[j])
          selected = true
          break
        }
      }
      if (!selected) {
        rows.push(users[i])
      }
    }
    return rows
  }

  selectRows(rows: any[]) {
    this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
    this.tableSelectedRows.push(...rows)
  }

  extractAccountKeyValue(account: any) {
    const accountKeyValue = []
    for (let i = 0; account.length > i; i++) {
      accountKeyValue.push({ key: i, value: account[i] })
    }
    return accountKeyValue
  }

  getAccountSelected(account) {
    if (account) {
      for (let i = this.accounts.length - 1; i >= 0; i--) {
        if (
          this.accounts[i].value.fullAccountNumber == account.fullAccountNumber
        ) {
          return this.accounts[i].key
        }
      }
    }
    return
  }

  updateRemark(event, row) {
    const value = event.target.value
    //this.employeePage.page[row]['remarks'] = value;
    if (value) {
      for (let i = this.employeePage.data.length - 1; i >= 0; i--) {
        if (this.employeePage.data[i].civilianId == row.civilianId) {
          this.employeePage.data[i].remarks = value
          break
        }
      }
    }
  }

  search() {
    this.tableSelectedRows = []
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.subscriptions.push(
      this.serviceEmployee
        .getEmployList(
          this.searchFormData,
          1,
          this.employeePage.page.pageSize,
          this.order,
          this.orderType,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.employeeData = result
            this.employeePage.page = result.page
            this.employeePage.data = result.data
            this.employeePage.data.forEach((item, i) => {
              item['bankCodeName'] = this.bank[item['bankCode']]
            })
          }
        }),
    )
  }

  reset() {
    this.tableSelectedRows = []
    this.searchForm.reset()
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.subscriptions.push(
      this.serviceEmployee
        .getEmployList(
          this.searchFormData,
          1,
          this.employeePage.page.pageSize,
          this.order,
          this.orderType,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.employeeData = result
            this.employeePage.page = result.page
            this.employeePage.data = result.data
            this.employeePage.page.pageNumber =
              this.employeePage.page.pageNumber
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
      this.serviceEmployee
        .getEmployList(
          this.searchFormData,
          this.employeePage.page.pageNumber + 1,
          this.employeePage.page.pageSize,
          this.order,
          this.orderType,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.employeeData = result
            this.employeePage.page = result.page
            this.employeePage.data = result.data

            if (this.tableSelectedRows.length > 0) {
              this.selectRows(this.findUser(this.tableSelectedRows))
            }
          }
        }),
    )
  }

  setSort(dataTableEvent) {
    if (dataTableEvent.sorts[0]) {
      this.order = dataTableEvent.sorts[0].prop
      this.orderType = dataTableEvent.sorts[0].dir
    }

    this.employeePage.page.pageNumber = 0

    this.subscriptions.push(
      this.serviceEmployee
        .getEmployList(
          this.searchFormData,
          this.employeePage.page.pageNumber + 1,
          this.employeePage.page.pageSize,
          this.order,
          this.orderType,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.employeeData = result
            this.employeePage.page = result.page
            this.employeePage.data = result.data
          }
        }),
    )
  }

  // onSelect({selected}) {
  //     this.tableSelectedRows = [];
  //     //
  //     this.tableSelectedRows.splice(0, selected.length);
  //     this.tableSelectedRows.push(...selected);
  //     return this.tableSelectedRows;
  // }

  onSelect({ selected }) {
    // Make sure we are no longer selecting all
    this.selectAllOnPage[this.employeePage.page.pageNumber] = false

    this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
    this.tableSelectedRows.push(...selected)
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
    } else {
      // Unselect all
      this.employeePage.data.map((bill) => {
        this.tableSelectedRows = this.tableSelectedRows.filter(
          (selected) => this.getId(selected) !== this.getId(bill),
        )
      })
      this.selectAllOnPage[this.employeePage.page.pageNumber] = false
    }
  }

  isValidSalaryRow(row) {
    return (
     +(parseFloat(row.salaryBasic ? row.salaryBasic : row.salary) +
        parseFloat(row.allowanceHousing ? row.allowanceHousing : 0) +
        parseFloat(row.allowanceOther ? row.allowanceOther : 0) -
        parseFloat(row.deductions ? row.deductions : 0)).toFixed(2) ==
      parseFloat(row.salary)
    )
  }

  isSelectedRow(row) {
    let selected = false
    this.tableSelectedRows.forEach((s) => {
      if (this.getId(s) == this.getId(row)) {
        selected = true
      }
    })
    return selected
  }

  allSelectedRowsAreValid() {
    let valid = true
    if (this.tableSelectedRows && this.tableSelectedRows.length > 0) {
      this.tableSelectedRows.forEach((row) => {
        valid = valid && this.isValidSalaryRow(row)
      })
    }
    return valid
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row)
  }

  onError(error: any) {
  }

  getId(row) {
    return row['employeePk']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }


}
