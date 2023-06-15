import { Component, OnDestroy, OnInit } from '@angular/core'
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms'
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
  selector: 'app-modify-employee',
  templateUrl: './modify-employee.component.html',
  styleUrls: ['./modify-employee.component.scss'],
})
export class ModifyEmployeeComponent implements OnInit, OnDestroy {
  step: number
  formEmployees: FormGroup
  employeeInitData: any
  banksList: any

  banks: any
  banksMap: Map<string, string> = new Map<string, string>()
  departments: any

  mensajeError: any = {}
  subscriptions: Subscription[] = []
  combosSolicitados: string[] = ['bankCode']
  selectedEmployee: any

  validEmployee: any

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public service: ManageEmployeeService,
    public serviceData: ManageEmployeeCompanyService,
    private router: Router,
    public translate: TranslateService,
    public employeeShareService: EmployeeShareService,
  ) {
    this.step = 1
    this.formEmployees = fb.group({
      employees: fb.array([]),
    })
  }

  next() {
    switch (this.step) {
      case 1:
        //console.log(this.formEmployees.value.employees);
        this.subscriptions.push(
          this.service
            .validModifyEmployees(
              this.formEmployees.value.employees,
              this.employeeInitData.currencyCode,
            )
            .subscribe((result: any) => {
              if (
                result.hasOwnProperty('error') &&
                result.error instanceof Exception
              ) {
                this.onError(result)
                return
              } else {
                this.validEmployee = result
                this.nextStep()
              }
            }),
        )
        break
      case 2:
        this.subscriptions.push(
          this.service
            .confirmModifyEmployees(this.validEmployee.employeesList)
            .subscribe((result: any) => {
              if (
                result.hasOwnProperty('error') &&
                result.error instanceof Exception
              ) {
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
  }

  previous() {
    this.step = --this.step % 4
    if (this.step === 0) {
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

    this.employeeInitData = this.employeeShareService.getDataInit()
    this.banksList = this.employeeInitData['banksList']
    this.employeeShareService.clearDataInit()
    const departmentsObject = this.employeeShareService.getDepartments()
    this.employeeShareService.clearDepartments()

    for (let i = 0; this.selectedEmployee.length > i; i++) {
      //console.log('create employee');
      this.createEmployeeForm(this.formEmployees, this.selectedEmployee[i])
    }
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
    //console.log('add employee',employee);
    const formEmployee = this.fb.group({
      employeeNumber: [
        employee.employeeReference,
        Validators.compose([Validators.required, Validators.maxLength(12)]),
      ],
      employeeName: [
        employee.name,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(
            '^[A-Za-z s\u0600-\u06ff\u0750-\u077f\ufb50-\ufc3f\ufe70-\ufefc]+$',
          ),
        ]),
      ],
      civilianId: [
        employee.civilianId,
        Validators.compose([
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern('^[0-9]*$'),
        ]),
      ],
      bank: [employee.bankCode, Validators.required],
      account: [
        employee.account,
        Validators.compose([
          Validators.required,
          Validators.maxLength(24),
          Validators.pattern('^[a-zA-Z]{2}[0-9a-zA-Z]*$'),
        ]),
      ],
      salary: [
        employee.salary,
        Validators.compose([
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern('^[0-9]*.?[0-9]*$'),
        ]),
      ],
      employ: employee,
      bankBranchCode: employee.bankBranchCode,
      bankBranchName: employee.bankBranchName,
      departmentId: employee.departmentId,
      salaryBasic: employee.salaryBasic
        ? employee.salaryBasic
        : employee.salary,
      allowanceHousing: employee.allowanceHousing,
      allowanceOther: employee.allowanceOther,
      deductions: employee.deductions,
      employeeReferenceOLD: employee.employeeReference,
      civilianIdOLD: employee.civilianId,
      accountOLD: employee.account,
    })
    this.initEmployeeForm(formEmployee)
    control.push(formEmployee)
  }

  initEmployeeForm(formEmployee: FormGroup): FormGroup {
    formEmployee.controls.account.valueChanges.subscribe((value) => {
      const bankCode = value.length > 6 ? '0' + value.substring(4, 6) : ''
      formEmployee.controls.bank.setValue(bankCode)
    })

    formEmployee.controls.salaryBasic.valueChanges.subscribe((value) => {
      this.applySalaryInEmployeeForm(formEmployee)
    })
    formEmployee.controls.allowanceHousing.valueChanges.subscribe((value) => {
      this.applySalaryInEmployeeForm(formEmployee)
    })
    formEmployee.controls.allowanceOther.valueChanges.subscribe((value) => {
      this.applySalaryInEmployeeForm(formEmployee)
    })
    formEmployee.controls.deductions.valueChanges.subscribe((value) => {
      this.applySalaryInEmployeeForm(formEmployee)
    })
    formEmployee.setValidators(this.addCustomValidatorsToEmployeeForm())
    return formEmployee
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

  applySalaryInEmployeeForm(employeeForm) {
    const salaryValue = this.calculateSalaryForEmployeeForm(employeeForm)
    employeeForm.controls.salary.setValue(salaryValue)
  }

  calculateSalaryForEmployeeForm(employeeForm) {
    let salaryValue =
      Math.round(Number(employeeForm.controls.salaryBasic.value) * 100) / 100 +
      Math.round(Number(employeeForm.controls.allowanceHousing.value) * 100) /
        100 +
      Math.round(Number(employeeForm.controls.allowanceOther.value) * 100) /
        100 -
      Math.round(Number(employeeForm.controls.deductions.value) * 100) / 100
    salaryValue = Math.round(salaryValue * 100) / 100
    return salaryValue
  }

  isValidSalaryOfEmployee(employeeForm): boolean {
    const salaryValue = this.calculateSalaryForEmployeeForm(employeeForm)
    return Number(employeeForm.controls.salary.value) == salaryValue
  }

  addCustomValidatorsToEmployeeForm(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const salaryControl = group.controls['salary']
      const valid = this.isValidSalaryOfEmployee(group)
      if (!valid) {
        salaryControl.setErrors({ notEquivalent: true })
      } else {
        salaryControl.setErrors(null)
      }
      return
    }
  }

  get employees(): FormGroup[] {
    return this.formEmployees.controls['employees']['controls']
  }
}
