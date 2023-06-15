import { Component, OnDestroy, OnInit, Input } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { PageType } from '../../represented.service'

@Component({
  selector: 'finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.scss'],
})
export class FinishComponent implements OnInit, OnDestroy {

  @Input() formModel: FormGroup
  @Input() isSaudi: boolean
  @Input() pageType: PageType

  public PageType = PageType


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
