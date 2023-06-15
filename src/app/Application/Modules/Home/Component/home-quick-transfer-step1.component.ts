import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { AuthenticationService } from '../../../../core/security/authentication.service'

@Component({
  selector: 'quick-transfer-step1',
  templateUrl: '../View/home-quick-tranfer-step1.html',
})
export class QuickTransferStep1Widget implements OnInit, OnDestroy {
  @Input() form: FormGroup
  @Input() buttonLabel: string
  @Input() show: boolean
  @Output() onNext = new EventEmitter<boolean>()
  @Output() onInit = new EventEmitter<Component>()

  loading = false

  constructor(
    public authenticationService: AuthenticationService,
    public injector: Injector,
  ) {}

  ngOnInit() {
    this.onInit.emit(this as Component)
  }

  ngOnDestroy() {}
  cancel() {
    this.onNext.emit(false)
  }

  submit() {
    if (this.form.controls['operationType'].value == 'localTransfer') {
      const router = this.injector.get(Router)
      router.navigate(['transfers/operation/localTransfer'])
      return
    } else {
      this.onNext.emit(true)
    }
  }
}
