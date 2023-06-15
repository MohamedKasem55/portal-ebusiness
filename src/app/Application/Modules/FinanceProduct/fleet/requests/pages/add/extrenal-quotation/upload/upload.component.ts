import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Breadcrumb } from 'app/Application/Modules/FinanceProduct/shared/models/common'
import { FinanceFleetNewReqService } from '../../../../fleet-finance.service'
import { Doc, PurposeUse, VehiclesLstItem } from '../../../../models/request'
import { Subscription } from 'rxjs'
import { Router } from '@angular/router'
import { isArray } from 'ngx-bootstrap/chronos'
import { element } from 'protractor';
import { TenureLimit } from 'app/Application/Modules/FinanceProduct/shared/custom_validators/tenure'
import { DownPayment } from 'app/Application/Modules/FinanceProduct/shared/custom_validators/downPayment'
import { FinanceProductNewRequestService } from 'app/Application/Modules/FinanceProduct/pos/NewRequest/finance-product-new-request.service'
declare var $: any;

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit, OnDestroy {
  quotationForm: FormGroup
  subscriptions: Subscription[] = []
  brandList: VehiclesLstItem[] = []
  modelList: VehiclesLstItem[] = []
  variantList: VehiclesLstItem[] = []
  dealersList: VehiclesLstItem[]
  breadCrumb: Breadcrumb[] = []
  personalUse: boolean = false
  validationFileSize: boolean = false
  purposeOfUseList: PurposeUse[] = [];
  editMode:boolean = false;
  selectedExternalQuotation;
  variantListWithDuplicates: VehiclesLstItem[] = [];
  yearsList:any =[]
  colors: any[] = []
  title1: string;
  title2: string;
  mindownPayment:number;
  maxFinanceTenure:number;
  fleetTranslateObject:any;
  quotationFiles = [];
  exQuotation:any;
  invalidFileError;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private financeFleetNewReqService: FinanceFleetNewReqService,
    public translate: TranslateService,
    public newRequestService: FinanceProductNewRequestService,
  ) {}

  ngOnInit(): void {
    this.colors = this.financeFleetNewReqService.colors;
    //APIs Calls
    this.getBrands();
    this.getDealers();
    //Get TranslationObj(Fleet)
    this.subscriptions.push(
      this.translate.get('fleet').subscribe((data: any) => {
        this.fleetTranslateObject = data;
        this.title1 = data.requests.externalQuotation
        this.title2 = data.requests.purposeUse
        this.invalidFileError = data.requests.invalidFile
        this.breadCrumb = [
          { txt: data.newRequest.Finance, active: false },
          { txt: data.newRequest.NoteligibleTitle, active: true },
        ]
      }),
    )
    //quotationForm
    this.quotationForm = this.formBuilder.group({
      quotations: this.formBuilder.array([this.newQuotation(true, 0)]),
    });
    this.checkSelectedQuotation()
    this.purposeOfUseList = this.financeFleetNewReqService.purposeOfUse;
     this.exQuotation = JSON.parse(sessionStorage.getItem('ExQuotations'));
  }
  
    checkSelectedQuotation(){
      this.selectedExternalQuotation = this.financeFleetNewReqService.getSelectedExternalQuotation();
      this.selectedExternalQuotation && !isArray(this.selectedExternalQuotation) ?  this.selectedExternalQuotation = [this.selectedExternalQuotation] : this.selectedExternalQuotation = this.selectedExternalQuotation      
      
      if(this.selectedExternalQuotation){
        this.editMode = true;
        this.setData(this.selectedExternalQuotation)
      }
  }

  getDealers() {
    this.subscriptions.push(
      this.financeFleetNewReqService
        .getDealers()
        .subscribe((response:any) => {
          if(response === null){
          this.router.navigate(['/']).then(() => {})
          }else{
            (Array.isArray(response.vehiclesLstItem) ? this.dealersList = response.vehiclesLstItem : this.dealersList = [])
          }
        },error=>{
          this.router.navigate(['/']).then(() => {})
        }),
    )
  }
  getBrands(): void {
    this.subscriptions.push(
      this.financeFleetNewReqService.getBrands().subscribe(
        (response: any) => {
          if (response === null) {
            this.router.navigate(['/']).then(() => {})
          } else {
            Array.isArray(response.vehiclesLstItem)
              ? (this.brandList = response.vehiclesLstItem)
              : (this.brandList = [])
          }
        },
        (error) => [this.router.navigate(['/']).then(() => {})],
      ),
    );
  }

  getModelByBrandId(brandName: string,quotationIndex,purposeIndex) {
    this.modelList = []
    this.subscriptions.push(
      this.financeFleetNewReqService.getModelsBybrandName(brandName).subscribe(
        (response: any) => {
          if (response === null) {
            this.router.navigate(['/']).then(() => {})
          } else {
            Array.isArray(response.vehiclesLstItem)
              ? (this.modelList = response.vehiclesLstItem)
              : (this.modelList = []);
              let currentModelList = document.getElementById(`modelName_${quotationIndex}_${purposeIndex}`);
              currentModelList.innerHTML=`<option value ='' disabled selected></option>`
              this.modelList.forEach(model=>{
                currentModelList.innerHTML += 
                `<option value =${model.modelName}>${model.modelName}</option>`
              });
              if(this.editMode){
                let currentPurpose = this.getPurposes(quotationIndex)?.controls[purposeIndex];
                let currentStorePurpose = this.selectedExternalQuotation[quotationIndex]?.purposes[purposeIndex]            
                currentPurpose['controls'].modelName.setValue(currentStorePurpose?.modelName);
                this.getVariantByBrandModel(currentStorePurpose.brandName,currentStorePurpose.modelName,quotationIndex,purposeIndex)

              }
          }
        },
        (error) => {
          this.router.navigate(['/']).then(() => {})
        },
      ),
    )
  }
  getVariantByBrandModel(brandName,modelName,qIndex: number, purposeIndex: number) {
    this.variantList = [];
    this.subscriptions.push(
      this.financeFleetNewReqService
        .getVariantBybrandModel(
          brandName,
          modelName,
        )
        .subscribe(
          (response: any) => {
            if (response === null) {
              this.router.navigate(['/']).then(() => {})
            } else {
              Array.isArray(response.vehiclesLstItem)
                ? (this.variantListWithDuplicates = response.vehiclesLstItem)
                : (this.variantList = []);
                this.variantList = this.removeVariantDuplicates(
                  this.variantListWithDuplicates,
                );
                let currentVariantList = document.getElementById(`vehicleVariant_${qIndex}_${purposeIndex}`);
                currentVariantList.innerHTML=`<option value ='' disabled selected></option>`
                this.variantList.forEach(element=>{
                  currentVariantList.innerHTML += 
                  `<option value ='${element.vehicleVariant}'>${element.vehicleVariant}</option>`
                });
                if(this.editMode){
                  let currentPurpose = this.getPurposes(qIndex)?.controls[purposeIndex];  
                  let currentStoredPurpose = this.selectedExternalQuotation[qIndex]?.purposes[purposeIndex]            
                  currentPurpose['controls'].vehicleVariant.setValue(currentStoredPurpose?.vehicleVariant);
                  this.getvariantYears(currentStoredPurpose.vehicleVariant,qIndex,purposeIndex)
                }
            };
          },
          (error) => {
            this.router.navigate(['/']).then(() => {})
          },
        ),
    )

  }

  removeVariantDuplicates(arr) {
    return Array.from(new Set(arr.map((a) => a.vehicleVariant))).map(
      (vehicleVariant) => {
        return arr.find((a,index) => a.vehicleVariant === vehicleVariant)
      },
    )
  }

  getvariantYears(selectedVarient,QIndex,PIndex) {
    let currentPurpose = this.getPurposes(QIndex).controls[PIndex];
    currentPurpose['controls'].modelYear.setValue(null)
    this.yearsList = this.variantListWithDuplicates.filter((element,index) => {
      return element.vehicleVariant === selectedVarient
    });

    let currentYearsList = document.getElementById(`year_list${QIndex}_${PIndex}`);
    currentYearsList.innerHTML=`<option value ='' disabled selected></option>`
    this.yearsList.forEach(element=>{
      currentYearsList.innerHTML += 
      `<option value =${element.modelYear}>${element.modelYear}</option>`
    });
    if(this.editMode){
      let currentStoredPurpose = this.selectedExternalQuotation[QIndex].purposes[PIndex]            
      currentPurpose['controls'].modelYear.setValue(currentStoredPurpose.modelYear);
      this.changeUploadInput('display-inherit','display-none',QIndex,'Signed Client Application Form');

    }
    this.getDefaultValues(QIndex,PIndex);
  }


  newQuotation(firstItem?: boolean, quotationNum?: number) {
    return this.formBuilder.group({
      quotationType: ['External'],
      quotationNum: [0],
      quotationDate: [new Date().toJSON().split('T')[0]],
      documentsInfo: [null,Validators.required],
      purposes: this.formBuilder.array([this.newPurpose()]),
    })
  }

  newPurpose() {
    return this.formBuilder.group({
      purposeOfUse: ['', Validators.required],
      brandName: ['', Validators.required],
      modelName: ['', Validators.required],
      vehicleVariant: ['', Validators.required],
      vehiclesNum: ['', Validators.compose([Validators.required,Validators.max(300),Validators.min(1)])],
      vehiclePrice: ['', Validators.required],
      purposeValue: ['', Validators.required],
      vehicleColor: ['', Validators.required],
      dealerName: ['', Validators.required],
      modelYear: ['', Validators.required],
      tenure:[null,Validators.required],
      downPmt:[null,Validators.required],
      campaign:['Standard Product'],
      vehicleType:['New Vehicle'],
      gracePeriod:['0'],
      gracePeriodType:[''],
      profitRate:[0],
      pmtFrequency:[''],
      ballonPmt:[0],
    })
  }

  get Quotations(): FormArray {
    return this.quotationForm.get('quotations') as FormArray
  }

  getPurposes(quotationIndex: number): FormArray {
    let quotations = this.quotationForm.get('quotations') as FormArray
    return quotations.at(quotationIndex).get('purposes') as FormArray
  }

  addNewQuotation(firstTime?: boolean, quotNum?: number) {
    quotNum == undefined ? quotNum = this.Quotations.controls.length : quotNum =  quotNum
    this.Quotations.push(this.newQuotation(firstTime, quotNum))
  }

  addNewPurpose(quotationIndex: number) {
    this.getPurposes(quotationIndex).push(this.newPurpose())
  }

  removePurpose(quotationIndex, purposeIndex) {
    let currentPurposes = this.getPurposes(quotationIndex)
    currentPurposes.removeAt(purposeIndex)
    document.querySelector(`#purpose_${quotationIndex}_${purposeIndex}`).remove()
    this.quotationFiles.splice(quotationIndex,1);
    if (currentPurposes.length === 0) {
      document.getElementById(`note_${quotationIndex}`).remove();
      this.Quotations.removeAt(quotationIndex);
      this.reuploadDocs(quotationIndex)
      console.log("Quotations => ",this.Quotations);
    }
  }
  reuploadDocs(removedIndex){
    for(let i= removedIndex + 1; i<=this.Quotations.length;i++){
      this.removeUploadedDocs('',i)
       }
  }
  handleUpload(event, quotationIndex, purposeIndex) {
    const file = event.target.files[0];
    const fileSize = file.size / 1024 / 1024
    const reader = new FileReader();
    (this.editMode == false ? this.setQuotationNum(quotationIndex) : '')
    if (fileSize > 5) {
      this.validationFileSize = true
      document.querySelector(`#errorFile_${quotationIndex}`).classList.add("error-color");
      document.querySelector(`#invalid_file_${quotationIndex}`).innerHTML = ''
    } else {
      this.validationFileSize = false;
      document.querySelector(`#errorFile_${quotationIndex}`).classList.remove("error-color")

      let docObj: Doc = {
        documentCode: 'FQD',
        description: 'Dealer Quotation',
        fileName: (this.editMode === false ? `${sessionStorage.getItem('dossairID')}_${this.exQuotation !=null ? quotationIndex + this.exQuotation.length + 1 : quotationIndex+1}.${file.name.split('.')[1]}` 
        :`${sessionStorage.getItem('dossairID')}_${this.Quotations.controls[quotationIndex]['controls'].quotationNum.value}.${file.name.split('.')[1]}`
        ),
        fileType: file.name.split('.')[1],
        fileContent: '',
      }
      this.changeUploadInput('display-inherit','display-none',quotationIndex,file.name);
      this.quotationFiles[quotationIndex] = file;
      this.newRequestService.convertFileToURL(file).then((dataURL) => {
        this.financeFleetNewReqService
          .uploadDocument(sessionStorage.getItem("dossairID"), 'FQD', file, dataURL,docObj.fileName)
          .subscribe((result: any) => {
            if(result === null){
              document.querySelector(`#invalid_file_${quotationIndex}`).innerHTML = `${this.invalidFileError}`
              this.validationFileSize = true;
            }else{
              this.validationFileSize = false;
              document.querySelector(`#invalid_file_${quotationIndex}`).innerHTML = ''
              this.Quotations.controls[quotationIndex]['controls'].documentsInfo.setValue(docObj)
            }
          },error=>{
            this.router.navigate(['/']).then(() => {})
          })
      })
    }
  }

  setQuotationNum(quotationIndex){
    
    this.Quotations.controls[quotationIndex]['controls'].quotationNum.setValue(this.exQuotation !=null ? quotationIndex + this.exQuotation.length + 1 : quotationIndex+1)
  }
  removeUploadedDocs(event,QIndex){ 
    (event != '' ?event.stopPropagation():'')
    this.changeUploadInput('display-none','display-inherit',QIndex,'');
    this.Quotations.controls[QIndex]['controls'].documentsInfo.setValue(null);
    this.quotationFiles.splice(QIndex,1)
  }

  changeUploadInput(crossClass,txtClass,QIndex,fileName){
    
    let fileElement = (document.getElementById(`uploadDocVal_${QIndex}`) as HTMLInputElement);
    let realFileElement = (document.getElementById(`uploadDoc_${QIndex}`) as HTMLInputElement);
    fileElement.value = `${fileName}`;
    if(fileName === ''){realFileElement.value = "";}
    

    let crossItem = (document.getElementById(`cross_icon_${QIndex}`) as HTMLInputElement);
    let uploadTxt = (document.getElementById(`upload_txt_${QIndex}`) as HTMLInputElement);
    crossItem.className = `${crossClass}`;
    uploadTxt.className = `${txtClass}`
  }

  calPurposeValue(
    vehicleNum: number,
    vehiclePrice: number,
    quotationIndex,
    purposeIndex,
  ) {
    let currentPurpose = this.getPurposes(quotationIndex).controls[purposeIndex]
    currentPurpose.value.purposeValue = vehicleNum * vehiclePrice
    currentPurpose['controls'].purposeValue.setValue(vehicleNum * vehiclePrice)
    currentPurpose.value.vehiclesNum = vehicleNum.toString()
    vehicleNum > 3 &&
    currentPurpose.value.purposeOfUse === 'MSB_FLEET_PERSONAL_VEH'
      ? (this.personalUse = true)
      : (this.personalUse = false)

  }

  submit(formValue) {
    this.financeFleetNewReqService.Quotations = {
      ...{ dossierId: sessionStorage.getItem('dossairID') },
      ...formValue,
    }
    this.financeFleetNewReqService.setExternalQuotation(formValue.quotations)
    this.router.navigate(['/financeProduct/fleet/request/external-summary'])
  }

  navigateTo() {
    this.financeFleetNewReqService.setExternalQuotation(null);
    this.financeFleetNewReqService.QuotationIndex = null;
    this.financeFleetNewReqService.setCurrentStep(3);
    this.router.navigate(['financeProduct/fleet/request/add-request'])
  }

  checkValidation(value, quantityValue,QIndex,purposeIndex) {
    value == 'MSB_FLEET_PERSONAL_VEH' && quantityValue > 3
      ? (this.personalUse = true)
      : (this.personalUse = false);
      this.getDefaultValues(QIndex,purposeIndex);
  }
  setData(data) {
    this.editMode = true
    this.Quotations?.controls.pop()
    data.forEach((element,index)=> {
      this.addNewQuotation(true,index);
      element?.purposes.forEach((purpose,purposeIndex)=>{
        (purposeIndex == 0) ? this.getPurposes(index).controls.pop():''
        this.addNewPurpose(index);
        this.getModelByBrandId(purpose.brandName,index,purposeIndex);
      });
    });
    this.quotationForm.controls['quotations'].patchValue(data);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe()
    })
  }
  
  getDefaultValues(QIndex,purposeIndex){
    let currentPurpose = this.getPurposes(QIndex)?.controls[purposeIndex];
    let body ={
      "brandName":currentPurpose['controls'].brandName.value,
      "modelName":currentPurpose['controls'].modelName.value,
      "purpose":currentPurpose['controls'].purposeOfUse.value,
      "variant":currentPurpose['controls'].vehicleVariant.value,
    }
    if(body.purpose != "" && body.variant!= ""){
    this.financeFleetNewReqService.getDefaultValues(body).subscribe(response=>{
      if(response === null){
        this.router.navigate(['/']).then(() => {})
        }else{
          currentPurpose['controls'].tenure.setValidators([Validators.required,TenureLimit(response.maxFinanceTenure)]);
          currentPurpose['controls'].tenure.updateValueAndValidity();
          currentPurpose['controls'].downPmt.setValidators([Validators.required,DownPayment(response.minDownPmt)]);
          currentPurpose['controls'].downPmt.updateValueAndValidity();
          currentPurpose['controls'].downPmt.setValue(response.minDownPmt);
          currentPurpose['controls'].tenure.setValue(response.maxFinanceTenure);
          let tenureError = (document.getElementById(`tenureError_${QIndex}_${purposeIndex}`));
              tenureError.innerHTML = `${this.fleetTranslateObject.requests.ErrorMin} 12 ${this.fleetTranslateObject.requests.ErrorMax} ${response.maxFinanceTenure}`
          let downPaymentError = (document.getElementById(`paymentError_${QIndex}_${purposeIndex}`));
              downPaymentError.innerHTML = `${this.fleetTranslateObject.requests.ErrorMin} ${response.minDownPmt} ${this.fleetTranslateObject.requests.ErrorMax} 50`
        }
       
    },error=>{
      this.router.navigate(['/']).then(() => {})
    })
    }
  }
}
