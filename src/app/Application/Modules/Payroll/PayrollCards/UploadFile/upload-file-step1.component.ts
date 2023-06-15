import { Component, EventEmitter, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-upload-file-step1',
  templateUrl: './upload-file-step1.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileStep1Component implements OnInit {
  @Output() onInit = new EventEmitter<any>()

  file: File
  batchName: any
  fileName: any

  constructor() {
    //console.log('componente 1');
  }

  ngOnInit() {
    //console.log('emit 1');
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
