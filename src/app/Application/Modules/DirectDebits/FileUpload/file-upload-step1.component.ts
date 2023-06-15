import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FileUploadService } from './file-upload.service'
import {saveAs} from "file-saver";

@Component({
  selector: 'app-file-upload-step1',
  templateUrl: './file-upload-step1.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadStep1Component implements OnInit, OnDestroy {
  @ViewChild('uploadFile') uploadFile: ElementRef
  @Output() onInit = new EventEmitter<any>()
  @Input() needBatchName: boolean
  @Input() isPayer: boolean

  file: File
  batchName: any
  fileName: any

  constructor(public service: FileUploadService) {}

  ngOnInit() {
    this.onInit.emit(this)
  }

  ngOnDestroy() {}

  fileChange(event) {
    //
    const fileList: FileList = event.target.files
    if (fileList.length > 0) {
      this.file = fileList[0]
      this.fileName = this.file.name
      //
    }
  }

  emitDirectDebitFile(): void {
    this.service.getFileDirectDebit().subscribe((res) => {
      saveAs(res.file, res.fileName)
    })
  }

  emitPayerFile(): void {
    this.service.getFilePayer().subscribe((res) => {
      saveAs(res.file, res.fileName)
    })
  }
}
