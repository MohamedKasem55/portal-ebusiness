import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { interval, Subscription } from 'rxjs'
import { Exception } from '../../../../Model/exception'
import { PendingActionsNotificaterService } from '../../../Common/Components/PendingActions/pending-actions-notificater.service'
import { StaticService } from '../../../Common/Services/static.service'
import { ManagePayerService } from '../manage-payer.service'
import { PayerShareService } from '../payer-share.service'

@UntilDestroy()
@Component({
  selector: 'app-delete-payer',
  templateUrl: './delete-payer.component.html',
  styleUrls: ['./delete-payer.component.scss'],
})
export class DeletePayerComponent implements OnInit, OnDestroy {
  step: number
  form: FormGroup

  combosSolicitados: string[] = ['payrollBankCode']
  banks: any

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  selected: any

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public service: ManagePayerService,
    public serviceData: PayerShareService,
    private router: Router,
    public pendingActionNotification: PendingActionsNotificaterService,
  ) {
    this.step = 2
    this.form = fb.group({
      elements: fb.array([]),
    })
  }

  next() {
    switch (this.step) {
      case 2:
        this.subscriptions.push(
          this.service.delete(this.form.value.elements).subscribe((result) => {
            if (result instanceof Exception) {
              this.onError(result)
              return
            } else {
              this.pendingActionNotification.getRefreshObserver().next(true)
              this.nextStep()
            }
          }),
        )
        break
      case 3:
        this.pendingActionNotification.getRefreshObserver().next(true)
        this.serviceData.clear()
        this.router.navigate(['/direct-debits/manage-payer'])
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
      this.router.navigate(['/direct-debits/manage-payer'])
    }
  }

  ngOnInit() {
    interval(1000).pipe(untilDestroyed(this)).subscribe()
    this.selected = this.serviceData.getSelectedData()

    for (let i = 0; this.selected.length > i; i++) {
      this.createForm(this.form, this.selected[i])
    }
  }

  createForm(form: FormGroup, elemento: any) {
    const control = form.controls['elements'] as FormArray
    control.push(this.initElementForm(elemento))
  }

  initElementForm(element: any): FormGroup {
    return this.fb.group({
      mandate: [element.mandate],
      personalName: [element.personalName],
      account: [element.account],
      amount: [element.amount],
      bank: [element.bank],
      personalAddress1: [element.personalAddress1],
      description1: [element.description1],
      personalAddress2: [element.personalAddress2],
      description2: [element.description2],
      personalAddress3: [element.personalAddress3],
      description3: [element.description3],
      description4: [element.description4],
      instalmentNumber: [element.instalmentNumber],
      selected: [element.selected],
      indexSelected: [element.indexSelected],
      frequency: [element.frequency],
      dueDate: [element.dueDate],
      claimDate: [element.claimDate],
      companyCustomerPk: [element.companyCustomerPk],
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
    ////console.log(res.error);
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  get elements(): FormGroup[] {
    return this.form.controls['elements']['controls']
  }
}
