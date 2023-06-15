import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder, NgForm } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { StaticService } from '../../Common/Services/static.service'
import { GetHostStaticData } from '../Services/beneficiaries-host-static-data.service'
import { RequestReactivateService } from './request-reactivate.service'

@Component({
  selector: 'app-request-reactivate-step1',
  templateUrl: './request-reactivate-step1.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateStep1Component implements OnInit, OnDestroy {
  @Input() batch: any
  @Output() onInit = new EventEmitter<Component>()
  @ViewChild('form') public form: NgForm

  employeePageSize = 10
  paymentDate: any

  bsConfig: any
  subscriptions: Subscription[] = []
  combosSolicitados = [
    'countryNameAndCode',
    'nationalityCode',
    'elsagCountryCode',
    'documentIdType',
  ]
  countryData: any
  formData = {
    countries: [],
    nationalities: [],
    banks: [],
    elsagCountryCode: [],
    currencyList: [],
    branchs: [],
    idTypes: [],
    banksCode: [],
  }
  reBeneficiaryAccount = null
  branch: any = null

  constructor(
    private fb: FormBuilder,
    public service: RequestReactivateService,
    public translate: TranslateService,
    public staticService: StaticService,
    public hostStaticData: GetHostStaticData,
  ) {}

  initBranchList() {
    this.subscriptions.push(
      this.hostStaticData
        .getBranchNames(this.batch.newBankName, this.batch.newCountryCode)
        .subscribe((result) => {
          const data: Object = result
          // Se reasigna los valores que contienen el combo de las oficinas para el banco en ese pais
          this.formData.branchs = data['branchNameList']
          this.branch = this.getBranch(this.batch.newBranchName)
          this.onChangeBranch()
        }),
    )
  }

  initBankNameList() {
    this.subscriptions.push(
      this.hostStaticData
        .getBankNames(this.batch.newCountryCode)
        .subscribe((result) => {
          const data: Object = result
          // Se reasigna los valores que contienen el combo de monedas del pais y los banco del pais
          this.formData.currencyList = data['currencyList']
          this.formData.banks = data['distinctBankNameList']
        }),
    )
  }

  ngOnInit() {
    this.bsConfig = Object.assign(
      {},
      { containerClass: 'theme-dark-blue' },
      { dateInputFormat: 'DD/MM/YYYY' },
    )
    this.onInit.emit(this as Component)
    if (this.batch.beneficiaryType == 'international') {
      this.initInternational()
      this.reBeneficiaryAccount = this.batch['newBeneficiaryAccount']
    }
    if (this.batch.beneficiaryType == 'local') {
      this.initLocal()
    }
  }

  initInternational() {
    this.subscriptions.push(
      this.staticService
        .getAllCombos(this.combosSolicitados)
        .subscribe((comboData) => {
          const data: Object = comboData

          if (this.formData.countries.length == 0) {
            this.countryData =
              data[this.combosSolicitados.indexOf('countryNameAndCode')][
                'values'
              ]
            const countrysGroup = []
            const keys = Object.keys(this.countryData)
            for (const i in keys) {
              if (keys[i]) {
                countrysGroup.push({
                  key: keys[i],
                  value: this.countryData[keys[i]],
                })
              }
            }
            countrysGroup.sort((a, b) => {
              return a.value > b.value ? 1 : b.value > a.value ? -1 : 0
            })
            //console.log(countrysGroup);
            this.formData.countries = countrysGroup //data[combosSolicitados.indexOf("countryNameAndCode")]["values"];
            // const birthCountry = this.formData.countries.forEach((elem)=>{
            //     return (  ((elem["value"])+"").substring((elem["value"]+"").length, -3) === this.batch.newPlaceBirth);
            // });
            // this.batch.newPlaceBirth = birthCountry !== undefined ? birthCountry["key"] : "";
          }
          this.formData.nationalities =
            data[this.combosSolicitados.indexOf('nationalityCode')]['values']
          this.formData.elsagCountryCode =
            data[this.combosSolicitados.indexOf('elsagCountryCode')]['values']
          this.formData.idTypes =
            data[this.combosSolicitados.indexOf('documentIdType')]['values']

          this.batch.newCountryNameEnglish = this.getNameCountry(
            this.batch.newCountryCode,
          )
          this.batch.addressCountry = this.batch.newCountryCode

          this.initBankNameList()
          this.initBranchList()
        }),
    )
  }

  initLocal() {
    this.subscriptions.push(
      this.staticService.getAllCombos(['bankCode']).subscribe((comboData) => {
        const data: Object = comboData
        this.formData.banksCode =
          data[['bankCode'].indexOf('bankCode')]['values']
        //console.log(this.formData.banksCode);
        this.focusOutIbanAccount(this.batch.newBeneficiaryAccount)
      }),
    )
  }

  getNameCountry(code) {
    //console.log(this.formData.countries);
    for (let i = 0; i < this.formData.countries.length; ++i) {
      if (this.formData.countries[i].key == code) {
        return this.formData.countries[i].value
      }
    }
  }

  onChangeCountry() {
    // Servicio que obtiene los  nombre de bancos en función al pais
    this.batch.newCountryNameEnglish = this.getNameCountry(
      this.batch.newCountryCode,
    )
    this.batch.addressCountry = this.batch.newCountryCode

    this.subscriptions.push(
      this.hostStaticData
        .getBankNames(this.batch.newCountryCode)
        .subscribe((result) => {
          const data: Object = result
          // Se reasigna los valores que contienen el combo de monedas del pais y los banco del pais
          this.formData.currencyList = data['currencyList']
          this.formData.banks = data['distinctBankNameList']
          this.batch.newBankName = ''

          this.branch = ''
          this.batch.newBranchName = ''
          this.batch.newBranchSwiftCode = ''
          this.batch.newBranchAddress = ''
          this.batch.newBankAddress = ''

          this.onChangeBankName()
        }),
    )
  }

  getBank(name) {
    for (let i = 0; i < this.formData.banks.length; ++i) {
      if (this.formData.banks[i].bankName == name) {
        return this.formData.banks[i]
      }
    }
  }

  onChangeBankName() {
    if (typeof this.batch != 'undefined') {
      const bank: any = this.getBank(this.batch.newBankName)
      //Llamada al serivio que obtiene las oficinas en funcion del banco
      if (typeof bank != 'undefined') {
        this.subscriptions.push(
          this.hostStaticData
            .getBranchNames(bank.bankName, bank.countryCode)
            .subscribe((result) => {
              const data: Object = result
              // Se reasigna los valores que contienen el combo de las oficinas para el banco en ese pais
              this.formData.branchs = data['branchNameList']
              this.onChangeBranch()
            }),
        )
      }
    }
  }

  getBranch(address) {
    for (let i = 0; i < this.formData.branchs.length; ++i) {
      if (this.formData.branchs[i].branchName == address) {
        return this.formData.branchs[i]
      }
    }
  }

  onChangeBranch() {
    if (typeof this.batch != 'undefined') {
      let tmpBranch
      if (!this.branch) {
        tmpBranch = this.getBranch(this.branch)
        this.branch = tmpBranch
      } else {
        tmpBranch = this.branch
      }
      if (typeof tmpBranch != 'undefined') {
        this.batch.newBranchName = tmpBranch.branchName
        this.batch.newBranchSwiftCode = tmpBranch.branchCode
        this.batch.newSwiftCode = tmpBranch.swiftCode
        this.batch.newBranchAddress = tmpBranch.branchAddress
        this.batch.newBankAddress = tmpBranch.bankAddress
      }
    }
  }

  onChangeCurrency(): void {}

  onchangeCountryAddress() {}
  focusOutIbanAccountEvent(event): void {
    if (event) {
      this.focusOutIbanAccount(event.value)
    }
  }

  focusOutIbanAccount(value: string): void {
    const bankIbanCodeTmp = value.substring(4, 6)
    const bankIbanCode = '0' + bankIbanCodeTmp
    this.batch.newBankCode = bankIbanCode
    this.batch.newBankName = this.formData.banksCode[bankIbanCode]
  }

  focusInIbanAccount(target): void {
    if (!target || !target.value || target.value.length == 0) {
      this.batch.newBeneficiaryAccount = 'SA'
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  isValid() {
    return this.form.valid
  }
}
