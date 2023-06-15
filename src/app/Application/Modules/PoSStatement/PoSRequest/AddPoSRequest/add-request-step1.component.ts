import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-add-request-step1',
  templateUrl: './add-request-step1.component.html',
  styleUrls: ['./add-request.component.scss'],
})
export class AddRequestStep1Component implements OnInit, OnDestroy {
  @Input() form: any
  @Input() types: any
  @Input() cities: any
  @Input() accounts: any
  @Input() file: any

  subscriptions: Subscription[] = []

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
  }

  fileChange(event) {
    const fileList: FileList = event.target.files
    if (fileList.length > 0) {
      this.file['file'] = fileList[0]
      this.form.controls.fileName.patchValue(this.file['file'].name)
    }
  }

  isFirstForm() {
    return false //(this.form.controls['requestType'].value =="001");
  }
}
