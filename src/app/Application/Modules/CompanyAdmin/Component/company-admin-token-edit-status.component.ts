// Imports
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { StaticService } from '../../Common/Services/static.service'
import { Exception } from 'app/Application/Model/exception'
import { CompanyAdminTokenManagmentService } from '../Services/company-admin-token-managment.service'
import { ModelPipe } from '../../../Components/common/Pipes/model-pipe'

@Component({
  templateUrl: '../View/company-admin-token-edit-status.component.html',
})
export class CompanyAdminTokenEditStatus
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  formTokens: FormGroup
  sub: any
  allStatus: any
  status: any
  statusReal: any

  validForm = true

  combosSolicitados: string[] = ['tokenNewStatus', 'tokenStatus']
  messageError: any = {}
  loading: boolean
  step: number = 1

  constructor(
    public fb: FormBuilder,
    public service: CompanyAdminTokenManagmentService,
    public staticService: StaticService,
    public route: ActivatedRoute,
    public translate: TranslateService,
    private modelPipe: ModelPipe,
    private router: Router,
  ) {
    super()
    this.status = []
    this.allStatus = []
    this.statusReal = []
    this.createForm()
  }

  createForm() {
    this.formTokens = this.fb.group({
      active: '',
      blocked: '',
      companyProfileNumber: '',
      icoNumber: '',
      lost: '',
      nonOperative: '',
      tokenSerialNumber: [{ value: '', disabled: true }, Validators.required],
      tokenStatus: [{ value: '', disabled: true }, Validators.required],
      newTokenStatus: ['', Validators.required],
      tokenType: { value: '', disabled: true },
      unassigned: '',
      userId: { value: '', disabled: true },
      userName: { value: '', disabled: true },
    })
  }

  ngOnInit() {
    super.ngOnInit()
    this.staticService
      .getAllCombos(this.combosSolicitados)
      .subscribe((result) => {
        const data = result
        let valores =
          data[this.combosSolicitados.indexOf('tokenNewStatus')]['values']
        Object.keys(valores).map((key, index) => {
          this.allStatus.push({ key, value: valores[key] })
        })
        valores = data[this.combosSolicitados.indexOf('tokenStatus')]['values']
        Object.keys(valores).map((key, index) => {
          this.statusReal.push({ key, value: valores[key] })
        })
      })
    this.sub = this.route.params.subscribe((params) => {
      return this.getTokenStatus(params['tockenSerial'])
    })
    this.formTokens.controls['newTokenStatus'].valueChanges.subscribe(
      (value) => {
        this.validForm =
          !(
            this.formTokens.controls['tokenStatus'].value === 'NON_OPERATIVE' &&
            value === 'NON_OPERATIVE'
          ) &&
          !(
            this.formTokens.controls['tokenStatus'].value === 'ACTIVE' &&
            value === 'AVAILABLE'
          ) &&
          !(
            this.formTokens.controls['tokenStatus'].value === 'BLOCKED' &&
            value === 'BLOCKED'
          ) &&
          !(
            this.formTokens.controls['tokenStatus'].value === 'LOST' &&
            value === 'LOST'
          )
      },
    )
  }

  getTokenStatus(token) {
    this.messageError = {}
    this.service.getTokenStatus(token).subscribe((result) => {
      if (
        result.hasOwnProperty('error') &&
        (<any>result).error instanceof Exception
      ) {
        const res = <any>result
        this.messageError['code'] = res.error.errorCode
        this.messageError['description'] = res.error.errorDescription
      } else {
        this.messageError = {}
        this.formTokens.patchValue(result)

        const tokenType: string = this.formTokens.controls['tokenType'].value
        if (tokenType)
          this.formTokens.controls['tokenType'].patchValue(
            this.modelPipe.transform('tokenType', tokenType),
          )

        this.allStatus = this.allStatus.filter(
          (s) => s.key !== result.tokenStatus,
        )
        this.loading = false
      }
    })
  }

  isValid() {
    return this.validForm && this.formTokens.valid
  }

  onError(result) {
    this.loading = false
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }

  proceed(): void {
    this.step = 2
    this.formTokens.controls['newTokenStatus'].disable()
  }

  goToStep1(): void {
    this.step = 1
    this.formTokens.controls['newTokenStatus'].enable()
  }

  edit() {
    this.loading = true
    this.messageError = {}

    const { tokenSerialNumber, newTokenStatus } = this.formTokens.getRawValue()
    this.service
      .editTokenStatus(tokenSerialNumber, newTokenStatus)
      .subscribe((result) => {
        if (
          result.hasOwnProperty('error') &&
          (<any>result).error instanceof Exception
        ) {
          const res = <any>result
          this.messageError['code'] = res.error.errorCode
          this.messageError['description'] = res.error.errorDescription
        } else {
          this.loading = false
          this.messageError = {}
          this.step = 3
        }
      })
  }

  exit(): void {
    this.router.navigateByUrl('/companyadmin/token/managment')
  }
}
