import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Subscription, interval } from 'rxjs'
import { Exception } from '../../../../Model/exception'
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'
import { StaticService } from '../../../Common/Services/static.service'
import { ManagePayerCompanyService } from '../manage-payer-company.service'
import { ManagePayerService } from '../manage-payer.service'
import { PayerShareService } from '../payer-share.service'

import { PendingActionsNotificaterService } from '../../../Common/Components/PendingActions/pending-actions-notificater.service'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'app-modify-payer',
  templateUrl: './modify-payer.component.html',
  styleUrls: ['./modify-payer.component.scss'],
})
export class ModifyPayerComponent implements OnInit, OnDestroy {
  step: number
  form: FormGroup
  initData: any
  selected: any
  valid: any
  listPage: PagedData<any>

  banks: any

  mensajeError: any = {}
  subscriptions: Subscription[] = []
  combosSolicitados: string[] = ['payrollBankCode']

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public service: ManagePayerService,
    public serviceData: ManagePayerCompanyService,
    private router: Router,
    public translate: TranslateService,
    public payerShareService: PayerShareService,
    public pendingActionNotification: PendingActionsNotificaterService,
  ) {
    this.step = 1
    this.form = fb.group({
      elements: fb.array([]),
    })
    this.listPage = new PagedData<any>()
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 20
    this.listPage.page = page
  }

  next() {
    switch (this.step) {
      case 1:
        //console.log(this.form.value.elements);
        this.subscriptions.push(
          this.service
            .validModify(
              this.form.value.elements,
              this.listPage.page.pageNumber + 1,
              this.listPage.page.pageSize,
            )
            .subscribe((result) => {
              if (result instanceof Exception) {
                this.onError(result)
                return
              } else {
                this.valid = result
                this.nextStep()
                this.pendingActionNotification.getRefreshObserver().next(true)
              }
            }),
        )
        break
      case 2:
        this.subscriptions.push(
          this.service
            .confirmModify(
              this.form.value.elements,
              this.listPage.page.pageNumber + 1,
              this.listPage.page.pageSize,
            )
            .subscribe((result) => {
              if (result instanceof Exception) {
                this.onError(result)
                return
              } else {
                this.nextStep()
                this.pendingActionNotification.getRefreshObserver().next(true)
              }
            }),
        )
        break
      case 3:
        this.serviceData.clear()
        this.serviceData.tableSelectedRows = []
        this.pendingActionNotification.getRefreshObserver().next(true)
        this.router.navigate(['/direct-debits/manage-payer'])
        break
    }
  }

  nextStep() {
    this.step = ++this.step % 4
  }

  previous() {
    this.step = --this.step % 4
    if (this.step === 0) {
      this.router.navigate(['/direct-debits/manage-payer'])
    }
  }

  ngOnInit() {
    interval(1000).pipe(untilDestroyed(this)).subscribe()
    this.selected = this.payerShareService.getSelectedData()
    //this.initData = this.payerShareService.getDataInit();
    this.payerShareService.clearDataInit()

    for (let i = 0; this.selected.length > i; i++) {
      //console.log('create employee');
      this.createForm(this.form, this.selected[i])
    }
    this.refreshData()
    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.refreshData()
      }),
    )
    //console.log(this.banks);
  }

  refreshData() {
    this.subscriptions.push(
      this.staticService
        .getAllCombos(this.combosSolicitados)
        .subscribe((result) => {
          const data = result
          this.banks = this.transformToKeyValue(
            data[this.combosSolicitados.indexOf('payrollBankCode')]['values'],
          )
        }),
    )
  }

  transformToKeyValue(data) {
    const aux = []
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < Object.keys(data).length; ++i) {
      aux.push({ key: Object.keys(data)[i], value: data[Object.keys(data)[i]] })
    }
    return aux
  }

  createForm(form: FormGroup, element: any) {
    const control = form.controls['elements'] as FormArray
    //console.log('add employee',employee);
    control.push(this.initElementForm(element))
  }

  initElementForm(element: any): FormGroup {
    //console.log(employee);
    const formElement = this.fb.group({
      mandate: [
        element.mandate,
        Validators.compose([Validators.required, Validators.maxLength(21)]),
      ],
      personalName: [
        element.personalName,
        Validators.compose([Validators.required, Validators.maxLength(60)]),
      ],
      account: [
        element.account,
        Validators.compose([Validators.required, Validators.maxLength(24)]),
      ],
      amount: [
        element.amount,
        Validators.compose([
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern('^[0-9]*.?[0-9]*$'),
        ]),
      ],
      bank: [element.bank, Validators.required],
      personalAddress1: [
        element.personalAddress1,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      description1: [
        element.description1,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      personalAddress2: [
        element.personalAddress2,
        Validators.compose([Validators.maxLength(50)]),
      ],
      description2: [
        element.description2,
        Validators.compose([Validators.maxLength(50)]),
      ],
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
    formElement.controls.account.valueChanges.subscribe((value) => {
      const bankCode = value.length > 6 ? '0' + value.substring(4, 6) : ''
      formElement.controls.bank.patchValue(bankCode)
    })
    return formElement
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

  get elements(): FormGroup[] {
    return this.form.controls['elements']['controls']
  }
}
