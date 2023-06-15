import {Component, EventEmitter, OnInit, Output} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Breadcrumb } from 'app/Application/Modules/FinanceProduct/shared/models/common'
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import { FinanceFleetNewReqService } from '../../../fleet-finance.service';

@Component({
  selector: 'breakdown',
  templateUrl: './breakdown.component.html',
  styleUrls: ['./breakdown.component.scss'],
})
export class BreakdownComponent implements OnInit {
  @Output() NextStep: EventEmitter<Number> = new EventEmitter()

  breadCrumb: Breadcrumb[] = []
  quotationDetails: any;
  public custOfferVehicleGroupLstItemTypes = [] ;

  constructor(public fb: FormBuilder,
              public router: Router,
              public translate: TranslateService, 
              private financeFleetNewReqService: FinanceFleetNewReqService
              ) {
  }

  ngOnInit(): void {
    this.translate.get('fleet').subscribe((data: any) => {
      this.breadCrumb = [
        { txt: data.newRequest.Finance, active: false },
        { txt: data.newRequest.NoteligibleTitle, active: true },
      ]
    })
    this.quotationDetails =  JSON.parse(sessionStorage.getItem("quotationDetails"))
    this.custOfferVehicleGroupLstItemTypes = this.quotationDetails.customerOfferDetails?.custOfferVehicleGroupLstItemTypes
  }
  navigateTo(stepNumber: number): void {
    this.NextStep.emit(stepNumber)
  }
  back(){
    this.financeFleetNewReqService.setCurrentStep(5);
    this.router.navigate(['financeProduct/fleet/request/add-request'])
  }
}
