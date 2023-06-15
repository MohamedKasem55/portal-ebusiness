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
import { AuthenticationService } from '../../../../../../../../core/security/authentication.service'
import { InitiateSadadTestingListComponent } from '../../list/initiate-sadad-testing-list.component'

@Component({
  selector: 'app-initiate-sadad-testing-step1',
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit, OnDestroy {
  @Output() onInit = new EventEmitter<Component>()

  @ViewChild(InitiateSadadTestingListComponent, { static: true })
  child: InitiateSadadTestingListComponent

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
