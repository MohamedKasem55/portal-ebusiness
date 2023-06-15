import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Subscription, interval } from 'rxjs'
import { Exception } from '../../../../../Model/exception'
import { StaticService } from '../../../../Common/Services/static.service'
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

  combosSolicitados: string[] = ['payrollBankCode']
  banks: any

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  selectedEmployee: any

  validEmployee: any

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public service: ManageEmployeeService,
    public serviceData: ManageEmployeeCompanyService,
    private router: Router,
  ) {
    this.step = 1
    this.formEmployees = fb.group({
      employees: fb.array([]),
    })
  }

  isValid() {
    this.formEmployees.markAllAsTouched()
    return (
      this.formEmployees.value.employees.length != 0 && this.formEmployees.valid
    )
  }

  next() {
    switch (this.step) {
      case 1:
        if (this.isValid()) {
          this.subscriptions.push(
            this.service
              .validModifyEmployees(this.formEmployees.value.employees)
              .subscribe((result) => {
                if (result instanceof Exception) {
                  this.onError(result)
                  return
                } else {
                  this.validEmployee = result
                  this.nextStep()
                }
              }),
          )
        }
        break
      case 2:
        if (this.isValid()) {
          this.subscriptions.push(
            this.service
              .modifyEmployees(this.validEmployee.employeesList)
              .subscribe((result) => {
                if (result instanceof Exception) {
                  this.onError(result)
                  return
                } else {
                  this.nextStep()
                }
              }),
          )
        }
        break
      case 3:
        this.serviceData.tableSelectedRows = []
        this.serviceData.clear()
        this.router.navigate(['/payroll/payroll-management/manage-employees'])
        break
    }
  }

  nextStep() {
    this.step = ++this.step % 4
  }

  previous() {
    this.step = --this.step % 4
    if (this.step === 0) {
      this.router.navigate(['/payroll/payroll-management/manage-employees'])
    }
  }

  ngOnInit() {
    interval(1000).pipe(untilDestroyed(this)).subscribe()
    this.selectedEmployee = this.serviceData.getSelectedData()
    for (let i = 0; this.selectedEmployee.length > i; i++) {
      //console.log('create employee');
      this.createEmployeeForm(this.formEmployees, this.selectedEmployee[i])
    }
    this.subscriptions.push(
      this.staticService
        .getAllCombos(this.combosSolicitados)
        .subscribe((result) => {
          const data: any = result

          const bankObject =
            data[this.combosSolicitados.indexOf('payrollBankCode')]['values']
          this.banks = []
          //console.log(bankObject);
          Object.keys(bankObject).map((key, index) => {
            this.banks.push({ key, value: bankObject[key] })
          })
          //console.log(this.banks);
        }),
    )
    //console.log(this.formEmployees);
  }

  createEmployeeForm(form: FormGroup, employee: any) {
    const control = form.controls['employees'] as FormArray
    //console.log('add employee',employee);
    control.push(this.initEmployeeForm(employee))
  }

  initEmployeeForm(employee: any): FormGroup {
    //console.log(employee);
    return this.fb.group({
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
      // employeeName: [employee.name, Validators.compose([Validators.required, Validators.maxLength(50)])],
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
