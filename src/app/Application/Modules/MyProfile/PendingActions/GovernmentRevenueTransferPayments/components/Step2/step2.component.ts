import {Component, OnInit, ViewChild} from '@angular/core'
import {Router} from '@angular/router'
import {TranslateService} from '@ngx-translate/core'
import {ResponseGenerateChallenge} from 'app/Application/Model/responsegeneratechallenge.type'
import {RequestValidate} from '../../../../../../Model/requestvalidateType'
import {GovernmentRevenueTransferPaymentsService} from '../../government-revenue-transfer-payments.service'
import {AbstractAppComponent} from "../../../../../Common/Components/Abstract/abstract-app.component";

@Component({
    templateUrl: './step2.component.html',
})
export class Step2Component extends AbstractAppComponent implements OnInit {
    @ViewChild('authorization') authorization: any

    step = 2
    sharedData: any = {}
    generateChallengeAndOTP: ResponseGenerateChallenge
    batchListItems: any = []
    batchFileListItems: any = []

    constructor(
        private service: GovernmentRevenueTransferPaymentsService,
        public translate: TranslateService,
        private router: Router,
    ) {
        super(translate)
    }

    ngOnInit(): void {
        super.ngOnInit();

        if (this.sharedData.govRevTransPayTableSelected.length === 0
            && this.sharedData.govRevFileTransPayTableSelected.length === 0
        ) {
            this.router.navigate([
                '/myprofile/pending/government-revenue-transfer-payments/step1',
            ])
            return;
        }

        if (this.sharedData.approveFlow) {

            this.sharedData.requestValidate = new RequestValidate()

            this.batchListItems = [].concat(
                this.sharedData.authorizeValidate.batchList.toProcess,
                this.sharedData.authorizeValidate.batchList.toAuthorize,
                this.sharedData.authorizeValidate.batchList.notAllowed,
            );
            this.batchFileListItems = [].concat(
                this.sharedData.authorizeValidate.batchFileList.toProcess,
                this.sharedData.authorizeValidate.batchFileList.toAuthorize,
                this.sharedData.authorizeValidate.batchFileList.notAllowed,
            )
        }
    }

    valid() {
        if (typeof this.authorization != 'undefined') {
            return !this.authorization || this.authorization.valid()
        } else {
            return true
        }
    }
}
