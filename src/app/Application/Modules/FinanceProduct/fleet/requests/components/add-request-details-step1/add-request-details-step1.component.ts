import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { PagedData } from 'app/Application/Model/paged-data'
import { DatatableMobileComponent } from 'app/core/responsive/datatable-mobile.component'
import { FinanceFleetNewReqService } from '../../fleet-finance.service'
import { FinanceProductCodeService } from '../../../../finance-product-code.service'

@Component({
  selector: 'add-request-details-step1',
  templateUrl: './add-request-details-step1.component.html',
  styleUrls: ['./add-request-details-step1.component.scss'],
})
export class AddRequestDetailsStep1Component
  extends DatatableMobileComponent
  implements OnInit
{
  @Output() NextStep: EventEmitter<number> = new EventEmitter()
  financeEligibiltyLimit: number = 0
  remainingLimit: number = 0
  externalPage: any
  internalPage: any
  progressPercentage: Number = 0
  externalQuotationDetailedList = []
  externalQuotationList = []
  internalQuotationList = [];
  remainingTxt:string = '';
  exceedTxt:string = '';
  totalPriceForQuotations: number = 0;
  keysToRemoveFromSessionStorage = ['ExQuotations','InQuotations']

  @ViewChild('externalQuotationTable', { static: true }) table: any

  constructor(
    public translate: TranslateService,
    public router: Router,
    public newReqService: FinanceFleetNewReqService,
    public financeProductCode: FinanceProductCodeService,
  ) {
    super()
    this.externalPage = new PagedData<any>()
    this.externalPage.data = []
    this.internalPage = new PagedData<any>()
    this.internalPage.data = []
  }

  ngOnInit(): void {
    this.subscriptions.push(this.translate.get('fleet').subscribe((data:any)=>{
      this.remainingTxt = data.requests.remainingLimit;
      this.exceedTxt = data.requests.exceedAmount;
    }))
    this.setTableValues();
    this.newReqService.setCurrentStep(3)
    this.financeEligibiltyLimit = +sessionStorage.getItem('fleetLimit')
    super.ngOnInit()
    // this.externalQuotationDetailedList = JSON.parse(sessionStorage.getItem('ExQuotations'))
    this.generateQuotationList(
      JSON.parse(sessionStorage.getItem('ExQuotations')),
      'ex',
    )

    this.generateQuotationList(
      JSON.parse(sessionStorage.getItem('InQuotations'))?.quotations,
      'in',
    )
  }

  setTableValues() {
    //ExternalQuotationTable
    this.externalPage.page.totalElements = this.externalQuotationList.length
    this.externalPage.data = this.externalQuotationList
    //InteralQuotationTable
    this.internalPage.page.totalElements = this.internalQuotationList.length
    this.internalPage.data = this.internalQuotationList
  }

  generateQuotationList(QuotationDetailedList, ref) {
    QuotationDetailedList?.forEach((quotation, qIndex) => {
      let carNum = 0
      let quotationValue = 0

      quotation.purposes?.forEach((purpose) => {
        carNum += +purpose.vehiclesNum
        quotationValue += purpose.purposeValue
      })
      this.totalPriceForQuotations += quotationValue
      ref === 'ex'
        ? this.externalQuotationList.push({
            quotationName: `External Quotation ${qIndex + 1}`,
            Type: 'External Quotation',
            quotationValue: quotationValue,
            carQuantity: carNum,
          })
        : this.internalQuotationList.push({
            quotationName: `Internal Quotation ${qIndex + 1}`,
            Type: 'Internal Quotation',
            quotationValue: quotationValue,
            carQuantity: carNum,
            carValue: quotation.purposes[0].vehiclePrice,
          })
    })
   this.calculateRemainingLimit(this.totalPriceForQuotations)
  }

  calculateRemainingLimit(quotationValue:number){
    this.remainingLimit =
      this.financeEligibiltyLimit - quotationValue;
    this.progressPercentage =
      (quotationValue / this.financeEligibiltyLimit) * 100;
      this.remainingLimit < 0 ? this.remainingLimit = -(this.remainingLimit) : this.remainingLimit = this.remainingLimit;
  }

  goDetails(data, ref, actionName?, index?) {
    this.newReqService.quotationEditIndex = index
    if (actionName === 'delete' && ref === 'in') {
      this.internalPage.data = this.internalPage.data.filter((data, idx) => idx !== index );
      let newInternal = JSON.parse(sessionStorage.getItem('InQuotations'))['quotations'].filter((data, idx) => idx !== index )
      sessionStorage.setItem("InQuotations",JSON.stringify({quotations:newInternal}));
      this.totalPriceForQuotations -= data.quotationValue;
      this.calculateRemainingLimit(this.totalPriceForQuotations);
    }

    if (actionName === 'delete' && ref === 'ex') {
      this.externalPage.data = this.externalPage.data.filter((data, idx) => idx !== index );
      let newExternal = JSON.parse(sessionStorage.getItem('ExQuotations')).filter((data, idx) => idx !== index )
      sessionStorage.setItem("ExQuotations",JSON.stringify(newExternal));
      this.totalPriceForQuotations -= data.quotationValue;
      this.calculateRemainingLimit(this.totalPriceForQuotations);
    }

    if (actionName === 'edit' && ref === 'ex') {
      this.newReqService.selectedExternalQuotationObj = JSON.parse(
        sessionStorage.getItem('ExQuotations'),
      )[index]
      this.router.navigate(['financeProduct/fleet/request/external-upload'])
    }
    if (actionName === 'edit' && ref === 'in') {
      this.newReqService.selectedInternalQuotation = JSON.parse(
        sessionStorage.getItem('InQuotations'),
      )?.quotations[index]
      this.router.navigate([
        'financeProduct/fleet/request/internal-product-select',
      ])
    }
  }

  back() {
    this.router.navigate(['financeProduct/fleet/request/external-summary'])
  }
  navigateTo(stepNumber: number): void {
    this.NextStep.emit(stepNumber)
  }
  submitQuotation() {
    let inQuotation = JSON.parse(sessionStorage.getItem('InQuotations'))
      ? JSON.parse(sessionStorage.getItem('InQuotations'))['quotations']
      : []
    let exQuotation = JSON.parse(sessionStorage.getItem('ExQuotations'))
      ? JSON.parse(sessionStorage.getItem('ExQuotations'))
      : []
    let quotationBody = {
      dossierId: sessionStorage.getItem('dossairID'),
      quotations: inQuotation.concat(exQuotation),
    }

    this.newReqService.uploadCustomerQuotation(quotationBody).subscribe(
      (response) => {
        if (response === null) {
          this.router.navigate(['/']).then(() => {});
        } else {
          this.NextStep.emit(4)
        }
      },
      (error) => {
        this.router.navigate(['/']).then(() => {})
      },
    )
  }
}
