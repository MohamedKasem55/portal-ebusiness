import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { DatatableMobileComponent } from 'app/core/responsive/datatable-mobile.component'
import { WpsRequestStatus } from '../WpsRequestStatus/wps-request-status.service'
import { WpsPayrollService } from '../WpsPayrollNew/wps-payroll-new.service'


@Component({
    selector: 'wps-request-details',
    templateUrl: './wps-request-details.component.html',
    styleUrls: ['./wps-request-details.component.scss'],
})

export class WpsRequestDetailsComponent extends DatatableMobileComponent {



    public requestDetails: any = {}
    public formModel: FormGroup
    public currency: string = "SAR"
    public eligibleToUpdate: boolean;

    constructor(
        public formBuilder: FormBuilder,
        public router: Router,
        private activateRoute: ActivatedRoute,
        public translate: TranslateService,
        private wpsRequestStatus: WpsRequestStatus,
        private wpsPayrollService: WpsPayrollService,
    ) {
        super()

        const routeData = this.router.getCurrentNavigation().extras.state?.data
        if(!routeData){
            this.router.navigateByUrl('./')
        }else{
            this.getDetails(routeData.agreementId);
            this.setUpdateEligibility()
        }
    }

    ngOnInit() {
        super.ngOnInit();
        this.formModel = this.wpsRequestStatus.createForm({});
    }

    ngOnDestroy() {

    }

    getDetails(agreementId : number): void {
        this.wpsRequestStatus.getRequestStatusDetails(agreementId).subscribe((res) => {
            this.requestDetails = res.companyPayrollAgreementDTOS[0];
            this.formModel = this.wpsRequestStatus.createForm(res.companyPayrollAgreementDTOS[0]);
        });
    }

    setUpdateEligibility(): void {
        this.wpsPayrollService.getPayrollAgreementEligibility().subscribe((res) => {
            this.eligibleToUpdate = res.eligibleToUpdate
        })
    }

    update() {
        if(this.formModel.controls['requestStatus'].value === "ACTIVE" && this.eligibleToUpdate) {
            this.router.navigateByUrl('/newProduct/wps/update',  {state: {data: this.requestDetails}});
        }
    }
}

