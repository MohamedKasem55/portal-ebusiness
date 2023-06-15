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
import { FormBuilder } from '@angular/forms'
import { AuthenticationService } from '../../../../../../../../../core/security/authentication.service'
import { CardAllocationReactivateFormComponent } from '../../common/card-allocation-form.component'

@Component({
  selector: 'app-card-allocation-reactivate-step1',
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit, OnDestroy {
  @Output() onInit = new EventEmitter<Component>()
  @ViewChild(CardAllocationReactivateFormComponent, { static: true })
  child: CardAllocationReactivateFormComponent

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
