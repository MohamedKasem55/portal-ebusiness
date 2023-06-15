import { isPlatformBrowser, Location } from '@angular/common'
import {
  AfterViewChecked,
  Component,
  Inject,
  Injector,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core'
// Form
import { FormBuilder, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { PagedData } from '../../../../Model/paged-data'
import { ModelServiceBeneficiariesList } from '../../Model/beneficiaries-list-service.model'
// Import required to work with a shared data model.
import { FormData } from '../../Model/shared-form-Data.model'
// General service to optain static data
import { BeneficiariesFormData } from '../../Services/beneficiaries-form-data.service'
// General service to add/remove/modify beneficiaries
import { BeneficiariesGlobalService } from '../../Services/beneficiaries-global.service'
// Service to GET list of beneficiaries
import { BeneficiariesListService } from '../../Services/beneficiaries-list.service'
import { FormDataService } from '../../Services/shared-form-data.service'
import { BeneficiariesInternationalBagService } from '../../Services/beneficiaries-international-bag.service'
import { TranslateDatePipe } from '../../../../Components/common/Pipes/hijra-date-pipe'
import { ModelPipe } from '../../../../Components/common/Pipes/model-pipe'
import { DateFormatPipe } from '../../../../Components/common/Pipes/date-format-pipe'

@Component({
  templateUrl:
    '../../View/beneficiaries-list/beneficiaries-list.component.html',
  styles: [
    `
      @media screen and (max-width: 800px) {
        .desktop-hidden {
          display: initial;
        }

        .mobile-hidden {
          display: none;
          width: 0%;
        }
      }

      @media screen and (min-width: 800px) {
        .desktop-hidden {
          display: none;
        }

        .mobile-hidden {
          display: initial;
        }
      }
    `,
  ],
})
export class BeneficiariesListComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  @Input() formData: FormData[]
  @ViewChild('requestSubmittedModal', { static: true })
  public requestSubmittedModal: ModalDirective
  @ViewChild('deleteBeneficiaryModal', { static: true })
  public deleteBeneficiaryModal: ModalDirective
  @ViewChild('beneficiaryListTable', { static: true }) table: any

  subscription: Subscription
  beneficiaryListPage: PagedData<any>

  jobGroup: FormGroup = new FormGroup({})

  order: string
  orderType: string

  public model: any

  public innerWidth: any
  public mobile = false

  isSearchCollapsed = true

  banks: string[] = []
  currencies: string[] = []
  backEndCountryCode: string[] = []
  nationalities: string[] = []
  beneficiaryBankCodes: string[] = []
  branchNames: string[] = []
  tableSelected: any[] = []
  selected: any[] = []
  wizardStep: number
  editAlrajhiBeneficiariesView: boolean
  editLocalBeneficiariesView: boolean
  editInternationalBeneficiariesView: boolean
  deleteBeneficiariesView: boolean
  deletedetailsBeneficiariesview: boolean
  categoryInternationalBeneficiary: string
  beneficiaryCategory: string
  beneficiariesData: any = []
  emailBeneficiary: string

  beneficiaryType: string
  beneficiaryName: string
  bankName: string
  bankCode: string
  currency: string
  filterCriteria: string

  beneficiaryTypeSearch: string
  beneficiaryNameSearch: string
  bankNameSearch: string
  bankCodeSearch: string
  currencySearch: string
  filterCriteriaSearch: string
  beneficiaryDetail: any
  beneficiariesListPage: string[] = []
  deleteDetails: any
  generateChallengeAndOTP: ResponseGenerateChallenge
  selectAllOnPage: any = []

  bsConfig: any

  constructor(
    public formDataService: FormDataService,
    public serviceBeneficiaryList: BeneficiariesListService,
    public comboDataBeneficiaries: BeneficiariesFormData,
    public beneficiariesGlobal: BeneficiariesGlobalService,
    public formBuilder: FormBuilder,
    public _location: Location,
    public router: Router,
    public translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId,
    public authenticationService: AuthenticationService,
    public beneficiariesInternationalBagService: BeneficiariesInternationalBagService,
    public activatedRoute: ActivatedRoute,
    @Inject(LOCALE_ID) private locale: string,
    private injector: Injector,
  ) {
    super()
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
    this.beneficiaryListPage = new PagedData<ModelServiceBeneficiariesList>()
    this.beneficiaryListPage.page.pageSize = 10
    this.order = 'requestDate'
    this.orderType = 'desc'

    // Definimos el objeto model, vació inicialmente para la validación de los campos (necesario)
    this.model = {
      postalCode: '',
      poBox: '',
    }
  }

  /*getDateString(date: Date): string {
          //console.log("Fecha: ", date);
          return (
            date.getDate()! + "/" + (date.getMonth() + 1)! + "/" + date.getFullYear()!
          );
        }*/

  modifyBeneficiary(): void {
    // Modify
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.tableSelected.length; i++) {
      const beneficiary = this.tableSelected[i].beneficiary

      // Category
      if (beneficiary.beneficiaryCategory == 'Individual') {
        beneficiary.beneficiaryCategory = 'I'
      } else {
        beneficiary.beneficiaryCategory = 'C'
      }

      // Asign form data to json
      //console.log(this.tableSelected[i])
      beneficiary['newEmail'] = this.tableSelected[i].email
      beneficiary['type'] = this.tableSelected[i]['beneficiaryType']

      // Entry JSON
      const params = {
        address1: this.tableSelected[i]['address1'],
        addressNumber: this.tableSelected[i]['addressNumber'],
        beneficiary,
        category: beneficiary['beneficiaryCategory'],
        dateBirth: this.tableSelected[i]['dateBirth']
          ? new DateFormatPipe(this.injector, this.locale).transform(
              this.tableSelected[i]['dateBirth'],
              'yyyy-MM-dd',
            )
          : null,
        mobileNo: this.tableSelected[i]['mobileNo'],
        nationality: this.tableSelected[i]['nationality'],
        newEmail: this.tableSelected[i]['email'],
        placeBirth: this.tableSelected[i]['placeBirth'],
        poBox: this.tableSelected[i]['poBox'],
        zipCode: this.tableSelected[i]['zipCode'],
        type: this.tableSelected[i]['type'],
        branchid: this.tableSelected[i]['branchid'],
      }

      // Service Call
      this.subscription = this.beneficiariesGlobal
        .modifyBeneficiary(params)
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
  }

  deleteBeneficiariesBtn(): void {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.tableSelected.length; i++) {
      //console.log("Id beneficiario");
      //console.log(this.tableSelected[i]["idBeneficiary"]);

      // Call service to add Al Rajhi Beneficiary
      this.beneficiariesGlobal
        .deleteBeneficiary(
          this.tableSelected[i]['idBeneficiary'],
          this.tableSelected[i]['ernumber'],
        )
        .subscribe((responseMsg) => {
          //console.log(responseMsg);
          if (responseMsg['errorCode'] == '0') {
            this.deleteBeneficiaryModal.show()
          } else {
            this.returnBeneficiaryList()
          }
        })
    }
  }

  returnBeneficiaryList(keepSelected = false): void {
    //console.log(this.tableSelected);
    // console.log(keepSelected);
    if (keepSelected == false) {
      this.tableSelected = []
    }
    this.tableSelected = []

    //console.log(this.tableSelected);

    this.requestSubmittedModal.hide()
    this.deleteBeneficiaryModal.hide()
    this.editAlrajhiBeneficiariesView = false
    this.editLocalBeneficiariesView = false
    this.editInternationalBeneficiariesView = false
    this.deleteBeneficiariesView = false
    this.deleteBeneficiariesView = false
    // this.deletedetailsBeneficiaries  = false;
    this.wizardStep = 1
    this.searchBeneficiariesList()
  }

  deleteBeneficiaries(): void {
    if (this.tableSelected && this.tableSelected.length > 0) {
      this.deleteBeneficiariesView = true
      this.wizardStep = this.wizardStep + 1
    }
  }

  deletedetailsBeneficiaries() {
    this.selected = this.tableSelected
    if (this.selected && this.selected.length > 0) {
      this.deletedetailsBeneficiariesview = true
      this.wizardStep = this.wizardStep + 1
    }
  }

  editBeneficiary(row): void {
    this.tableSelected.push(row)
    const list = this.serviceBeneficiaryList.getDetails()

    // -------------------------------------------------------------------------------------
    // Show Hide elements on the view
    if (this.tableSelected && this.tableSelected.length > 0) {
      if (row.beneficiaryType === '01' || row.beneficiaryType === '1') {
        this.editAlrajhiBeneficiariesView = true
      }

      if (row.beneficiaryType === '02' || row.beneficiaryType === '2') {
        this.editLocalBeneficiariesView = true
      }

      if (row.beneficiaryType === '03' || row.beneficiaryType === '3') {
        this.editInternationalBeneficiariesView = true
      }

      this.wizardStep = this.wizardStep + 3
    }
  }

  editBeneficiaries(): void {
    // -------------------------------------------------------------------------------------
    // Show Hide elements on the view
    if (this.tableSelected && this.tableSelected.length > 0) {
      this.tableSelected.forEach((benef) => {
        if (benef.beneficiaryType === '01' || benef.beneficiaryType === '1') {
          this.editAlrajhiBeneficiariesView = true
        }
        if (benef.beneficiaryType === '02' || benef.beneficiaryType === '2') {
          this.editLocalBeneficiariesView = true
        }
        if (benef.beneficiaryType === '03' || benef.beneficiaryType === '3') {
          this.editInternationalBeneficiariesView = true
        }
      })
      this.wizardStep = this.wizardStep + 1
    }
  }

  editdetailsBeneficiaries(): void {
    if (this.beneficiaryName) {
      if (
        (this.beneficiaryName && this.beneficiaryDetail.ernumber) ||
        this.beneficiaryType === '01' ||
        this.beneficiaryType === '1'
      ) {
        this.editAlrajhiBeneficiariesView = true
      }

      if (
        (this.beneficiaryName && this.beneficiaryDetail.ernumber) ||
        this.beneficiaryType === '02' ||
        this.beneficiaryType === '2'
      ) {
        this.editLocalBeneficiariesView = true
      }

      if (
        (this.beneficiaryName && this.beneficiaryDetail.ernumber) ||
        this.beneficiaryType === '03' ||
        this.beneficiaryType === '3'
      ) {
        this.editInternationalBeneficiariesView = true
      }

      this.wizardStep = this.wizardStep + 1
    }
  }

  resetValues(): void {
    //this.beneficiaryType = "01";
    this.bankName = null
    this.bankCode = null
    this.beneficiaryName = null
    this.currency = null
    this.filterCriteria = 'beneficiary'
    this.beneficiaryType = '00'
    this.cleanSelected()
    this.searchBeneficiariesList()
  }

  cleanSelected() {
    this.tableSelected = []
  }

  searchBeneficiariesList(cleanSelected = false): void {
    if (cleanSelected == true) {
      this.cleanSelected()
    }
    this.beneficiaryTypeSearch = this.beneficiaryType
    this.beneficiaryNameSearch = this.beneficiaryName
    this.bankNameSearch = this.bankName
    this.bankCodeSearch = this.bankCode === null ? '' : this.bankCode
    this.currencySearch = this.currency
    this.filterCriteriaSearch = this.filterCriteria
    this.setPage(null)
  }

  onChangeBeneficiaryType(target) {
    if (target && target.value) {
      this.bankName = null
      this.bankCode = null
      this.beneficiaryName = null
      this.beneficiaryType = target.value
      this.currency = null
      this.filterCriteria = 'beneficiary'
      this.searchBeneficiariesList()
    }
  }

  onCriteriaChange(target) {
    let value = ''
    if (target && target.value) {
      value = target.value
    }
    this.filterCriteria = value
    if (value === 'beneficiary') {
      this.bankName = null
      this.bankCode = null
      this.currency = null
    }
    if (value === 'bank') {
      this.bankCode = null
      this.beneficiaryName = null
      this.currency = null
    }
    if (value === 'bankCode') {
      this.bankName = null
      this.beneficiaryName = null
      this.currency = null
    }
    if (value === 'currency') {
      this.bankCode = null
      this.beneficiaryName = null
      this.bankName = null
    }
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    this.beneficiaryListPage.page.pageNumber = dataTableEvent.offset
    // Service Call
    this.serviceBeneficiaryList
      .getResults(
        this.order,
        this.orderType,
        this.beneficiaryListPage.page.pageNumber + 1,
        this.beneficiaryListPage.page.pageSize,
        this.beneficiaryTypeSearch,
        this.beneficiaryNameSearch,
        this.bankCodeSearch,
        this.bankNameSearch,
        this.currencySearch,
        this.filterCriteriaSearch,
      )
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.beneficiaryListPage = result.pagedData
          console.log(this.beneficiaryListPage)
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.beneficiaryListPage.data.length; i++) {
            switch (this.beneficiaryListPage.data[i].beneficiaryType) {
              case '01':
                this.beneficiaryListPage.data[i].account =
                  this.beneficiaryListPage.data[
                    i
                  ].beneficiary.beneficiaryAccount.fullAccountNumber
                break
              case '02':
                this.beneficiaryListPage.data[i].account = this
                  .beneficiaryListPage.data[i].beneficiary.beneficiaryAccount
                  .fullAccountNumber
                  ? this.beneficiaryListPage.data[i].beneficiary
                      .beneficiaryAccount.fullAccountNumber
                  : this.beneficiaryListPage.data[i].beneficiary
                      .beneficiaryAccount.ibanNumber
                break
              case '03':
                this.beneficiaryListPage.data[i].account = this
                  .beneficiaryListPage.data[i].beneficiary
                  .beneficiaryAccountCode
                  ? this.beneficiaryListPage.data[i].beneficiary
                      .beneficiaryAccountCode
                  : this.beneficiaryListPage.data[i].beneficiary
                      .beneficiaryAccount.ibanNumber
                break
              default:
                break
            }
          }

          //console.log(this.beneficiaryListPage);
          this.beneficiariesData = result.jsonListBeneficiaries
          //console.log("Paged Data: ");
          //console.log(this.beneficiaryListPage);
        }
      })
  }

  setSort(dataTableEvent) {
    /*
        if (dataTableEvent.sorts[0]) {
            this.order = dataTableEvent.sorts[0].prop;
            this.orderType = dataTableEvent.sorts[0].dir;
        }

        this.accountBalancePage.page.pageNumber = 1;
        this.loading = true;

        // Service Call with new short
        this.service.getResults(this.order, this.orderType, dataTableEvent.offset + 1, this.accountBalancePage.page.pageSize)
            .subscribe(result => {
                if (result === null) {
                    this.onError(result);
                } else {
                    this.loading = false;
                    this.accountBalancePage = result;
                }
            });
        */
  }

  onError(result) {}

  getNameCountry(values) {
    return values !== '' && values !== null && values !== undefined
      ? this.backEndCountryCode[values]
      : ''
  }

  getNameCurrency(values) {
    return values !== '' && values !== null && values !== undefined
      ? this.currencies[values]
      : ''
  }

  getNameBank(values) {
    if (values === '' || values === null || values === undefined) {
      return ''
    }

    const res = values.substring(0, 4)

    if (this.beneficiaryBankCodes[res] != undefined) {
      return this.beneficiaryBankCodes[res].trim()
    } else {
      return values
    }
  }

  ngOnInit() {
    this.wizardStep = 1
    this.innerWidth = window.innerWidth

    // -----------------------------------------------------------------------------------
    // CARGA DE LOS DATOS ESTATICOS DE LOS COMBOS DEL FORMUALRIO  */
    // -----------------------------------------------------------------------------------
    //this.formData[0] = this.formDataService.getData();

    this.beneficiaryType = '00'
    this.filterCriteria = 'beneficiary'

    // Creo un array de strings con los datos de los combos que voy a necesitar en el modulo Accounts
    const combosSolicitados = [
      'bankType',
      'currency',
      'backEndCountryCode',
      'nationalityCode',
      'directDebitBankCode',
    ]

    // Llamada al servio post con los datos del formulario en un json
    // Se espera a la respuesta y se muestra la modal de OK el envío.

    this.comboDataBeneficiaries
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: any = comboData

        this.banks = data[combosSolicitados.indexOf('bankType')]['values']
        this.currencies = data[combosSolicitados.indexOf('currency')]['values']
        this.backEndCountryCode =
          data[combosSolicitados.indexOf('backEndCountryCode')]['values']
        this.nationalities =
          data[combosSolicitados.indexOf('nationalityCode')]['values']
        this.beneficiaryBankCodes =
          data[combosSolicitados.indexOf('directDebitBankCode')]['values']
        //this.branchNames= data[combosSolicitados.indexOf("branchName")]["values"]
        //console.log("Codigos paises");
        //console.log(this.backEndCountryCode);

        this.searchBeneficiariesList()
      })

    // -----------------------------------------------------------------------------------
    // CARGA INICIAL DEL DATATABLE CON LISTADO DE BENEFICIARIOS FILTRADO POR AL RAJHI */
    // -----------------------------------------------------------------------------------

    window.addEventListener('resize', (res: Event) => {
      this.innerWidth = window.innerWidth
      if (this.innerWidth < 800) {
        this.mobile = true
        if (this.table && this.table.rowDetail) {
          this.table.rowDetail.expandAllRows()
        }
      } else {
        this.mobile = false
        if (this.table && this.table.rowDetail) {
          this.table.rowDetail.collapseAllRows()
        }
      }
    })

    if (this.activatedRoute.params['value'].action) {
      const benef =
        this.beneficiariesInternationalBagService
          .currentInternationalBeneficiary
      this.tableSelected.push(benef)
      this.editBeneficiaries()
    }
  }

  ngAfterViewChecked() {
    if (
      isPlatformBrowser(this.platformId) &&
      this.beneficiaryListPage.data.length > 0
    ) {
      if (this.innerWidth < 800) {
        this.mobile = true
        if (this.table && this.table.rowDetail) {
          this.table.rowDetail.expandAllRows()
        }
      }
    }
  }

  ngOnDestroy() {
    this.formDataService.deleteData()
    if (this.activatedRoute.params['value'].action) {
      this.beneficiariesInternationalBagService.currentInternationalBeneficiary =
        null
    }
  }

  removeBeneficiary(value) {
    this.tableSelected.splice(value, 1)
    if (this.tableSelected.length == 0) {
      this.returnBeneficiaryList()
    }
  }

  // onSelect({ selected }) {
  //   //
  //   ////console.log('Select Event', selected, this.tableSelectedRows);
  //   this.tableSelected.splice(0, this.tableSelected.length);
  //   this.tableSelected.push(...selected);

  onSelect({ selected }) {
    // Make sure we are no longer selecting all

    this.selectAllOnPage[this.beneficiaryListPage.page.pageNumber] = false

    this.tableSelected.splice(0, this.tableSelected.length)
    this.tableSelected.push(...selected)
  }

  selectAll(event) {
    if (!this.selectAllOnPage[this.beneficiaryListPage.page.pageNumber]) {
      // Unselect all so we dont get duplicates.
      if (this.tableSelected.length > 0) {
        this.beneficiaryListPage.data.map((beneficiary) => {
          this.tableSelected = this.tableSelected.filter(
            (selected) => this.getId(selected) !== this.getId(beneficiary),
          )
        })
      }
      // Select all again
      this.tableSelected.push(...this.beneficiaryListPage.data)
      this.selectAllOnPage[this.beneficiaryListPage.page.pageNumber] = true
      // console.log('-----------Select All----');
      // console.log(this.tableSelected);
    } else {
      // Unselect all
      this.beneficiaryListPage.data.map((beneficiary) => {
        this.tableSelected = this.tableSelected.filter(
          (selected) => this.getId(selected) !== this.getId(beneficiary),
        )
      })
      this.selectAllOnPage[this.beneficiaryListPage.page.pageNumber] = false
      // console.log('-----------UnSelect All');
      // console.log(this.tableSelected)
    }
  }

  sanitize(value): any {
    return value.replace(/\0/g, '').replace('???.', '')
  }

  getId(row) {
    return (
      row['idBeneficiary'] + row['ernumber'] + row['beneficiaryAccountCode']
    )
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  onDetailToggle(event) {
    //console.log('Detail Toggled', event);
  }

  goDetails(row) {
    // this.beneficiariesListPage=row
    this.router.navigate(['/beneficiaries/details'])
    this.serviceBeneficiaryList.setDetails(row)
    // this.tableSelected.push(this.beneficiariesListPage)
    return row
    //console.log(this.beneficiariesListPage)
  }
  isEmptyOrSpaces(str){
    return !str || str.trim() === '';
  }
}
