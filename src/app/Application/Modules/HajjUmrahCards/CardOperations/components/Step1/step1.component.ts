import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { FormBuilder } from '@angular/forms'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { Router } from '@angular/router'
import { CardOperationsTableComponent } from '../common/card-operations-table.component'

@Component({
  selector: 'app-cardOperations-step1',
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit {
  @Output() onInit = new EventEmitter<Component>()

  @ViewChild(CardOperationsTableComponent, { static: true })
  child: CardOperationsTableComponent

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
