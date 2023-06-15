import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core'
import {AbstractAppComponent} from "../../../Common/Components/Abstract/abstract-app.component";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-government-revenue-upload-file-step3',
    templateUrl: './upload-file-step3.component.html',
    styleUrls: ['./upload-file.component.scss'],
})
export class FileUploadStep3Component extends AbstractAppComponent implements OnInit {
    @Output() onInit = new EventEmitter<any>()
    step: number
    generateChallengeAndOTP: any

    constructor(public translate: TranslateService) {
        super(translate)
        this.step = 3
    }

    ngOnInit() {
        super.ngOnInit();
        this.onInit.emit(this)
    }

    isPending() {
        //console.log(this.initPayment);
        if (
            this.generateChallengeAndOTP &&
            (this.generateChallengeAndOTP.typeAuthentication === 'STATIC' ||
                this.generateChallengeAndOTP.typeAuthentication === 'OTP' ||
                this.generateChallengeAndOTP.typeAuthentication === 'CHALLENGE')
        ) {
            return false
        } else {
            return true
        }
    }
}
