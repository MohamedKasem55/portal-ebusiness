import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
  Input,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup } from '@angular/forms'
import { AuthenticationService } from '../../../../../../../core/security/authentication.service'
@Component({
  selector: 'app-sadad-olp-ca-enrollment-step1',
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit, OnDestroy {
  @Output() onInit = new EventEmitter<Component>()
  @Input() formCAEnrollment: FormGroup
  @Input() title: string

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
