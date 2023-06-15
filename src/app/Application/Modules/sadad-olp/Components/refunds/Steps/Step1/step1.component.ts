import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { FormBuilder } from '@angular/forms'
import { AuthenticationService } from '../../../../../../../core/security/authentication.service'
import { OLPRefundListComponent } from '../../list/olp-refunds-list.component'

@Component({
  selector: 'app-refund-sadad-olp-step1',
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit, OnDestroy {
  @Output() onInit = new EventEmitter<Component>()

  @ViewChild(OLPRefundListComponent, { static: true })
  child: OLPRefundListComponent

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
