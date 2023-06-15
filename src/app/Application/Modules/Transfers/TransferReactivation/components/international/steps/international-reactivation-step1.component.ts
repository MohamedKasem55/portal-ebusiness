import { Component, Input, OnInit } from '@angular/core'
import { TransferReactivationService } from '../../../transfer-reactivation.service'

@Component({
  selector: 'international-reactivation-step1-component',
  templateUrl: './international-reactivation-step1-component.html',
})
export class InternationalReactivationStep1Component implements OnInit {
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
  transferReasons: any[] = []

  constructor(public reactivationService: TransferReactivationService) {}

  ngOnInit(): void {}
}
