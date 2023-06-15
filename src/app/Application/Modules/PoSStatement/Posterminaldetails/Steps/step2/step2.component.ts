import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FormGroup, FormBuilder } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-update-cards-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
})
export class Step2Component implements OnInit {
  @Input() form: FormGroup
  @Input() batch: any
  @Output() onInit = new EventEmitter<Component>()

  constructor(public fb: FormBuilder, public translate: TranslateService) {}

  ngOnInit() {
    //console.log(this.form);
    this.onInit.emit(this as Component)
  }
}
