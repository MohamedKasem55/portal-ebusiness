import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
  ViewChild,
  Input,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup } from '@angular/forms'
import { AuthenticationService } from '../../../../../../../../../core/security/authentication.service'
import { CardOperationReactivateFormComponent } from '../../common/card-operation-form.component'

@Component({
  selector: 'app-card-operation-reactivate-step1',
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit, OnDestroy {
  @Output() onInit = new EventEmitter<Component>()
  @ViewChild(CardOperationReactivateFormComponent, { static: true })
  child: CardOperationReactivateFormComponent

  constructor(
    public fb: FormBuilder,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {}

  ngOnInit() {
    this.onInit.emit(this as Component)
  }

  ngOnDestroy() {}
}
