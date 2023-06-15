import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Subscription } from 'rxjs'

import { TranslateService } from '@ngx-translate/core'
import { FileUploadService } from './file-upload.service'
import { StaticService } from '../../../Common/Services/static.service'
import { ResponseGenerateChallenge } from '../../../../Model/responsegeneratechallenge.type'
import { RequestValidate } from '../../../../Model/requestvalidateType'

@Component({
  selector: 'app-file-upload-employee-step2',
  templateUrl: './file-upload-employee-step2.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadEmployeeStep2Component implements OnInit, OnDestroy {
  @Input() initEmployee: any
  @Output() onInit = new EventEmitter<any>()

  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  constructor(
    private fb: FormBuilder,
    public service: FileUploadService,
    public staticService: StaticService,
    public translate: TranslateService,
  ) {}

  ngOnInit() {
    //console.log(this.initEmployee);
    this.onInit.emit(this)
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  valid() {
    return true
  }
}
