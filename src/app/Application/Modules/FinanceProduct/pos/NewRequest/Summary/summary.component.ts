import { Component, OnDestroy, OnInit, Input } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'finance-product-new-request-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit, OnDestroy {
  @Input() iniatFormModel: FormGroup
  @Input() informationFormModel: FormGroup
  @Input() mandatoryDocuments: any = []
  @Input() productType: string;

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public translate: TranslateService,
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.informationFormModel.controls['c_fullYearAccount'].disable()
  }
}
