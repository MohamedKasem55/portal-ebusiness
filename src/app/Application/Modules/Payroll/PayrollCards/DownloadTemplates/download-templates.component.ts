import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { Subscription } from 'rxjs'
import { AbstractAppComponent } from '../../../Common/Components/Abstract/abstract-app.component'
import { PayrollCardsService } from '../payroll-cards.service'
import { DownloadTemplatesService } from './download-templates.service'
import {saveAs} from "file-saver";
@Component({
  selector: 'app-download-templates',
  templateUrl: './download-templates.component.html',
  styleUrls: ['./download-templates.component.scss'],
})
export class DownloadTemplatesComponent
  extends AbstractAppComponent
  implements OnInit
{
  rol: string
  file: string
  downloadTemplatesSubscription: Subscription
  status: boolean
  @ViewChild('errorFileModal', { static: true }) errorFileModal: ModalDirective
  errorMessage: string

  constructor(
    private router: Router,
    private downloadTemplatesService: DownloadTemplatesService,
    private serviceshare: PayrollCardsService,
    public translate: TranslateService,
  ) {
    super(translate)
  }

  ngOnInit(): void {
    this.downloadTemplatesSubscription = this.serviceshare
      .getInstitution()
      .subscribe((res) => {
        if (typeof this.downloadTemplatesSubscription != 'undefined') {
          this.downloadTemplatesSubscription.unsubscribe()
        }
        this.rol = res.institutionDTO.layout
        this.rol.toLowerCase()

        switch (this.rol) {
          case 'standard': {
            this.file = 'PayrollCardsUploadGroup.xls'
            break
          }
          case 'group': {
            this.file = 'PayrollCardsUploadGroup.xls'
            break
          }
          case 'wps': {
            this.file = 'PayrollCardsUploadWPS.xls'
            break
          }
          default:
            this.file = null
            this.status = false
        }
      })
  }

  emitFile(): void {
    this.downloadTemplatesService.getFile(this.file).subscribe((res) => {
      if (res.hasOwnProperty('fileName') && res.fileName != null) {
        saveAs(res.file, this.file)
      } else {
        this.errorMessage = this.translate.instant('payroll.fileNotFound')
        if (!this.errorFileModal.isShown) {
          this.errorFileModal.show()
        }
      }
    })
  }
}
