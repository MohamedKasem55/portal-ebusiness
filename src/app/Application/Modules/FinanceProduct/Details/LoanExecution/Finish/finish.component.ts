import { Component, OnDestroy, OnInit, Input } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.scss'],
})
export class FinishComponent implements OnInit, OnDestroy {
  @Input() formModel: FormGroup
  @Input() isSanad: boolean

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public translate: TranslateService,
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }
}
