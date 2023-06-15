import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { interval, Subscription } from 'rxjs'
import { Exception } from '../../../../../Model/exception'
import { SelectedDataService } from '../../../../Accounts/Services/selected-data-service'
import { StaticService } from '../../../../Common/Services/static.service'
import { EmployeeShareService } from '../employee-share.service'
import { ManageEmployeeCompanyService } from '../manage-employee-company.service'
import { ManageEmployeeService } from '../manage-employee.service'

@UntilDestroy()
@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent implements OnInit, OnDestroy {
  step: number
  formEmployees: FormGroup
  employeeInitData: any
  bankList: any
  banks: any
  banksMap: Map<string, string> = new Map<string, string>()
  departments: any

  combosSolicitados: string[] = ['bankCode']
  mensajeError: any = {}
  subscriptions: Subscription[] = []

  validEmployee: any

  selectedAccount: any

  constructor(
    fb: FormBuilder,
    public staticService: StaticService,
    public service: ManageEmployeeService,
    public serviceData: ManageEmployeeCompanyService,
    private router: Router,
    public sharedAcountData: SelectedDataService,
    public translate: TranslateService,
    public employeeShareService: EmployeeShareService,
  ) {
    this.step = 1
    this.selectedAccount = this.sharedAcountData.getModelServiceCurrentAccount()
    this.sharedAcountData.clearModelServiceCurrentAccount()
    this.employeeInitData = this.employeeShareService.getDataInit()
    this.bankList = this.employeeInitData['banksList']
    this.employeeShareService.clearDataInit()
    this.formEmployees = fb.group({
      employees: fb.array([]),
    })
  }

  next() {
    switch (this.step) {
      case 1:
        this.subscriptions.push(
          this.service
            .validEmployees(
              this.formEmployees.value.employees,
              this.employeeInitData.currencyCode,
            )
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
        break
      case 2:
        this.subscriptions.push(
          this.service
            .confirmEmployees(this.validEmployee.employeesList)
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
        this.router.navigate([
          '/wpspayroll/wpspayroll-management/manage-employees',
        ])
        break
    }
  }

  nextStep() {
    this.step = ++this.step % 4
    if (this.step === 0) {
      this.step = 1
    }
  }

  previous() {
    this.step = --this.step % 4
    if (this.step === 0) {
      this.step = 1
    }
  }

  ngOnInit() {
    interval(1000).pipe(untilDestroyed(this)).subscribe()
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
