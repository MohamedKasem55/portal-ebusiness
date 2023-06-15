import { Component, EventEmitter, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-upload-file-step1',
  templateUrl: './upload-file-step1.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class FileUploadStep1Component implements OnInit {
  @Output() onInit = new EventEmitter<any>()
  step = 1
  file: File
  batchName: any
  fileName: any

  constructor() {}

  ngOnInit() {
    this.onInit.emit(this)
  }

  fileChange(event) {
    const fileList: FileList = event.target.files
    if (fileList.length > 0) {
      this.file = fileList[0]
      this.fileName = this.file.name
    }
  }
}
