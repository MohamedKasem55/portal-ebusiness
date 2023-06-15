import {ChangeDetectorRef, Component, OnInit} from '@angular/core'
import {TranslateService} from '@ngx-translate/core'
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthenticationService} from 'app/core/security/authentication.service';
import {AbstractAppComponent} from "../../../../Common/Components/Abstract/abstract-app.component";
import { GovernmentRevenueService } from '../../../Services/government-revenue.service';
import { Exception } from 'app/Application/Model/exception';

@Component({
    selector: 'app-government-revenue-upload-details',
    templateUrl: './upload-file-details.component.html',
})
export class FileUploadRequestStatusDetailsComponent
    extends AbstractAppComponent
    implements OnInit {

    public initPayment: any;

    constructor(public translate: TranslateService,
                public router: Router,
                public govRevService: GovernmentRevenueService,
                ) {
        super(translate)
    }

    ngOnInit() {
        super.ngOnInit()
        const bulkUpload = this.govRevService.bulkUpload
        if (bulkUpload) {
          this.subscriptions.push(
            this.govRevService
              .detailFileRequestStatus(bulkUpload)
              .subscribe((result) => {
                if (this.hasError(result)) {
                  this.onError(result)
                  return
              } else {
                    this.initPayment = result.batch
                }
              }),
          )
        } else {
          this.back()
        }
    }

    refreshData() {
        super.refreshData();
    }

    back() {
        this.router.navigate(['/government-revenue/request-status'])
    }
}
