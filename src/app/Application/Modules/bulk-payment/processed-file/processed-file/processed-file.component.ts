import {Component, OnInit, ViewChild} from '@angular/core'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import {LangChangeEvent, TranslateService} from '@ngx-translate/core'
import {Subject} from 'rxjs'
import {takeUntil} from 'rxjs/operators'
import {StorageService} from '../../../../../core/storage/storage.service'
import {Exception} from '../../../../Model/exception'
import {PagedData} from '../../../../Model/paged-data'
import {ProcessedFileService} from './processed-file.service'
import {RequestValidate} from 'app/Application/Model/requestvalidateType'
import {ResponseGenerateChallenge} from 'app/Application/Model/responsegeneratechallenge.type'
import {StaticService} from '../../../Common/Services/static.service'
import {AbstractDatatableMobileComponent} from '../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import {AuthenticationService} from '../../../../../core/security/authentication.service'
import {DatePipe} from '@angular/common'
import {CombinedFileDownloadRequest} from "../../../../Model/combined-file-download-request";
import {saveAs} from "file-saver";

@Component({
    selector: 'app-processed-file',
    templateUrl: './processed-file.component.html',
    styleUrls: ['./processed-file.component.scss'],
})
export class ProcessedFileComponent
    extends AbstractDatatableMobileComponent
    implements OnInit {
    @ViewChild('processedBatchTable') table: any
    @ViewChild('processedFilesTable') filesGetFiles: any
    @ViewChild('filesDetailsTable') viewFileDetail: any

    @ViewChild('authorization') authorization: any

    searcher: FormGroup
    bsConfig: any
    process: any
    isSearchCollapsed = true
    organization: any
    cic: any
    companyName: any
    debitAccountNumbers: any
    paymentDatefrom: any
    convertedDate: any
    searchList: any
    listOfFiles: any
    tableDisplaySize = 20

    viewProcessedFilesPage: any
    rowDetail: any
    viewProcessedFilesGetFiles: PagedData<any>
    step = 'list'
    today = new Date()
    purpose: string[] = []
    requestValidate = new RequestValidate()
    batchName
    amountFrom
    amountTo
    paymentDateto
    initiationDateFrom
    initiationDateTo
    debitAccount
    customerReference
    systemFileName
    fileType
    fileStatus
    result
    viewFileDetails
    fileDetails
    fileDetailList
    bulkPayment
    currentFileDetail
    generateChallengeAndOTP: ResponseGenerateChallenge
    tableSelected = []
    fileToCancel
    combosData: any = {}
    listType: any;

    constructor(
        public fb: FormBuilder,
        public translate: TranslateService,
        public router: Router,
        private formBuilder: FormBuilder,
        public staticService: StaticService,
        public proccessedfileservice: ProcessedFileService,
        public authenticationService: AuthenticationService,
        protected datePipe: DatePipe,
        public storageService: StorageService,
    ) {
        super(fb, translate, authenticationService, router)

        const currentUser = JSON.parse(this.storageService.retrieve('currentUser'))
        this.cic = currentUser['company']['profileNumber']
        this.companyName = currentUser['company']['companyName']
        this.viewProcessedFilesGetFiles = new PagedData<any>()

        this.bsConfig = Object.assign(
            {},
            {
                showWeekNumbers: false,
                adaptivePosition: true,
                containerClass: 'theme-dark-blue',
                dateInputFormat: 'DD/MM/YYYY',
            },
        )
        this.isSearchCollapsed = true

        this.createFormModel()
    }

    ngOnInit() {
        super.ngOnInit()
    }

    refreshData() {
        super.refreshData()
        // Get all company accounts
        this.proccessedfileservice.getAccounts().subscribe((result) => {
            this.debitAccountNumbers = result
        })

        // Get static data
        const combosKeys: any = [
            'payrollFileType',
            'payrollPaymentPurpose',
            'bankCode',
            'bankCodeConversion',
        ]
        this.subscriptions.push(
            this.staticService
                .getAllCombosAsArrays(combosKeys)
                .subscribe((resultC) => {
                    const data: any = resultC
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < combosKeys.length; i++) {
                        this.combosData[combosKeys[i]] = data[combosKeys[i]]
                    }
                    // ---------------------
                    this.search()
                }),
        )
    }

    search() {
        this.searcher.patchValue({rows: 20})
        const param = this.searcher.value

        param.paymentDatefrom = this.convert(param.paymentDatefrom)
        param.paymentDateto = this.convert(param.paymentDateto)
        param.initiationDateFrom = this.convert(param.initiationDateFrom)
        param.initiationDateTo = this.convert(param.initiationDateTo)

        this.proccessedfileservice.searcher(param).subscribe((result) => {
            if (result instanceof Exception) {
                this.onError(result)
                return
            } else {
                this.searchList = result
                this.viewProcessedFilesPage = result
                localStorage.setItem('searchList', JSON.stringify(this.searchList))
                //this.listOfFiles = this.searchList.listFile.items;
            }
        })
    }

    getAllTables(): any[] {
        const tablas = []
        if (this.table) {
            tablas.push(this.table)
        }
        if (this.filesGetFiles) {
            tablas.push(this.filesGetFiles)
        }
        if (this.viewFileDetail) {
            tablas.push(this.viewFileDetail)
        }
        return tablas
    }

    createFormModel() {
        this.searcher = this.formBuilder.group({
            batchName: ['', Validators.required],
            amountFrom: ['', Validators.required],
            amountTo: ['', Validators.required],
            paymentDatefrom: ['', Validators.required],
            paymentDateto: ['', Validators.required],
            initiationDateFrom: ['', Validators.required],
            initiationDateTo: ['', Validators.required],
            debitAccount: ['', Validators.required],
            customerReference: ['', Validators.required],
            systemFileName: ['', Validators.required],
            fileType: ['', Validators.required],
            rows: ['', Validators.required],
            page: [1, Validators.required],
            search: ['true', Validators.required],
            fileStatus: ['', Validators.required],
        })
    }

    onError(error: any) {
        const res = error
    }

    convert(str) {
        if (str && str instanceof Date) {
            return this.datePipe.transform(str, 'yyyy-MM-dd')
        }
        return
    }

    reset() {
        this.searcher.reset()
        this.batchName = ''
        this.amountFrom = ''
        this.amountTo = ''
        this.paymentDatefrom = ''
        this.paymentDateto = ''
        this.initiationDateFrom = ''
        this.initiationDateTo = ''
        this.debitAccount = ''
        this.customerReference = ''
        this.systemFileName = ''
        this.fileType = ''
        this.fileStatus = ''
        // this.searcher.value.batchName = "";
        // this.searcher.value.amountFrom = "";
        // this.searcher.value.amountTo = "";
        // this.searcher.value.paymentDatefrom = "";
        // this.searcher.value.paymentDateto = "";
        // this.searcher.value.initiationDateFrom = "";
        // this.searcher.value.initiationDateTo = "";
        // this.searcher.value.debitAccount = "";
        // this.searcher.value.customerReference = "";
        // this.searcher.value.systemFileName = "";
        // this.searcher.value.fileType = "";
        // this.searcher.value.fileStatus = "";
        this.searcher.get('rows').setValue(20)
        this.searcher.get('page').setValue(1)
        this.searcher.get('search').setValue(true)
        this.refreshData()
    }

    toggleRow(row) {
        this.table.rowDetail.collapseAllRows()

        const data = row
        this.proccessedfileservice.filterRelatedFiles(data).subscribe((result) => {
            if (result === null) {
                this.onError(result)
            } else {
                this.viewProcessedFilesGetFiles = result
                if (this.rowDetail != row) {
                    this.table.rowDetail.toggleExpandRow(row)
                    this.rowDetail = row
                } else {
                    this.rowDetail = null
                }
            }
        })
    }

    goToStopDetails(value, row) {
        this.rowDetail = null
        this.fileToCancel = row
        this.getFileDetails(value, row)
    }

    goToFileDetails(value, row) {
        this.rowDetail = null
        this.fileToCancel = row
        this.getFileDetails(value, row)
    }

    canStopFile(row) {
        return (
            this.authenticationService.activateOption(
                'BulkProcessedFiles',
                ['BULKPAYMENTS_PRIVILEGE'],
                ['BulkPaymentsFileCancellationGroup'],
            ) && row.cancelable
        )
    }

    getFileDetails(value, row) {
        this.currentFileDetail = value
        this.proccessedfileservice.getFileDetail(row).subscribe((result) => {
            if (result === null) {
                this.onError(result)
            } else {
                this.step = 'detail';
                this.listType = result.listType;
                const result1 = JSON.parse(localStorage.getItem('viewFileDetails'))
                this.viewFileDetails = result1
                this.fileDetails = result['fileDetail']
                this.generateChallengeAndOTP = result.generateChallengeAndOTP
                localStorage.setItem('file', this.fileDetails)
                this.fileDetailList = this.fileDetails.wpsBulkDetailsDTOList //result["fileDetailsList"];
                this.fileDetailList.forEach((file) => {
                    file['bankName'] = this.getBankName(file['bankCode'])
                    file['paymentP'] = file['paymentPurpose']
                })
                this.bulkPayment = result['bulkPaymentsDetailsDTO']
            }
        })
    }

    goToViewCancel(value, type) {
        //this.rowDetail = null;
        this.getCancelFile(value, type)
    }

    getCancelFile(value, type) {
        this.currentFileDetail = value
        this.proccessedfileservice.getViewCancel(type).subscribe((result) => {
            if (result === null) {
                this.onError(result)
            } else {
                this.step = 'detail'
                this.step = 'cancel'
                const result1 = JSON.parse(localStorage.getItem('viewFileDetails'))

                this.generateChallengeAndOTP = result.generateChallengeAndOTP
                this.viewFileDetails = result1
                this.fileDetails = result['fileDetail']
                this.fileDetailList = result['fileDetailsList']
                this.bulkPayment = result['bulkPaymentsDetailsDTO']
            }
        })
    }

    isCancelAllowed() {
        return this.authenticationService.activateOption(
            'BulkProcessedFiles',
            ['BULKPAYMENTS_PRIVILEGE'],
            ['BulkPaymentsFileCancellationGroup'],
        )
    }

    isCancelableSelectedFile() {
        if (this.fileDetails['type'] !== 's' && this.fileDetails['type'] !== 'S') {
            return false
        }
        if (this.fileDetails['cancelled'] == true) {
            return false
        }
        if (this.fileDetails['cancelable'] == true) {
            return true
        }
        return false
    }

    returnList(): void {
        this.step = 'list'
        this.search()
    }

    finishResult = {}

    delete() {
        this.proccessedfileservice
            .deleteFile(this.fileDetails, this.requestValidate)
            .subscribe((result) => {
                if (result === null) {
                    this.onError(result)
                } else {
                    this.finishResult = result
                    this.step = 'finish'
                }
            })
    }

    setPage(dataTableEvent) {
        if (dataTableEvent == null) {
            dataTableEvent = {offset: 0}
        }
        this.searcher.patchValue({
            rows: this.viewProcessedFilesPage.page.pageSize,
        })
        this.searcher.patchValue({page: dataTableEvent.offset + 1})
        this.proccessedfileservice
            .searcher(this.searcher.value)
            .subscribe((result) => {
                if (result instanceof Exception) {
                    this.onError(result)
                    return
                } else {
                    this.searchList = result
                }
            })
    }

    setPageRelated(dataTableEvent) {
        if (dataTableEvent == null) {
            dataTableEvent = {offset: 0}
            return dataTableEvent.offset
        }
    }

    valid(): boolean {
        if (this.authorization) {
            return this.authorization.valid()
        } else {
            return true
        }
    }

    cancelFile() {
        this.delete()
    }

    validateCancel() {
        const value = this.fileToCancel
        this.proccessedfileservice.getViewCancel(value).subscribe((result) => {
            if (result === null) {
                this.onError(result)
            } else {
                //this.step = "detail";
                this.step = 'cancel'
                const result1 = JSON.parse(localStorage.getItem('viewFileDetails'))

                this.generateChallengeAndOTP = result.generateChallengeAndOTP
                this.viewFileDetails = result1
                this.fileDetails = result['fileDetail']
                this.fileDetailList = result['fileDetailsList']
                this.bulkPayment = result['bulkPaymentsDetailsDTO']
            }
        })
    }

    downloadFile() {
        // TODO when endpoint to download file be ready
        this.proccessedfileservice
            .downloadFile(this.bulkPayment, this.fileDetails)
            .subscribe((response) => {
                if (response === null) {
                } else {
                    const blobObject = response
                    if (window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(
                            blobObject,
                            this.fileDetails['fileName'],
                        )
                    } else {
                        const downloadUrl = URL.createObjectURL(blobObject)
                        const link = document.createElement('a')
                        link.download = this.fileDetails['fileName']
                        link.href = downloadUrl
                        document.body.appendChild(link)
                        link.click()
                    }
                }
            })
    }

    getId(row): any {
    }

    getList(searchElement, order, orderType, offset, pageSize) {
    }

    getBankName(bankCode) {
        const f = this.combosData['bankCodeConversion'].find(
            (item) => item.value == bankCode,
        )
        if (!f) {
            return null
        }
        const f2 = this.combosData['bankCode'].find((item) => item.key == f.key)
        return f2 ? f2.value : null
    }

    downloadCombinedFilePDF(selectedRow) {
        const combinedFileDownloadRequest: CombinedFileDownloadRequest = new CombinedFileDownloadRequest();
        combinedFileDownloadRequest.fileName = this.fileDetails.fileName;
        combinedFileDownloadRequest.companyCode = this.fileDetails.companyCode;
        combinedFileDownloadRequest.accountFrom = this.fileDetails.accountFrom;
        combinedFileDownloadRequest.batchPK = this.fileDetails.batchPk;

        combinedFileDownloadRequest.beneficiaryAccount = selectedRow.account;
        combinedFileDownloadRequest.systemLineReference = selectedRow.systemLineReference;

        this.proccessedfileservice.downloadCombinedFileReceipt(combinedFileDownloadRequest).subscribe((res) => {
            saveAs(res.file, res.fileName)
        })
    }
}
