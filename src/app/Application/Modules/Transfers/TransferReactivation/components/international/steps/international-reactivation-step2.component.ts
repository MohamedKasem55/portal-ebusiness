import { Component, Input, OnInit } from '@angular/core'
import { TransferReactivationService } from '../../../transfer-reactivation.service'

@Component({
  selector: 'international-reactivation-step2-component',
  templateUrl: 'international-reactivation-step2-component.html',
})
export class InternationalReactivationStep2Component implements OnInit {
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
  @Input()
  transferReasons: any[] = []

  constructor(public reactivationService: TransferReactivationService) {}

  ngOnInit(): void {}
}
