import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { SelectedDataService } from '../../../../Accounts/Services/selected-data-service'

@Component({
  selector: 'app-add-employee-step1',
  templateUrl: './add-employee-step1.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeStep1Component implements OnInit, OnDestroy {
  @Input() form: FormGroup
  @Input() banksMap: any
  @Input() departments
  @Input() bankList: any
  mensajeError: any = {}
  subscriptions: Subscription[] = []

  @Input() selectedAccount: any

  constructor(
    private fb: FormBuilder,
    public sharedAcountData: SelectedDataService,
    public router: Router,
  ) {}

  ngOnInit() {
    if (!((<FormArray>this.form.controls['employees']).length > 0)) {
      this.addEmployee()
    }
  }

  createEmployeeForm(form: FormGroup) {
    const control = <FormArray>form.controls['employees']
    const formEmployee = this.fb.group({
      employeeNumber: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(12),
          Validators.pattern('^[0-9]*$'),
        ]),
      ],
      employeeName: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(
            '^[A-Za-z s\u0600-\u06ff\u0750-\u077f\ufb50-\ufc3f\ufe70-\ufefc]+$',
          ),
        ]),
      ],
      civilianId: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern('^[0-9]*$'),
        ]),
      ],
      bank: [null, Validators.required],
      account: [
        this.selectedAccount ? this.selectedAccount.ibanNumber : null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(24),
          Validators.pattern('^[a-zA-Z][0-9a-zA-Z]*$'),
        ]),
      ],
      salary: [
        null,
        Validators.compose([Validators.pattern('^[0-9]*.?[0-9]*$')]),
      ],
      bankBranchCode: [null],
      bankBranchName: [null],
      departmentId: [null],
      salaryBasic: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(16),
          Validators.pattern('^[0-9]{0,13}(.[0-9]{0,2})?$'),
        ]),
      ],
      allowanceHousing: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(16),
          Validators.pattern('^[0-9]{0,13}(.[0-9]{0,2})?$'),
        ]),
      ],
      allowanceOther: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(16),
          Validators.pattern('^[0-9]{0,13}(.[0-9]{0,2})?$'),
        ]),
      ],
      deductions: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(16),
          Validators.pattern('^[0-9]{0,13}(.[0-9]{0,2})?$'),
        ]),
      ],
    })
    this.initEmployeeForm(formEmployee)
    control.push(formEmployee)
  }

  initEmployeeForm(formEmployee: FormGroup) {
    formEmployee.controls.account.valueChanges.subscribe((value) => {
      const bankCode = value.length > 6 ? '0' + value.substring(4, 6) : ''
      const bank = this.bankList.find((elem) => {
        return +elem['bankCode'] === +bankCode
      })
      if (bank !== undefined) {
        formEmployee.controls.bank.patchValue(bank['bankName'])
      } else if (bank === '' || bank === undefined) {
        formEmployee.controls.bank.patchValue(null)
      }
    })
    //basic salary + housing  + others – deductions
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

  addEmployee() {
    this.createEmployeeForm(this.form)
  }

  removeEmployee(index) {
    const employeesForms = <FormArray>this.form.controls['employees']
    employeesForms.removeAt(index)
    if (employeesForms.length == 0) {
      this.router.navigate([
        '/wpspayroll/wpspayroll-management/manage-employees',
      ])
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
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
}
