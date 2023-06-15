import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Subscription } from 'rxjs'

import { TranslateService } from '@ngx-translate/core'
import { UpdateMailService } from './update-mail.service'

@Component({
  selector: 'app-mail-step1',
  templateUrl: 'update-mail-step1.component.html',
})
export class UpdateMailStep1Component implements OnInit, OnDestroy {
  @Input() form: FormGroup
  @Output() onInit = new EventEmitter<Component>()

  mensajeError: any = {}
  subscriptions: Subscription[] = []
  emailNotValid = false

  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
    public service: UpdateMailService,
  ) {}

  ngOnInit() {
    this.onInit.emit(this as Component)
    // this.subscriptions.push(this.form.get('newEmail').valueChanges.pipe(distinctUntilChanged(), map((result) => {
    //   return result.length;
    // })).subscribe((resultado) => {
    //   if (resultado > 3 && this.form.controls.newEmail.hasError('incorrectMailFormat')) {
    //     this.emailNotValid = true;
    //   } else {
    //     this.emailNotValid = false;
    //   }
    // }));
  }

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
