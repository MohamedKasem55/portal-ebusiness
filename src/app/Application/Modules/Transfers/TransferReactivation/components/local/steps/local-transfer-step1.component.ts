import { Component, Input, OnInit } from '@angular/core'
import { TransferReactivationService } from '../../../transfer-reactivation.service'

@Component({
  selector: 'local-transfer-step1-component',
  templateUrl: './local-transfer-step1-component.html',
})
export class LocalTransferStep1Component implements OnInit {
  @Input()
  batches: any[]
  @Input()
  accounts: any[]
  @Input()
  transferReasons: any[]
  @Input()
  beneficiaries: any[]
  @Input()
  forms: any[]
  @Input()
  formsFieldsConfigs: any[]

  constructor(public reactivationService: TransferReactivationService) {}

  ngOnInit(): void {}
}
