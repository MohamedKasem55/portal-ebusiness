import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { SearchByChequeNumberService } from './search-cheque-number.service'

@Component({
  selector: 'app-search-cheque-number-step2',
  templateUrl: 'search-cheque-number-step2.component.html',
})
export class SearchByChequeNumberStep2Component implements OnInit {
  @Input() form: FormGroup
  @Input() chequeSelected: any
  @Input() generateChallengeAndOTP: any
  @Output() onInit = new EventEmitter<Component>()

  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
    public service: SearchByChequeNumberService,
  ) {}

  ngOnInit() {
    this.onInit.emit(this as Component)
  }
}
