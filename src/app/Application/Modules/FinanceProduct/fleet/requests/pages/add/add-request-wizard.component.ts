import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Breadcrumb } from 'app/Application/Modules/FinanceProduct/shared/models/common'
import { FinanceFleetNewReqService } from '../../fleet-finance.service'
import { Subscription } from 'rxjs';
import { BusinessDetails } from '../../models/request'

@Component({
  selector: 'add-request-wizard',
  templateUrl: './add-request-wizard.component.html',
  styleUrls: ['./add-request-wizard.component.scss'],
})
export class AddRequestWizardComponent implements OnInit, OnDestroy {
  wizardStep: number = 1
  wizardSteps = [];
  businessDetails:BusinessDetails;
  subscriptions: Subscription[] = []
  businessDetailsRes: any;
  customerData;
  fleetBusinessDetails:any;

  breadCrumb: Breadcrumb[] = []
  constructor(
    public activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    public router: Router,
    private financeFleetNewReqService:FinanceFleetNewReqService,
  ) {
  }

  ngOnInit(): void {
    
    //Fleet Object from i18n
    this.subscriptions.push(
      this.translate.get('fleet').subscribe((data: any) => {
        this.wizardSteps = [
          data.requests.businessDetails,
          data.requests.linkedAccount,
          data.requests.vechicleDetails,
          data.requests.documentationUpload,
          data.requests.intialOffer,
          data.requests.summaryStepTitle
        ];
       
        this.breadCrumb = [
          { txt: data.newRequest.Finance, active: false },
          { txt: data.newRequest.NoteligibleTitle, active: true },
        ]
      })
    )
  
    //Router Params

    parseInt(this.financeFleetNewReqService.CurrentStep) > 0 ? this.wizardStep =  +this.financeFleetNewReqService.CurrentStep : this.wizardStep = 1
      
    
    //APIs Calls
    this.getCustomerData();
    this.getBusinessDetails();

  }

  setNextStep(stepNumber: number): void {
    this.wizardStep = stepNumber
  }
  getBusinessData(event){
    this.businessDetails = event.businessDetails;
    this.wizardStep = event.stepNumber;
  }

  getCustomerData() {
    this.subscriptions.push(
      this.financeFleetNewReqService
      .getCustomerData()
      .subscribe((response: any) => {
        if(response === null){
          this.router.navigate(['/']).then(() => {})
        }
        else{
          this.customerData = response
          this.fleetBusinessDetails = response?.posBusinessDataDtls
        }
      },error=>{
        this.router.navigate(['/']).then(() => {})
      })
    )
  }
  getBusinessDetails(){
    this.financeFleetNewReqService.getCustomerBusinessDetails().subscribe((response: any) => {
      if(response === null){
        this.router.navigate(['/']).then(() => {})
      }else{
        this.businessDetailsRes  = response;
      }
    },error=>{
      this.router.navigate(['/']).then(() => {})
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription)=>{
      subscription.unsubscribe;
    })
  }
}
