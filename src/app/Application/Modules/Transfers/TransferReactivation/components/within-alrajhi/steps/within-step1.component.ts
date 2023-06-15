import { Component, Input, OnInit } from '@angular/core'
import { TransferReactivationService } from '../../../transfer-reactivation.service'

@Component({
  selector: 'within-step1-component',
  templateUrl: './within-step1-component.html',
})
export class WithinStep1Component implements OnInit {
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

  constructor(public reactivationService: TransferReactivationService) {}

  ngOnInit(): void {}
}
