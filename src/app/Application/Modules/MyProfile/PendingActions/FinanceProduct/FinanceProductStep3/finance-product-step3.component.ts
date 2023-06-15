import { Component, OnDestroy, OnInit, Input } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'finance-productg-step3',
  templateUrl: './finance-product-step3.component.html',
  styleUrls: ['./finance-product-step3.component.scss'],
})
export class FinanceProductStep3Component implements OnInit, OnDestroy {
  @Input() formModel: FormGroup

  public dossierId = ''

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public translate: TranslateService,
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.dossierId = this.formModel.controls['dossierId'].value
  }
}
