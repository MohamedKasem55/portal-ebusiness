import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { StaticService } from '../../../Services/static.service'
import { AbstractWizardInitiatorDeleteComponent } from '../../Abstract/Initiator/abstract-wizard-initiator-delete.component'

@Component({
  selector: 'app-initiator-wizard-delete',
  templateUrl: './initiator-wizard-delete.component.html',
})
export class InitiatorWizardDeleteComponent
  extends AbstractWizardInitiatorDeleteComponent
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
