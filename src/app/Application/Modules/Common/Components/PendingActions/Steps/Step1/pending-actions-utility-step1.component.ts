import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../../../../core/security/authentication.service'
import { PendingActionsUtilityService } from '../../pending-actions-utility.service'
import { AbstractAppComponent } from '../../../Abstract/abstract-app.component'

@Component({
  selector: 'app-pending-actions-utility-step1',
  templateUrl: './pending-actions-utility-step1.component.html',
  styleUrls: ['./pending-actions-utility-step1.component.scss'],
})
export class PendingActionsUtilityStep1Component
  extends AbstractAppComponent
  implements OnInit, OnDestroy, OnChanges
{
  @Input() service: PendingActionsUtilityService

  @Input() operation: any

  @Input() combosData: any

  @Input() translate_prefix = 'pendingActions'

  @Input() custom_fields_templates: any = {}

  @Input() editable = true

  @Input() pendingActionsSelected: any[] = []
  @Input() pendingActionsSelectedFormModels: FormGroup[] = []
  @Input() pendingActionsSelectedFormConfigs: any[] = []

  constructor(
    public fb: FormBuilder,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(translate)
  }

  ngOnInit() {
    super.ngOnInit()
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.pendingActionsSelectedFormModels.forEach((formModel, i) => {
      if (this.editable) {
        this.pendingActionsSelectedFormModels[i].enable()
      } else {
        this.pendingActionsSelectedFormModels[i].disable()
      }
    })
  }

  onDetailsFormCreated(event, i) {
    if (this.editable) {
      this.pendingActionsSelectedFormModels[i].enable()
    } else {
      this.pendingActionsSelectedFormModels[i].disable()
    }
  }
}
