import { Component, OnDestroy, OnInit, Input } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { FinanceProductNewRequestService } from '../finance-product-new-request.service'

@Component({
  selector: 'finance-product-new-request-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.scss'],
})
export class FinishComponent implements OnInit, OnDestroy {
  @Input() formModel: FormGroup
  @Input() informationFormModel: FormGroup
  @Input() mandatoryDocuments: any = []
  @Input() productType;

  public dossierId = ''

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public translate: TranslateService,
    public newRequestService: FinanceProductNewRequestService,
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.dossierId = this.formModel.controls['dossierId'].value
  }

  upload(item) {
    this.mandatoryDocuments.forEach((element) => {
      if (element.documentCode === item.documentCode) {
        element.uploadStatus = 0
        const file = this.informationFormModel.controls[element.documentCode]
          .value
        this.newRequestService.convertFileToURL(file).then((dataURL) => {
          this.newRequestService
            .attachDocument(
              this.dossierId,
              element.documentCode,
              this.informationFormModel.controls[element.documentCode].value,
              dataURL,
            )
            .subscribe((result: any) => {
              if (result === null) {
                element.uploadStatus = 1
              } else {
                if (result.errorCode !== '0') {
                  element.uploadStatus = 1
                } else {
                  element.uploadStatus = 2
                }
              }
            })
        })
      }
    })
  }
}
