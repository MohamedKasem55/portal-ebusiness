import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../../../../core/security/authentication.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-sadad-olp-ca-enrollment-step2',
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit, OnDestroy, OnChanges {
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

    this.formCAEnrollment.controls['dateFrom'].clearValidators()
    this.formCAEnrollment.controls['dateTo'].clearValidators()
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes['formCAEnrollment']);
  }

  ngOnDestroy() {}
}
