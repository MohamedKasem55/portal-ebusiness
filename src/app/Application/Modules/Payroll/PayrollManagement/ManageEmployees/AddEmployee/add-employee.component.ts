import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription, interval } from 'rxjs'
import { Exception } from '../../../../../Model/exception'
import { SelectedDataService } from '../../../../Accounts/Services/selected-data-service'
import { StaticService } from '../../../../Common/Services/static.service'
import { ManageEmployeeCompanyService } from '../manage-employee-company.service'
import { ManageEmployeeService } from '../manage-employee.service'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss'],
})
export class AddEmployeeComponent implements OnInit, OnDestroy {
  step: number
  formEmployees: FormGroup

  combosSolicitados: string[] = ['payrollBankCode']
  banks: any

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  validEmployee: any

  selectedAccount: any

  constructor(
    fb: FormBuilder,
    public staticService: StaticService,
    public service: ManageEmployeeService,
    public serviceData: ManageEmployeeCompanyService,
    public translate: TranslateService,
    private router: Router,
    public sharedAcountData: SelectedDataService,
  ) {
    this.step = 1
    this.selectedAccount = this.sharedAcountData.getModelServiceCurrentAccount()
    this.sharedAcountData.clearModelServiceCurrentAccount()
    this.formEmployees = fb.group({
      employees: fb.array([
        fb.group({
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
              Validators.maxLength(15),
              Validators.pattern('^[0-9]*$'),
            ]),
          ],
          bank: [null, Validators.required],
          account: [
            this.selectedAccount ? this.selectedAccount.ibanNumber : null,
            Validators.compose([
              Validators.required,
              Validators.maxLength(24),
              Validators.pattern('^[a-zA-Z]{2}[0-9a-zA-Z]*$'),
            ]),
          ],
          salary: [
            null,
            Validators.compose([
              Validators.required,
              Validators.maxLength(15),
              Validators.pattern('^[0-9]*.?[0-9]*$'),
            ]),
          ],
        }),
      ]),
    })
  }

  next() {
    switch (this.step) {
      case 1:
        this.subscriptions.push(
          this.service
            .addEmployees(this.formEmployees.value.employees)
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
            .saveEmployees(this.validEmployee.employeesList)
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
        this.router.navigate(['/payroll/payroll-management'])
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
    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event) => {
        this.refreshData()
      }),
    )
    this.refreshData()
  }

  refreshData() {
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

  get employees(): FormGroup[] {
    return this.formEmployees.controls['employees']['controls']
  }
}
