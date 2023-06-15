import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { FormGroup } from '@angular/forms'


@Component({
  selector: 'uRPayComponentPaySummary',
  templateUrl: './pay-summary.component.html',
  styleUrls: ['./pay-summary.component.scss'],
})
export class PaySummaryComponent {

  @Input() formModel: FormGroup

  constructor(
    public router: Router,
    public translate: TranslateService,
  ) {
  }

}
