import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { FormGroup } from '@angular/forms'


@Component({
  selector: 'uRPayComponentPayType',
  templateUrl: './pay-type.component.html',
  styleUrls: ['./pay-type.component.scss'],
})
export class PayTypeComponent {

  @Input() formModel: FormGroup
  @Input() payType: string
  @Output() modelChange: EventEmitter<any> = new EventEmitter<any>()

  constructor(
    public router: Router,
    public translate: TranslateService,
  ) {
  }

  onChangeType(type): void {
    this.payType = type
    this.modelChange.emit(type)
  }


}
