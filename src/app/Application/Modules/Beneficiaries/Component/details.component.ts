import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { Exception } from 'app/Application/Model/exception'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
import { BeneficiariesFormData } from '../Services/beneficiaries-form-data.service'
import { BeneficiariesGlobalService } from '../Services/beneficiaries-global.service'
import { BeneficiariesListService } from '../Services/beneficiaries-list.service'

@Component({
  selector: 'app-details',
  templateUrl: '../View/details.component.html',
})
export class DetailsComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('requestSubmittedModal', { static: true })
  public requestSubmittedModal: ModalDirective
  @ViewChild('deleteBeneficiaryModal', { static: true })
  public deleteBeneficiaryModal: ModalDirective
  subscription: Subscription
  tableSelected: any[] = []
  beneficiariesDetail: any = {}
  subscriptions: Subscription[] = []
  detailBeneficiary: any
  beneficiaryId: string
  type: string
  ernumber: string
  beneficiariesId: any
  types: any
  erNumber: any
  paymentsPage: any
  account: any
  name: any
  email: any
  bankName: any
  country: any
  category: any
  nationality: any
  mobileno: any
  countrycode: any
  deleteBeneficiariesView: boolean
  wizardStep: any
  isShow = false
  isHide = false

  constructor(
    public serviceBeneficiaryList: BeneficiariesListService,
    public router: Router,
    public comboDataBeneficiaries: BeneficiariesFormData,
    public beneficiariesGlobal: BeneficiariesGlobalService,
    public translate: TranslateService,
  ) {
    super()
    const page = new Page()
    this.paymentsPage = new PagedData<any>()
    page.pageNumber = 0
    page.pageSize = 20
    this.paymentsPage.page = page
    const list = this.serviceBeneficiaryList.getDetails()
    //  if(list.beneficiaryType==='undefined'){
    //   this.router.navigate(['/beneficiaries/beneficiaryList']);
    // }
  }

  ngOnInit(): void {
    this.setPage()
    const list = this.serviceBeneficiaryList.getDetails()
    this.beneficiariesId = list.idBeneficiary
    this.types = list.beneficiaryType
    this.erNumber = list.ernumber
    this.account = list.account
    this.name = list.name
    this.email = list.email
    this.bankName = list.bankName
    this.country = list.country
    this.countrycode = list.countryCode
    this.category = list.beneficiaryCategory
    this.nationality = list.nationality
    this.mobileno = list.mobileNo

    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.setPage()
      }),
    )
  }

  modifyBeneficiary(): void {
    // Service Call
    const list = this.serviceBeneficiaryList.getDetails()
    this.subscription = this.beneficiariesGlobal
      .modifyBeneficiary(list)
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          //console.log("Envio");
          //console.log(result["errorCode"]);
          if (result.errorCode === '0') {
            // Muestro modal de OK
            this.requestSubmittedModal.show()
          }
        }
        this.subscription.unsubscribe()
      })
  }

  deleteBeneficiariesBtn(): void {
    const list = this.serviceBeneficiaryList.getDetails()
    this.beneficiariesGlobal
      .deleteBeneficiary(this.beneficiariesId, this.erNumber)
      .subscribe((responseMsg) => {
        //console.log(responseMsg);
        if (responseMsg['errorCode'] == '0') {
          this.deleteBeneficiaryModal.show()
        } else {
          this.returnBeneficiaryList()
        }
      })
  }

  returnBeneficiaryList(): void {
    this.requestSubmittedModal.hide()
    this.deleteBeneficiaryModal.hide()
    this.tableSelected = []
    this.deleteBeneficiariesView = false
    this.wizardStep = 1
  }

  editBeneficiaries() {
    this.isShow = !this.isShow
  }

  deleteBeneficiaries() {
    this.isHide = !this.isHide
  }

  onError(result) {}

  setPage() {
    const list = this.serviceBeneficiaryList.getDetails()

    this.beneficiaryId = list.idBeneficiary
    this.type = list.beneficiaryType
    this.ernumber = list.ernumber
    this.subscriptions.push(
      this.serviceBeneficiaryList
        .listDetails(this.type, this.ernumber, this.beneficiaryId)
        .subscribe((result: any) => {
          if (
            result.hasOwnProperty('error') &&
            result.error instanceof Exception
          ) {
            return
          } else {
            this.beneficiariesDetail = result
            this.paymentsPage.page.size = result.lastTransactionDetails.length
          }
        }),
    )
  }

  onSelect({ selected }) {
    //
    //console.log('Select Event', selected, this.tableSelectedRows);
    this.tableSelected.splice(0, this.tableSelected.length)
    this.tableSelected.push(...selected)
  }

  backButton() {
    this.router.navigate(['beneficiaries/beneficiaryList'])
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
