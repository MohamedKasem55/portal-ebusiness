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
  selector: 'app-delete-employee',
  templateUrl: './delete-employee.component.html',
  styleUrls: ['./delete-employee.component.scss'],
})
export class DeleteEmployeeComponent implements OnInit, OnDestroy {
  step: number
  formEmployees: FormGroup

  combosSolicitados: string[] = ['payrollBankCode']
  banks: any

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  selectedEmployee: any

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public service: ManageEmployeeService,
    public serviceData: ManageEmployeeCompanyService,
    private router: Router,
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
        this.serviceData.tableSelectedRows = []
        this.serviceData.clear()
        this.router.navigate(['/payroll/payroll-management/manage-employees'])
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
      this.router.navigate(['/payroll/payroll-management/manage-employees'])
    }
  }

  ngOnInit() {
    interval(1000).pipe(untilDestroyed(this)).subscribe()
    this.selectedEmployee = this.serviceData.getSelectedData()

    for (let i = 0; this.selectedEmployee.length > i; i++) {
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
          Object.keys(bankObject).map((key, index) => {
            this.banks.push({ key, value: bankObject[key] })
          })
        }),
    )
  }

  createEmployeeForm(form: FormGroup, employee: any) {
    const control = form.controls['employees'] as FormArray
    control.push(this.initEmployeeForm(employee))
  }

  initEmployeeForm(employee: any): FormGroup {
    return this.fb.group({
      employeeNumber: [
        employee.employeeReference,
        Validators.compose([Validators.required, Validators.maxLength(12)]),
      ],
      employeeName: [
        employee.name,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      civilianId: [
        employee.civilianId,
        Validators.compose([Validators.required, Validators.maxLength(15)]),
      ],
      bank: [employee.bankCode, Validators.required],
      account: [
        employee.account,
        Validators.compose([Validators.required, Validators.maxLength(24)]),
      ],
      salary: [
        employee.salary,
        Validators.compose([Validators.required, Validators.maxLength(15)]),
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
