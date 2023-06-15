import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
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
  @Input() banks: any

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  @Input() selectedAccount: any

  constructor(
    private fb: FormBuilder,
    public sharedAcountData: SelectedDataService,
    public router: Router,
  ) {}

  ngOnInit() {}

  createEmployeeForm(form: FormGroup) {
    const control = form.controls['employees'] as FormArray
    control.push(this.initEmployeeForm())
  }

  get employees(): FormGroup[] {
    return this.form.controls['employees']['controls']
  }

  initEmployeeForm() {
    return this.fb.group({
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
    })
  }

  addEmployee() {
    this.createEmployeeForm(this.form)
  }

  removeEmployee(index) {
    const control = this.form.controls['employees'] as FormArray
    control.removeAt(index)
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
}
