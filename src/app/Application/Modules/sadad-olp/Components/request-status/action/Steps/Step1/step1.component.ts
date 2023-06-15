import {
  Component,
  OnInit,
  Output,
  OnDestroy,
  Input,
  EventEmitter,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { FormGroup, FormBuilder } from '@angular/forms'
import { AuthenticationService } from '../../../../../../../../core/security/authentication.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-request-status-action-step1',
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit, OnDestroy {
  @Output() onInit = new EventEmitter<Component>()
  @Input() formRefunds: FormGroup
  @Input() formDisputes: FormGroup

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
