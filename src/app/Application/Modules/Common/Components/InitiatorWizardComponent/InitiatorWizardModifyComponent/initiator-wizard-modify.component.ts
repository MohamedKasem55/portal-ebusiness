import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { StaticService } from '../../../Services/static.service'
import { AbstractWizardInitiatorModifyComponent } from '../../Abstract/Initiator/abstract-wizard-initiator-modify.component'

@Component({
  selector: 'app-initiator-wizard-modify',
  templateUrl: './initiator-wizard-modify.component.html',
})
export class InitiatorWizardModifyComponent
  extends AbstractWizardInitiatorModifyComponent
  implements OnInit
{
  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    translate: TranslateService,
    router: Router,
  ) {
    super(fb, staticService, translate, router)
  }

  ngOnInit() {
    super.ngOnInit()
  }

  isDisabled() {}
}
