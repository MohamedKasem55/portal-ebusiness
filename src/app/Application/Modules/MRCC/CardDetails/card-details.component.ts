import { Component, Input } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { MRCCService } from '../mrcc.service'
import { SimpleMQ } from 'ng2-simple-mq'
import { saveAs } from 'file-saver'


@Component({
  selector: 'card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss'],
})
export class CardDetailsComponent {

  @Input() formModel: any
  @Input() mandatoryDocuments: any
  @Input() accounts: any
  @Input() isSummary: boolean


  public embosingNameList = []
  public maxAmount: number

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public translate: TranslateService,
    public mrccService: MRCCService,
    private smq: SimpleMQ,
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.formModel.enable()
    this.getEmbossingName()
    this.maxAmount = this.formModel.controls['amount'].value
  }

  getEmbossingName() {
    this.mrccService.getEmbosingName().subscribe((result) => {
      if (result !== null) {
        this.embosingNameList = result.embossingNameList.items
      }
    })
  }

  fileUploadChange(event, item) {
    const fileList: FileList = event.target.files
    if (fileList.length > 0) {
      if (this.isAllowedType(fileList[0].name)) {
        if (fileList[0].size < 5242880) {
          item.file = fileList[0].name
          this.formModel.controls[item.documentCode].setValue(fileList[0])
        } else {
          event.target.value = null
          this.formModel.controls[item.documentCode].setValue(null)
          this.smq.publish('error-mq', this.translate.instant('financeProduct.newRequest.fileTypeError'))
        }
      } else {
        event.target.value = null
        this.formModel.controls[item.documentCode].setValue(null)
        this.smq.publish('error-mq', this.translate.instant('financeProduct.newRequest.fileSizeError'))
      }
    }
  }

  isAllowedType(name: string) {
    const type = name.split('.').pop().toLowerCase()
    return type == 'pdf' || type == 'jpeg' || type == 'jpg' || type == 'gif' || type == 'png'
  }


  ChangeRepaymentOption(value) {
    this.formModel.controls['repaymentOption'].value = value
    this.formModel.controls['repaymentOption'].patchValue(value)
  }

  openTermsConditions() {
    this.mrccService.getPDFFile('msb_revolving_credit_card_terns_and_conditions.pdf', 'MRCC T&C.pdf').subscribe((res) => {
      if (res != null) {
        saveAs(res.file, res.fileName)
      }
    })
  }
}