import {Component, Input, OnInit, Output, ViewChild} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import {PrepaidCardRequestConfirm, RequestPrepaidCardValidateResponse, UserJourney} from './PrepaidCardRequestModel'
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-pre-paid-card-request-step3',
  templateUrl: './pre-paid-card-request-step3.component.html',
  styleUrls: ['./pre-paid-card-request.component.scss'],
})
export class PrePaidCardRequestStep3Component implements OnInit {

  step = 3

  @Input() form: FormGroup
  @Input() selectedUserJourney:  UserJourney
  constructor(public translate: TranslateService) {}

  public gender = [
    {
      key: 'F',
      value: 'Female',
    },
    {
      key: 'M',
      value: 'Male',
    },
  ]

  ngOnInit(): void {
  }

  getGender(key){
    return this.gender.filter(gender => gender.key == key)[0].value
  }

}
