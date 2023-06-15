import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type';
import { RequestValidate } from 'app/Application/Model/requestvalidateType';
import { AbstractAppComponent } from "../../../Common/Components/Abstract/abstract-app.component";

@Component({
    selector: 'app-government-revenue-upload-file-step2',
    templateUrl: './upload-file-step2.component.html',
    styleUrls: ['./upload-file.component.scss'],
})
export class FileUploadStep2Component
    extends AbstractAppComponent
    implements OnInit {

    @Output() onInit = new EventEmitter<any>()

    @Input() initPayment: any

    step: number

    generateChallengeAndOTP: ResponseGenerateChallenge

    requestValidate: RequestValidate = new RequestValidate()
    suspicious: []
    constructor(public translate: TranslateService) {
        super(translate)
        this.step = 2
    }

    ngOnInit() {
        super.ngOnInit()
        this.onInit.emit(this)
    }

    refreshData() {
        super.refreshData();
        this.generateChallengeAndOTP = this.initPayment.generateChallengeAndOTP
        this.suspicious =
            this.initPayment.suspiciousPendingUploadDuplicatedFiles.concat(
                this.initPayment.suspiciousSentUploadDuplicatedFiles,
            )
    }

    public getParsedDate(date: string): string {
        return date;
        if (!date || date.trim() === "") {
            return "";
        }
        const parsedDate: string = date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8);
        return parsedDate;
    }
}
