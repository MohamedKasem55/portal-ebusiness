import {Component, EventEmitter, HostListener, OnInit, Output} from '@angular/core'
import {FinanceFleetNewReqService} from "../../fleet-finance.service";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {json} from "ngx-custom-validators/src/app/json/validator";

@Component({
    selector: 'docs-step',
    templateUrl: './docs-step.component.html',
    styleUrls: ['./docs-step.component.scss'],
})
export class DocsStepComponent implements OnInit {
    @Output() NextStep: EventEmitter<number> = new EventEmitter()
    public requiredDocsList: any = []
    public uploadDocElm: any = []
    public documentUploadedLst: any = []
    uploadForm: FormGroup
    public dossairID;
    public file: File | null = null;
    validateFileSize: boolean = false
    validateFileUploadSuccess: boolean = false
    showFileUploadError = -1
    showFileSizeError = -1
    public fileID: any;


    constructor(
        private formBuilder: FormBuilder,
        private fleetServiceReq: FinanceFleetNewReqService,
        public router: Router,
    ) {
        this.dossairID = sessionStorage.getItem("dossairID")
    }

    getRequiredDocs() {
        this.fleetServiceReq.getMandatoryDocs().subscribe((res) => {
            if (res === null) {
                this.router.navigate(['/']).then(() => {
                })
            } else {
                this.uploadDocElm = this.uploadDocVal
                res.documentInfos.map(element => {
                    this.requiredDocsList.push(element)
                    this.uploadDocElm.push(this.formBuilder.control('', Validators.required))
                })
            }
        })
    }

    @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
        const file = event && event.item(0);
        this.file = file;
    }

    ngOnInit(): void {
        this.fleetServiceReq.setCurrentStep(4);
        this.getRequiredDocs();
        this.uploadForm = this.formBuilder.group({
            uploadDocVal:this.formBuilder.array([])
        });
    }
    get uploadDocVal(): FormArray {
        return this.uploadForm.get('uploadDocVal') as FormArray;
    }
    createForm() : void{
        this.uploadForm = this.formBuilder.group({
            uploadDocVal: this.formBuilder.array(
                this.requiredDocsList.map(values =>{
                    return this.formBuilder.group(values.findIndex(values))
                })
            )
        })
    }
    navigateTo(stepNumber: number) {
        this.NextStep.emit(stepNumber)
    }

    onFileSelected(event, uploadFileIndex) {
        this.file = event.target.files[0];
        let fileSize = this.file?.size / 1024 / 1024
        let selectedDocObj: any = "";

        selectedDocObj = this.requiredDocsList[uploadFileIndex]

        if (this.file && fileSize <= 5) {
            this.validateFileSize = false

            this.fleetServiceReq.fileToBas64(this.file).then((dataURL) => {
            this.fleetServiceReq.uploadDocument(this.dossairID,selectedDocObj?.documentCode?.toString(),this.file,dataURL ).subscribe((res) => {
                if (res === undefined || res === null) {
                    this.clearForm(uploadFileIndex)
                    this.validateFileUploadSuccess = true
                    this.showFileUploadError = uploadFileIndex
                    this.showFileSizeError = -1
                } else {

                    this.fileID = (document.getElementById(`uploadDocVal_${uploadFileIndex}`) as HTMLInputElement)
                    this.fileID.value = this.file.name;
                    this.fileIcon(uploadFileIndex)
                    this.fileUploadErrorReset()

                    this.documentUploadedLst.push({title:selectedDocObj?.name ,name: this.file.name})
                    sessionStorage.setItem('documentUploadedVal' , JSON.stringify(this.documentUploadedLst))

                }
            })
            })
        } else {
            this.validateFileSize = true
            this.showFileSizeError = uploadFileIndex
            this.clearForm(uploadFileIndex)
        }

    }

    clearForm(index) {
        this.file = null
        this.fileID = (document.getElementById(`uploadDocVal_${index}`) as HTMLInputElement)
        let fileDoc = (document.getElementById(`uploadDoc_${index}`) as HTMLInputElement)
        fileDoc.value = '';
        this.fileID.value = '';
        this.uploadForm.setErrors({ 'invalid': true });
    }


      fileUploadErrorReset(){
          this.showFileUploadError = -1
          this.showFileSizeError = -1
    }
    fileIcon(idx){
        let fileIcon = (document.getElementById(`docIcon_${idx}`) as HTMLInputElement)
        fileIcon.className = 'doc-icon'
        let closeIcon = (document.getElementById(`closeIcon_${idx}`) as HTMLInputElement)
        closeIcon.className = 'close-icon'
        let uploadSpan = (document.getElementById(`cancelDoc_${idx}`) as HTMLInputElement) // hide upload in case file uploaded
        uploadSpan.className = 'file-input'

    }
    clearFileIcon(idx){
        let fileIcon = (document.getElementById(`docIcon_${idx}`) as HTMLInputElement)
        fileIcon.className = ''
        let closeIcon = (document.getElementById(`closeIcon_${idx}`) as HTMLInputElement)
        closeIcon.className = ''
        let uploadSpan = (document.getElementById(`cancelDoc_${idx}`) as HTMLInputElement) // unhide upload in case file uploaded
        uploadSpan.className = ''
    }
    onCancelFile(idx){
        this.clearForm(idx)
        this.clearFileIcon(idx)
        this.uploadForm.setErrors({ 'invalid': true });
    }
    cancelButton(){
        this.uploadForm.reset()
    }
}
