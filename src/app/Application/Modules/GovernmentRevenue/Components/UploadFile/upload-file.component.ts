import { Component, HostListener, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { Exception } from 'app/Application/Model/exception'
import { FileUploadStep1Component } from './upload-file-step1.component'
import { FileUploadStep2Component } from './upload-file-step2.component'
import { UploadFileService } from './upload-file.service'
import { FileUploadStep3Component } from './upload-file-step3.component'
import { AbstractDatatableMobileComponent } from "../../../Common/Components/Abstract/abstract-datatable-mobile.component";
import { FormBuilder } from "@angular/forms";
import { AuthenticationService } from "../../../../../core/security/authentication.service";
import { Router } from "@angular/router";
import { PendingActionsNotificaterService } from "../../../Common/Components/PendingActions/pending-actions-notificater.service";

@Component({
    selector: 'app-government-revenue-upload-file',
    templateUrl: './upload-file.component.html',
    styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent
    extends AbstractDatatableMobileComponent
    implements OnInit {

    @ViewChild('reportModal', { static: true })
    public reportModal: ModalDirective
    @ViewChild('reportErrorTable') table: any

    @ViewChild(FileUploadStep1Component)
    step1Component: FileUploadStep1Component
    @ViewChild(FileUploadStep2Component)
    step2Component: FileUploadStep2Component
    @ViewChild(FileUploadStep3Component)
    step3Component: FileUploadStep2Component
    step: number
    errorMessage: any = {}

    initiateData: any = {};
    uploadErrors = false
    uploadFileValidationResponse: any = {}
    generateChallengeAndOTP: any

    batchName: any
    file: File
    reportErrorTable: any
    minWidthErrorColumn: number

    constructor(
        public service: UploadFileService,
        public fb: FormBuilder,
        public translate: TranslateService,
        public authenticationService: AuthenticationService,
        public router: Router,
        private pendingActionNotification: PendingActionsNotificaterService,
    ) {
        super(fb, translate, authenticationService, router);
        this.step = 1
        // this.service.getCompanyDetails().subscribe()
    }

    ngOnInit() {
        super.ngOnInit();
    }

    refreshData() {
        super.refreshData();
        this.service
            .initiate({})
            .subscribe((result) => {
                if (result instanceof Exception) {
                    this.onError(result)
                    return
                } else {
                    this.initiateData = result;
                }
            })
    }

    getAllTables(): any[] {
        const tablas = []
        if (this.table) {
            tablas.push(this.table)
        }
        return tablas
    }

    isDisabled() {
        if (this.step == 1) {
            if (
                this.step1Component != null &&
                this.step1Component.file != null &&
                this.step1Component.batchName != null
                && this.step1Component.batchName.trim() !== ''
            ) {
                return false
            }
            return true;
        }
        if (this.step == 2) {
            if (this.uploadFileValidationResponse?.generateChallengeAndOTP) {
                return !this.step2Component.requestValidate.valid();
            }
            return false;
        }
        return true
    }

    cancel() {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/government-revenue/upload-file'])
        });
    }

    previous() {
        this.step = --this.step % 4
        if (this.step === 0) {
            this.step = 1
        }
    }

    next() {
        if (this.step === 0) {
            this.step = 1
        }

        switch (this.step) {
            case 1:
                this.validateUpload()
                break
            case 2:
                this.confirmUploadFile()
                break
            case 3:
                this.file = null
                this.nextStep()
                break
        }
    }

    validateUpload() {
        this.file = this.step1Component.file
        this.service
            .validate(this.step1Component.file, this.step1Component.batchName, this.initiateData)
            .subscribe((result) => {
                if (result instanceof Exception) {
                    this.onError(result)
                    return
                } else {
                    this.uploadFileValidationResponse = result
                    if (this.uploadFileValidationResponse.numberLinesWithErrors &&
                        this.uploadFileValidationResponse.numberLinesWithErrors > 0) {
                        this.reportModal.show()
                        if (this.table) {
                            this.minWidthErrorColumn = (window.innerWidth / 400) * 80
                        }
                    } else {
                        if (this.uploadFileValidationResponse.govRevenueFileUploadBatchDSO) {
                            this.nextStep()
                        }
                    }
                }
            })
    }

    confirmUploadFile() {
        this.generateChallengeAndOTP = this.step2Component.generateChallengeAndOTP
        this.service
            .confirm(this.uploadFileValidationResponse, this.step2Component.requestValidate)
            .subscribe((result) => {
                if (result instanceof Exception) {
                    this.onError(result)
                    return
                } else {
                    this.pendingActionNotification.getRefreshObserver().next(true);
                    this.nextStep()
                }
            })
    }

    nextStep() {
        this.step = ++this.step % 4

        if (this.step === 0) {
            this.step = 1
        }

        window.scrollTo(0, 0);
    }

    onError(error: any) {
        const res = error
        this.errorMessage['code'] = res.errorCode
        this.errorMessage['description'] = res.errorDescription
    }

    onInitStep1(event) {
        this.step1Component = event
    }

    onInitStep2(event) {
        this.step2Component = event
    }

    onInitStep3(event) {
        this.step3Component = event
        this.step3Component.generateChallengeAndOTP = this.generateChallengeAndOTP
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.minWidthErrorColumn = (window.innerWidth / 400) * 80
    }

    getList(searchElement: any, order: any, orderType: any, offset: any, pageSize: any) {
        // throw new Error("Method not implemented.")
    }

    getId(row: any) {
        // throw new Error("Method not implemented.")
    }

    public getNumberOfPages(records: number, pageSize: number): number {
        const elementByPage: number = pageSize;
        let pagesTable: number = 0;
        let page: number = Math.round(records) / elementByPage;
        if (page % 1 !== 0) {
            pagesTable = Math.trunc(records / elementByPage) + 1;
        }
        return pagesTable;
    }

    public getRemainingRecords(currentPage: number, pageSize: number, records: number): number {
        const elementByPage: number = pageSize;
        const numberOfPage: number = this.getNumberOfPages(records, pageSize);
        let remainingRecords: number = 0;
        if (currentPage !== numberOfPage) {
            remainingRecords = elementByPage;
        } else {
            const lastPage: number = records % elementByPage;
            remainingRecords = lastPage;
        }
        return remainingRecords;
    }
}
