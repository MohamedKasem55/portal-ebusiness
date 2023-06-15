import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FinanceFleetNewReqService } from 'app/Application/Modules/FinanceProduct/fleet/requests/fleet-finance.service'
import { Router } from '@angular/router';
import {FinanceProductCodeService} from "../../../../finance-product-code.service";
import { BusinessDetails } from '../../models/request';
import { dossierType, FinanceProductCode } from '../../enum/enum';


@Component({
  selector: 'linked-account-step',
  templateUrl: './linked-account-step.component.html',
  styleUrls: ['./linked-account-step.component.scss'],
})
export class LinkedAccountStepComponent implements OnInit {
  linkAccount: any;
  linkAccountList: any;
  dossairID:string = '';

  @Input()customerData:any;
  @Input() businessDetails:BusinessDetails;
  @Output() NextStep: EventEmitter<number> = new EventEmitter()

  constructor(
    private fleetReqService: FinanceFleetNewReqService,
    public router: Router,
  ) {}
  
  ngOnChanges(){
    this.customerData ? this.linkAccountList = this.customerData?.companyDetails?.accountNumberList : ''
    sessionStorage.getItem('accountNum') ? this.linkAccount = sessionStorage.getItem('accountNum') : this.linkAccount = this.linkAccount;
  }
  ngOnInit(): void {
    this.dossairID = sessionStorage.getItem("dossairID");
    this.fleetReqService.setCurrentStep(2);
  }

  setAccountNum(){
    sessionStorage.setItem('accountNum',this.linkAccount);
  }

  navigateTo(stepNumber: number): void {
    if(stepNumber === 3){
      this.dossairID ? this.NextStep.emit(3) : this.getOpenDossier()
    }
    else{
      this.NextStep.emit(stepNumber);
    }
  }
  getOpenDossier(){
    this.fleetReqService.openDossierRequest(
      {...{financeProductCode: FinanceProductCode.Fleet, accountNumber:this.linkAccount,dossierType:dossierType.CRL,establishmentDate:this.businessDetails.establishmentDate}
      ,...{posBusinessDataDetailsl:this.businessDetails}}).subscribe((res) => {
      if (res === null) {
        sessionStorage.removeItem("accountNum");
        sessionStorage.removeItem("businessDetails");
        this.router.navigate(['/']).then(() => {})
      } else {
        if(res.disbursmentDossierId) {
          sessionStorage.setItem("dossairID",res.disbursmentDossierId);
          this.NextStep.emit(3);
        }
      }
  },error=>{
    sessionStorage.removeItem("accountNum");
    sessionStorage.removeItem("businessDetails");
    this.router.navigate(['/']).then(() => {})
  }
  )
}
}
