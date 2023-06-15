import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { FileUploadService } from './file-upload.service'
import { StaticService } from '../../Common/Services/static.service'

@Component({
  selector: 'app-file-upload-payer-step2',
  templateUrl: './file-upload-payer-step2.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadPayerStep2Component implements OnInit, OnDestroy {
  @Input() initPayer: any
  @Output() onInit = new EventEmitter<any>()

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
}
