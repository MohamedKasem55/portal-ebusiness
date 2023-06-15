import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Subscription, interval } from 'rxjs'
import { Exception } from '../../../../../Model/exception'
import { StaticService } from '../../../../Common/Services/static.service'
import { EmployeeShareService } from '../employee-share.service'
import { ManageEmployeeCompanyService } from '../manage-employee-company.service'
import { ManageEmployeeService } from '../manage-employee.service'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'app-delete-employee',
  templateUrl: './delete-employee.component.html',
  styleUrls: ['./delete-employee.component.scss'],
})
export class DeleteEmployeeComponent implements OnInit, OnDestroy {
  step: number
  formEmployees: FormGroup

  combosSolicitados: string[] = ['bankCode']
  banks: any
  banksMap: Map<string, string> = new Map<string, string>()
  departments: any

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  selectedEmployee: any

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public service: ManageEmployeeService,
    public serviceData: ManageEmployeeCompanyService,
    private router: Router,
    public translate: TranslateService,
    public employeeShareService: EmployeeShareService,
  ) {
    this.step = 2
    this.formEmployees = fb.group({
      employees: fb.array([]),
    })
  }

  next() {
    switch (this.step) {
      case 2:
        this.subscriptions.push(
          this.service
            .deleteEmployees(this.formEmployees.value.employees)
            .subscribe((result) => {
              if (result instanceof Exception) {
                this.onError(result)
                return
              } else {
                this.nextStep()
              }
            }),
        )
        break
      case 3:
        this.serviceData.clear()
        this.router.navigate([
          '/wpspayroll/wpspayroll-management/manage-employees',
        ])
        break
    }
  }

  nextStep() {
    this.step = ++this.step % 4
    if (this.step === 1) {
      this.step = 2
    }
  }

  previous() {
    this.step = --this.step % 4
    if (this.step === 1) {
      this.router.navigate([
        '/wpspayroll/wpspayroll-management/manage-employees',
      ])
    }
  }

  ngOnInit() {
    interval(1000).pipe(untilDestroyed(this)).subscribe()
    this.selectedEmployee = this.serviceData.getSelectedData()

    if (!this.selectedEmployee || this.selectedEmployee.length == 0) {
      this.router.navigate([
        '/wpspayroll/wpspayroll-management/manage-employees',
      ])
    }

    for (let i = 0; this.selectedEmployee.length > i; i++) {
      this.createEmployeeForm(this.formEmployees, this.selectedEmployee[i])
    }
    //console.log('banks',this.banks);
    const departmentsObject = this.employeeShareService.getDepartments()
    this.employeeShareService.clearDepartments()
    for (const depart of departmentsObject) {
      this.departments.push({ key: depart.key, value: depart.value })
    }
    this.cargarCombos()
    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.cargarCombos()
      }),
    )
  }

  cargarCombos() {
    this.subscriptions.push(
      this.staticService
        .getAllCombos(this.combosSolicitados)
        .subscribe((result) => {
          const data: any = result

          const bankObject2 =
            data[this.combosSolicitados.indexOf('bankCode')]['values']
          this.banks = []
          //console.log(bankObject);
          Object.keys(bankObject2).map((key, index) => {
            this.banks.push({ key, value: bankObject2[key] })
          })
          for (let i = this.banks.length - 1; i >= 0; i--) {
            this.banksMap.set(this.banks[i].key, this.banks[i].value)
          }
        }),
    )
  }

  createEmployeeForm(form: FormGroup, employee: any) {
    const control = form.controls['employees'] as FormArray
    control.push(this.initEmployeeForm(employee))
  }

  initEmployeeForm(employee: any): FormGroup {
    //console.log('creo formulario',employee);
    return this.fb.group({
      employeeNumber: [employee.employeeReference],
      employeeName: [employee.name],
      civilianId: [employee.civilianId],
      bank: [employee.bankCode],
      account: [employee.account],
      salary: [employee.salary],
      bankBranchCode: employee.bankBranchCode,
      bankBranchName: employee.bankBranchName,
      departmentId: employee.departmentId,
      salaryBasic: employee.salaryBasic,
      allowanceHousing: employee.allowanceHousing,
      allowanceOther: employee.allowanceOther,
      deductions: employee.deductions,
      employ: employee,
    })
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

  get employees(): FormGroup[] {
    return this.formEmployees.controls['employees']['controls']
  }
}
