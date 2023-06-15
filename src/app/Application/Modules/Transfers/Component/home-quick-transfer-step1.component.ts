import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { FormGroup } from '@angular/forms'
import { AuthenticationService } from '../../../../core/security/authentication.service'
import { ActivatedRoute } from '@angular/router'
import { AbstractAppComponent } from '../../Common/Components/Abstract/abstract-app.component'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'quick-transfer-step1',
  templateUrl: '../View/home-quick-tranfer-step1.html',
})
export class QuickTransferStep1Widget
  extends AbstractAppComponent
  implements OnInit, OnDestroy
{
  @Input() form: FormGroup
  @Input() buttonLabel: string
  @Input() show: boolean
  @Output() onNext = new EventEmitter<boolean>()
  @Output() onInit = new EventEmitter<Component>()

  loading = false

  constructor(
    public authenticationService: AuthenticationService,
    public translate: TranslateService,
    public route: ActivatedRoute,
  ) {
    super(translate)
  }

  ngOnInit() {
    super.ngOnInit()

    this.onInit.emit(this as Component)

    this.subscriptions.push(
      this.route.paramMap.subscribe((params) => {
        // (+) before `params.get()` turns the string into a number
        const operationType = params.get('operationType')
        if (operationType != 'all' && operationType != '') {
          this.form.get('operationType').setValue(operationType)
          this.submit()
        }
      }),
    )
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  cancel() {
    this.onNext.emit(false)
  }

  submit() {
    //console.log('submit 1');
    this.onNext.emit(true)
  }
}
