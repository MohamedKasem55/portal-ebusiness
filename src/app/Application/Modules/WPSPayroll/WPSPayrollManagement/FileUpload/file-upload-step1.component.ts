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
import { saveAs } from 'file-saver'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-file-upload-step1',
  templateUrl: './file-upload-step1.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadStep1Component implements OnInit, OnDestroy {
  @ViewChild('uploadFile') uploadFile: ElementRef
  @Output() onInit = new EventEmitter<any>()
  @Input() needBatchName: boolean
  @Input() isEmployee: boolean

  file: File
  batchName: any
  fileName: any
  isCharity = false
  paymentPurpose: any = 'PAYR'
  purpose: any = []

  constructor(public service: FileUploadService,
              public translate: TranslateService) {
  }

  ngOnInit() {
    this.translate.get(['wpspayroll.payroll','wpspayroll.charity']).subscribe((langResult) => {
      this.purpose.push({ key: 'PAYR', value: langResult['wpspayroll.payroll'] })

      this.onInit.emit(this)
      this.service.getCompanyJuridicalState().subscribe(result => {
        if (result.juridicalState == '0014') {
          this.purpose.push({ key: 'PCHA', value: langResult['wpspayroll.charity'] })
          this.isCharity = true
        }
      })
    })
  }

  ngOnDestroy() {
  }

  fileChange(event) {
    //
    const fileList: FileList = event.target.files
    if (fileList.length > 0) {
      this.file = fileList[0]
      this.fileName = this.file.name
      //
    }
  }

  emitSalaryFile(): void {
    this.service.getFileSalary().subscribe((res) => {
      saveAs(res.file, res.fileName)
    })
  }

  emitEmployeeFile(): void {
    this.service.getFileEmployee().subscribe((res) => {
      saveAs(res.file, res.fileName)
    })
  }
}
