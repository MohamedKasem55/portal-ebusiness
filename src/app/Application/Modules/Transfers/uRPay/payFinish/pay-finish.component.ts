import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { FormGroup } from '@angular/forms'


@Component({
  selector: 'uRPayComponentPayFinish',
  templateUrl: './pay-finish.component.html',
  styleUrls: ['./pay-finish.component.scss'],
})
export class PayFinishComponent {

  @Input() formModel: FormGroup
  @Input() isAuthorize:boolean

  public today = new Date()

  constructor(
    public router: Router,
    public translate: TranslateService,
  ) {
  }

}
