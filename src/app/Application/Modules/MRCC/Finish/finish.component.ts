import { Component, OnDestroy, OnInit, Input } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { MRCCService } from '../mrcc.service'

@Component({
  selector: 'mrcc-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.scss'],
})
export class FinishComponent implements OnInit, OnDestroy {
  @Input() formModel: FormGroup
  @Input() mandatoryDocuments: any = []

  public dossierId = ''

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public translate: TranslateService,
    public mrccService: MRCCService,
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.dossierId = this.formModel.controls['dossierId'].value
  }


  upload(item) {
    this.mandatoryDocuments.forEach((element) => {
      if (element.documentCode === item.documentCode) {
        element.uploadStatus = 0
        const file = this.formModel.controls[element.documentCode]
          .value
        this.mrccService.convertFileToURL(file).then((dataURL) => {
          this.mrccService
            .attachDocument(
              this.dossierId,
              element.documentCode,
              this.formModel.controls[element.documentCode].value,
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
