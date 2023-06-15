import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { AbstractAppComponent } from '../../../Common/Components/Abstract/abstract-app.component'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-government-revenue-upload-file-step1',
  templateUrl: './upload-file-step1.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class FileUploadStep1Component
  extends AbstractAppComponent
  implements OnInit {
  @Input() file: File
  @Output() onInit = new EventEmitter<any>()
  step = 1
  batchName: any
  fileName: any

  constructor(public translate: TranslateService) {
    super(translate)
  }

  ngOnInit() {
    super.ngOnInit()
    if(this.file){
      this.fileName = this.file.name;
      this.renameBatchName();
    } else {
      this.fileName = null
      this.batchName = null
    }
    this.onInit.emit(this)
  }

  fileChange(event) {
    const fileList: FileList = event.target.files
    if (fileList.length > 0) {
      this.file = fileList[0]
      this.fileName = this.file.name
    }
    this.renameBatchName();
  }
  private renameBatchName():void{
  const uploadFileNamefichNAme:string  = this.fileName.split(".");
  this.batchName= uploadFileNamefichNAme[0];
  }
}
