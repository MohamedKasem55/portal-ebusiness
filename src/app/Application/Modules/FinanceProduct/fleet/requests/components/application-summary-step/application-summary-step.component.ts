import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { TranslateService } from '@ngx-translate/core';
import { FinanceFleetNewReqService } from '../../fleet-finance.service';
import { Router } from '@angular/router';
import { FinanceProductCode, ActionCall } from '../../enum/enum';

@Component({
  selector: 'application-summary-step',
  templateUrl: './application-summary-step.component.html',
  styleUrls: ['./application-summary-step.component.scss'],
})
export class ApplicationSummaryStepComponent implements OnInit {
  @Output() NextStep: EventEmitter<number> = new EventEmitter()
  title1:string = '';
  title2:string = '';
  title3:string = '';
  totalFinanceAmount:number = 0

  businessDetails;
  amtDetails;
  externalQuotationList = [];
  internalQuotationList = [];
  purposeOfUseList = [];
  documentationUploaded =[];

  constructor(private translate: TranslateService,
              private financeFleetService: FinanceFleetNewReqService,
              private router: Router
    ) {
    }

  ngOnInit(): void {
    this.financeFleetService.setCurrentStep(6);
    this.translate.get('fleet').subscribe((data: any) => {
      this.title1 =  data.requests.externalQuotation;
      this.title2=data.requests.purposeUse;
      this.title3 = data.requests.internalQuotation
    })
    this.purposeOfUseList = this.financeFleetService.purposeOfUse;
    this.businessDetails = {...JSON.parse(sessionStorage.getItem('businessDetails')),...{accountNum:sessionStorage.getItem('accountNum')}} ;
    this.externalQuotationList = JSON.parse(sessionStorage.getItem('ExQuotations'));
    this.internalQuotationList = this.getNewInternalQuotation(JSON.parse(sessionStorage.getItem('InQuotations')) ? JSON.parse(sessionStorage.getItem('InQuotations')).quotations: [])
    this.documentationUploaded = JSON.parse(sessionStorage.getItem("documentUploadedVal"));
    this.amtDetails = JSON.parse(sessionStorage.getItem('amtDetails'));
    this.getTotalFinanceAmount();
  }
  navigateTo(StepNumber: number): void {
    this.NextStep.emit(StepNumber)
  }
  
  getTotalFinanceAmount(){
    this.internalQuotationList.forEach(quotation=>{
      this.totalFinanceAmount += quotation.purposeValue;
    });
    this.externalQuotationList.forEach(quotation=>{
      quotation.purposes.forEach(purpose=>{
        this.totalFinanceAmount +=purpose.purposeValue
      })
    })    
  }
  getPurposeUseTxt(id){
    let purposeUse = this.purposeOfUseList.find(element=>{
      return element.id === id;
   });
    return purposeUse.txt
  }
  getNewInternalQuotation(InternalQuotationList){
    let newPurposes = []
    InternalQuotationList.forEach(element=> {
      newPurposes.push(element.purposes[0]);
    });
    return newPurposes;
  }

  submitApplication() {
    let acceptInitialOffer ={
      dossairID: sessionStorage.getItem('dossairID'),
      body:{
        "accepted": true,
        "initialOffer":true,
        "productCode": FinanceProductCode.Fleet,
        "action":ActionCall.InitialOffer
      }
    }
    this.financeFleetService.setFinalAgreementAcceptance(acceptInitialOffer).subscribe(response=>{
      if (response === null) {
        this.router.navigate(['/']).then(() => {});
      } else {
        sessionStorage.removeItem('currentStep');
        this.router.navigate(['/financeProduct/fleet/request/finish'])
      }
    },error=>{
      this.router.navigate(['/']).then(() => {})
    })
  }
}
