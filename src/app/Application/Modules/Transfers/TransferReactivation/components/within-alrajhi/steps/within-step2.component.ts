import { Component, Input, OnInit } from '@angular/core'
import { TransferReactivationService } from '../../../transfer-reactivation.service'

@Component({
  selector: 'within-step2-component',
  templateUrl: 'within-step2-component.html',
})
export class WithinStep2Component implements OnInit {
  @Input()
  batches: any[]
  @Input()
  accounts: any[]
  @Input()
  beneficiaries: any[]
  @Input()
  forms: any[]
  @Input()
  formsFieldsConfigs: any[]
  @Input()
  validateResponse: any[]
  @Input()
  currentAction: string

  constructor(public reactivationService: TransferReactivationService) {}

  ngOnInit(): void {}
}
