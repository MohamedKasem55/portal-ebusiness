import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms'

import { TranslateService } from '@ngx-translate/core'
import { BeneficiaryService } from '../../Services/beneficiary.service'
import { TransferLocalService } from '../../Services/transfer-local.service'
import { StaticService } from '../../../Common/Services/static.service'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { Exception } from '../../../../Model/exception'
import { Subscription } from 'rxjs'
import { SessionStorageService } from 'ngx-webstorage'
import { Router } from '@angular/router'
import { AuthenticationService } from '../../../../../core/security/authentication.service'

@Component({
  selector: 'quick-local-transfer-step2',
  templateUrl: '../../View/local/home-quick-tranfer-local-step2.html',
})
export class QuickTransferStep2LocalWidget implements OnInit {
  @ViewChild('beneficiaryTable', { static: true }) table: any

  @ViewChild('ipsModal', { static: true })
  public ipsModal: ModalDirective

  @Input() form: FormGroup
  @Input() buttonLabel: string
  @Input() tableSelectedRows: any
  @Output() onNext = new EventEmitter<boolean>()
  @Output() onInit = new EventEmitter<Component>()

  IPS = 'quickTransfer'
  currentTransferLimit: number
  errorMessage = {}
  subscriptions: Subscription[] = []
  disableQuickTransfer: boolean

  constructor(
    public service: BeneficiaryService,
    public fb: FormBuilder,
    public serviceTransfer: TransferLocalService,
    public staticService: StaticService,
    public translate: TranslateService,
    private sessionStorage: SessionStorageService,
    public router: Router,
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.form.addControl(
      'ipsAmount',
      new FormControl(
        { value: '', disabled: true },
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]*.?[0-9]*$'),
        ]),
      ),
    )
    this.validateQuickTransferLimit()
  }

  submit() {
    if (this.currentTransferLimit === 0 && this.isIPS) {
      this.ipsModal.show()
    } else {
      this.onNext.emit(true)
    }
  }

  activate() {
    this.ipsModal.hide()
    this.router.navigate(['/companyadmin/manage/user'])
  }

  later() {
    this.ipsModal.hide()
  }

  back() {
    this.form.enable()
    this.onNext.emit(false)
  }

  isValid() {
    if (this.isIPS) {
      return (
        this.form.controls.ipsAmount.value &&
        Number(this.form.controls.ipsAmount.value) <= this.currentTransferLimit
      )
    } else {
      return true
    }
  }

  get isIPS(): boolean {
    if (this.form.controls.operationType.value === this.IPS) {
      this.form.controls['ipsAmount'].enable()
      return true
    }
    this.form.controls['ipsAmount'].disable()
    return false
  }

  onError(error: any) {
    const res = error
    this.errorMessage['code'] = res.error.errorCode
    this.errorMessage['description'] = res.error.errorDescription
  }

  validateQuickTransferLimit(): void {
    const isAdmin: boolean = this.authenticationService.userHasAnyGroup([
      'CompanyAdmins',
    ])
    this.subscriptions.push(
      this.serviceTransfer.ipsConfig().subscribe((result) => {
        if (result instanceof Exception) {
          this.onError(result)
          return
        } else {
          this.errorMessage = {}
          this.currentTransferLimit = Number(result.qtl)
          if (this.currentTransferLimit === 0) {
            if (isAdmin) {
              this.ipsModal.show()
            } else {
              this.disableQuickTransfer = true
            }
          }
        }
      }),
    )
  }
}
