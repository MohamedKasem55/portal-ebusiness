import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core'
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import { TranslateService } from '@ngx-translate/core';
import { FinanceFleetNewReqService } from '../../fleet-finance.service';

@Component({
  selector: 'business-details-step1',
  templateUrl: './business-details-step1.component.html',
  styleUrls: ['./business-details-step1.component.scss'],
})
export class BusinessDetailsStep1Component implements OnChanges,OnInit {
  businessDetailsForm: FormGroup
  @Input() customerData:any
  @Input() businessDetailsRes:any
  @Output() NextStep: EventEmitter<any> = new EventEmitter();
  businessTypes:any[] = [];
  branchesTypes:any[] =[];
  businessLocations:any[] = [];
  dossairID = null;
  constructor(
    private fb: FormBuilder,
    private transalte: TranslateService,
    private fleetFinanceService: FinanceFleetNewReqService
  ) {
    this.businessDetailsForm = this.fb.group({
      establishmentDate: ['',Validators.required],
      businessActivities: ['',Validators.required],
      businessOutletsNum: ['',Validators.required],
      businessOutletsType: ['',Validators.required],
      businessLocation: ['',Validators.required],
      businessType:['',Validators.required]

    })
  }
  ngOnChanges(){
    this.setData();
    this.dossairID = sessionStorage.getItem("dossairID");
    if(JSON.parse(sessionStorage.getItem("businessDetails"))){
      this.setFormData(JSON.parse(sessionStorage.getItem("businessDetails")));
    }else{
      this.customerData ? this.setFormData({...this.customerData.posBusinessDataDtls,...{establishmentDate:this.customerData.companyDetails.establishmentDate}}) : ''
    }
    this.dossairID ? this.disabledFields() : ''
  }
  ngOnInit(): void {
      this.setData();
      this.fleetFinanceService.setCurrentStep(1);

  }

  setFormData(data) {
    this.businessDetailsForm.controls['establishmentDate'].setValue(
      data.establishmentDate,
    )
    this.businessDetailsForm.controls['businessActivities'].setValue(
      data.businessActivities,
    )
    this.businessDetailsForm.controls['businessOutletsNum'].setValue(
      data.businessOutletsNum,
    )
    this.businessDetailsForm.controls['businessOutletsType'].setValue(
      data.businessOutletsType,
    )
    this.businessDetailsForm.controls['businessLocation'].setValue(
      data.businessLocation,
    )
    this.businessDetailsForm.controls['businessType'].setValue(
      data.businessType,
    )
  }

  navigateTo(stepNumber): void {
    sessionStorage.setItem("businessDetails",JSON.stringify(this.businessDetailsForm.value));
    //Step2
    this.NextStep.emit({stepNumber:stepNumber,businessDetails:this.businessDetailsForm.value})
  }
  setData(){
    this.businessTypes = this.businessDetailsRes?.businessTypesLsts[0].businessType
    this.branchesTypes = this.businessDetailsRes?.branchTypesLsts[0].branchType
    this.businessLocations = this.businessDetailsRes?.locationsLsts[0].businessLocation
  }

  disabledFields(){    
    let controls = ['establishmentDate','businessActivities','businessOutletsNum','businessOutletsType','businessLocation','businessType']
    controls.forEach(control=>{
      this.businessDetailsForm.controls[`${control}`].disable();
    })
  }
}
