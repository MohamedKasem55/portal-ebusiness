import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'

import { TranslateService } from '@ngx-translate/core'
import { BeneficiaryService } from '../../Services/beneficiary.service'
import { TransferLocalService } from '../../Services/transfer-local.service'
import { StaticService } from '../../../Common/Services/static.service'

@Component({
  selector: 'quick-ips-transfer-step5',
  templateUrl: '../../View/ips/home-quick-transfer-ips-step5.html',
})
export class QuickTransferStep5IPSWidget implements OnInit {
  @ViewChild('beneficiaryTable', { static: true }) table: any

  @Input() form: FormGroup
  @Input() buttonLabel: string
  @Input() tableSelectedRows: any
  @Output() onNext = new EventEmitter<boolean>()
  @Output() onInit = new EventEmitter<Component>()

  constructor(
    public service: BeneficiaryService,
    public fb: FormBuilder,
    public serviceTransfer: TransferLocalService,
    public staticService: StaticService,
    public translate: TranslateService,
  ) {}

  ngOnInit(): void {}
  submit() {
    this.onNext.emit(true)
  }

  back() {
    this.form.enable()
    this.onNext.emit(false)
  }
}
