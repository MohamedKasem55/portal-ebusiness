import {
  Component,
  HostBinding,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { DomSanitizer, SafeStyle } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { SimpleMQ } from 'ng2-simple-mq'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { PagedData } from '../../../../Model/paged-data'
import { IBop } from '../../Model/bop.model'
import { MerchantToolsDocumentationService } from '../../Services/merchant-tools-documentation.service'
import {saveAs} from "file-saver";
@Component({
  selector: 'app-bop',
  templateUrl: './bop.component.html',
  styleUrls: ['./bop.component.scss'],
})
export class BopComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @HostBinding('class') classCss = 'col-md-12'
  @HostBinding('style')
  get myStyle(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle('padding: 0 !important;')
  }
  tablePage: PagedData<IBop>
  subscriptions: Subscription[] = []
  columns: any[]
  constructor(
    private bopService: MerchantToolsDocumentationService,
    public translate: TranslateService,
    private sanitizer: DomSanitizer,
    private injector: Injector,
    private smq: SimpleMQ,
    public router: Router,
  ) {
    super()
    this.tablePage = new PagedData<IBop>()
    this.columns = [
      { prop: 'version', translation: 'sadadOLP.bop.version' },
      { prop: 'details', translation: 'sadadOLP.bop.details' },
    ]
  }

  ngOnInit() {
    this.setPage(null)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  setPage(pageinfo) {
    this.subscriptions.push(
      this.bopService.getList(1, 10).subscribe((result) => {
        //console.log('DATA', result);
        this.tablePage = result
      }),
    )
  }

  getDownload(bop: IBop) {
    this.subscriptions.push(
      this.bopService.downloadBop(bop).subscribe((res) => {
        saveAs(res.file, res.fileName)
      }),
    )
  }

  handleError(output) {
    if (typeof output === 'string') {
      output = JSON.parse(output)
    }
    if (output.errorCode && output.errorCode !== '0') {
      let message: string

      if (output.errorCode === '-2') {
        message = 'Following fields contains error:<br/>'
        for (const entry of output.fieldErrors) {
          message =
            message +
            '<b> - Field: ' +
            entry.field +
            ' Error: ' +
            entry.message +
            '</b><br/>'
        }
      } else {
        if (output.errorResponse) {
          if (this.injector.get(TranslateService).currentLang === 'ar') {
            message = output.errorResponse.arabicMessage
          } else {
            message = output.errorResponse.englishMessage
          }
        }
      }

      if (!message || message === '') {
        message = output.errorDescription
      }

      if (!message || message === '') {
        message = 'Operation not available'
      }

      this.subscriptions.push(
        this.translate.get(message).subscribe((value) => {
          this.smq.publish('error-mq', value)
        }),
      )
    }
  }
}
