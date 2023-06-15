import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { StaticService } from '../../../Services/static.service'
import { AbstractWizardInitiatorAddComponent } from '../../Abstract/Initiator/abstract-wizard-initiator-add.component'

@Component({
  selector: 'app-initiator-wizard-add',
  templateUrl: './initiator-wizard-add.component.html',
})
export class InitiatorWizardAddComponent
  extends AbstractWizardInitiatorAddComponent
  implements OnInit
{
  ngOnInit() {
    super.ngOnInit()
  }

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    translate: TranslateService,
    router: Router,
  ) {
    super(fb, staticService, translate, router)
  }

  isDisabled() {}
}
