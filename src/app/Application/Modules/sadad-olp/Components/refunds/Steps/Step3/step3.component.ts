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
  selector: 'app-refund-sadad-olp-step3',
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit, OnDestroy {
  @Output() onInit = new EventEmitter<Component>()
  @Input() formRefunds: FormGroup
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
