import { Component, OnInit, Input } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { PrePaidCardBlockService } from './prePaidCardBlock.service'

@Component({
  selector: 'app-step3',
  templateUrl: './prePaidCardBlock-step3.component.html',
  styleUrls: ['./prePaidCardBlock.component.scss'],
})
export class PrePaidCardBlockStep3Component implements OnInit {
  public operationType: string
  public closureOpType: string
  public replaceOpType: string
  public stolenOpType: string
  @Input() generateChallengeAndOTP: any

  constructor(
    public translate: TranslateService,
    public prepaidCardBlockService: PrePaidCardBlockService,
  ) {}

  ngOnInit() {
    this.operationType = this.prepaidCardBlockService.getBlockOperationType()
    this.closureOpType = PrePaidCardBlockService.CLOSURE_OP_TYPE
    this.replaceOpType = PrePaidCardBlockService.REPLACE_OP_TYPE
    this.stolenOpType = PrePaidCardBlockService.STOLEN_OP_TYPE
  }
}
