import { Component, OnDestroy, OnInit, Input } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { SimpleMQ } from 'ng2-simple-mq'
import { PageType, RepresentedService } from '../../represented.service'
import { saveAs } from 'file-saver'


@Component({
  selector: 'power-selection',
  templateUrl: './power-selection.component.html',
  styleUrls: ['./power-selection.component.scss'],
})
export class RepresentedPowerSelectionComponent implements OnInit, OnDestroy {
  @Input() formModel: FormGroup
  @Input() powerList: any = []
  @Input() pageType: PageType

  public bsConfig: any = {}
  public today: Date
  public maxDate: Date
  public showUpload: boolean = true
  public file: any
  public PageType = PageType

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public translate: TranslateService,
    private smq: SimpleMQ,
    public representedService: RepresentedService,
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.today = this.pageType == this.PageType.ADD ? new Date(new Date().setHours(0, 0, 0, 0)) : new Date(this.formModel.controls['repStartDate'].value)
    this.maxDate = this.getMaxDate()
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        dateInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-dark-blue',
      },
    )
    let uploadedFile = this.formModel.controls['signatureFile'].value.name
    if (uploadedFile != '' && uploadedFile != null) {
      this.file = uploadedFile
    }
  }

  getMaxDate(): Date {
    let d = new Date()
    let year = d.getFullYear()
    let month = d.getMonth()
    let day = d.getDate()
    return new Date(year + 2, month, day, 23, 59, 59)
  }


  download(): void {
    this.representedService.getFile().subscribe((res) => {
      if (res != null) {
        saveAs(res.file, res.fileName)
      }
    })
  }

  // toggleShow(): void {
  //   this.showUpload = !this.showUpload
  //   this.formModel.controls['showSignature'].setValue(this.showUpload)
  //   if (this.showUpload) {
  //     this.formModel.controls['signatureFile'].setValidators(Validators.required)
  //   } else {
  //     this.formModel.controls['signatureFile'].setValidators(null)
  //   }
  // }

  fileUploadChange(event) {
    const fileList: FileList = event.target.files
    if (fileList.length > 0) {
      if (this.isAllowedType(fileList[0].name)) {
        if (fileList[0].size < 500000) {
          this.file = fileList[0].name
          this.formModel.controls['signatureFile'].setValue(fileList[0])
        } else {
          event.target.value = null
          this.formModel.controls['signatureFile'].setValue(null)
          this.smq.publish('error-mq', this.translate.instant('represented.fileSizeError'))
        }
      } else {
        event.target.value = null
        this.formModel.controls['signatureFile'].setValue(null)
        this.smq.publish('error-mq', this.translate.instant('represented.fileTypeError'))
      }
    }
  }

  onChangePower(power) {
    this.powerList.forEach(item => {
      if ((item.key && item.key == power.key) || (item.repPower && item.repPower == power.repPower)) {
        item.enabled = !item.enabled
      }
    })
  }


  isAllowedType(name: string) {
    const type = name.split('.').pop().toLowerCase()
    return type == 'jpeg' || type == 'jpg' || type == 'gif' || type == 'png'
  }

}
