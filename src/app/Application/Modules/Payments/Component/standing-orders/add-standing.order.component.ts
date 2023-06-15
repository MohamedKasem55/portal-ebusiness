import { Location } from '@angular/common'
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
// Import required to work with a shared data model.
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { StadingModel } from '../../Model/standinFormModel'
import { StadingOrdersService } from '../../Services/standingOrder.services'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

function MayorA1(c: FormControl) {
  if (c.value < 1) {
    //console.log('not valid')
    return {
      noMagic: true,
    }
  }

  // Null means valid, believe it or not
  //console.log('valid')
  return null
}

@Component({
  templateUrl: '../../View/add-standing.order.html',
  styles: [
    `
      .head {
        margin-top: 15px;
        margin-bottom: 15px;
        padding: 15px 0px 15px 0px;
      }

      .modal-body {
        position: relative;
        padding: 0px 30px;
        text-align: center;
      }

      .btn {
        padding: 10px 10px;
        font-size: 11px;
        line-height: 11px;
        border-radius: 2px;
      }

      .sme-checkbox.checkbox-inline,
      .sme-checkbox.radio-inline,
      .sme-checkbox label,
      .sme-radio.checkbox-inline,
      .sme-radio.radio-inline,
      .sme-radio label {
        padding-left: 22px;
        min-height: 22px;
        min-width: 22px;
        color: #595e72;
        letter-spacing: 0;
        font-size: 12px;
      }

      .bs-datepicker {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: stretch;
        -ms-flex-align: stretch;
        align-items: stretch;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-flow: row wrap;
        flex-flow: row wrap;
        background: #fff;
        box-shadow: 0 0 10px 0 #aaa;
        position: relative;
        z-index: 1;
      }

      .input-group-addon {
        padding: 6px 12px;
        font-size: 14px;
        font-weight: normal;
        line-height: 1;
        color: #555555;
        text-align: center;
        background-color: #ffffff !important;
        border: 1px solid #ffffff;
        border-radius: 0;
      }

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
export class AddStandingOrderComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('table', { static: true }) table: any
  @ViewChild('tableLocal', { static: true }) tableL: any
  @ViewChild('template2', { static: true }) template2: any
  @ViewChild('template', { static: true }) template: any

  authorization: any

  @ViewChild('authorization') set content(content) {
    this.authorization = content
  }

  dateBirth: any
  minDate: { year: number; month: number; day: number }
  pro: any

  changeDetectorRef: any
  bsConfig

  public generateChallengeAndOTP: ResponseGenerateChallenge
  public requestValidate: RequestValidate

  today: Date = new Date()

  /*
      @ViewChild('template2')
      set tableLocal(ref: any) {
        //console.log("HOLA");
        //console.log(ref);
      }*/

  @ViewChild('tableWrapper') tableWrapper
  @ViewChild(DatatableComponent, { static: true })
  tableLocal: DatatableComponent
  @ViewChild(DatatableComponent, { static: true })
  public datatableComponent: DatatableComponent

  showDateBirth = false
  showDateIssued = false
  openToCalendar = true

  day = null
  remarks = null
  dateTo = null
  datefrom = null
  isDisabled: boolean
  openFromCalendar = true

  datepickerModel: Date
  daterangepickerModel: Date[]

  @Input() formControl: FormControl
  @Input() formData: FormData

  accountToNumber: number

  to: any
  minimato: any

  bsValue: any

  bsRangeValue: any = [new Date(2017, 7, 4), new Date(2017, 7, 20)]

  wizardStep = 1

  dateDisabled: { date: Date; mode: string }[]

  local = []

  saad = []

  acconterSearch: number

  titleText: string

  selected: any[] = []

  selected2: any[] = []

  modalRef: BsModalRef

  rows = []

  Accountparameter: any

  accountTo: number = null

  temp = []

  temp1 = []

  loadingIndicator = true

  name: string

  columns = [
    { prop: 'bankName' },
    { name: 'name' },
    { name: 'beneficiaryAccount.fullAccountNumber' },
  ]

  onType1 = false

  onType2 = true

  beneficiaryAccount: any

  beneficiaryId: string

  bg: any = 0

  orderType1 = null

  orderType2: number

  paymentNumber: any = ''

  ownAccountsFlag: any = ''
  comboDataPurpose: any

  amount: number
  accountFrom: string

  purposeTypes: any
  /** validadicones  */
  /*form*/

  isValidFormSubmitted: boolean = null
  validominimo: boolean = null
  resulValidation: any

  /*validarfecha*/
  alertday = false

  myGroup = new FormGroup({
    amounttype: new FormControl('', Validators.required),
    Accountto: new FormControl('', Validators.required),
    purpose: new FormControl('', Validators.required),
    monthfrecuency: new FormControl('', Validators.required),
    amount: new FormControl('', [Validators.required]),
    day: new FormControl('', [
      Validators.maxLength(2),
      Validators.pattern('^[0-9]*$'),
      Validators.required,
    ]),
    datefrom: new FormControl('', Validators.required),
    to: new FormControl('', Validators.required),
    remarks: new FormControl(''),
  })

  user = new StadingModel()

  constructor(
    private formDataService: StadingOrdersService,
    private _location: Location,
    private router: Router,
    private builder: FormBuilder,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    public translate: TranslateService,
  ) {
    super()
    this.requestValidate = new RequestValidate()
    //console.log(this.today.getDate());
    this.today = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() + 2,
    )
    //console.log(this.today);
    this.minDate = { year: 2017, month: 1, day: 1 }
    const dia = new Date().getTime() + 30 * 24 * 60 * 60 * 1000 + 2

    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )

    this.accountFrom = this.formDataService.getAccount().fullAccountNumber
  }

  ngOnInit() {
    super.ngOnInit()
    if (!this.formDataService.getAccount()) {
      this.router.navigate(['/payments/stadingOrders'])
      return
    }
    this.datefrom = new Date()
    this.datefrom.setDate(this.datefrom.getDate() + 2)
    const dia = new Date().getTime() + 30 * 24 * 60 * 60 * 1000 + 2

    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )

    this.isDisabled = false
    this.Accountparameter = this.route.snapshot.paramMap.get('account')
    /* this.myGroup = new FormGroup({
              amounttype: new FormControl("", Validators.required),
              Accountto: new FormControl("", Validators.required),
              purpose: new FormControl("", Validators.required),
              monthfrecuency: new FormControl("", Validators.required),
              amount: new FormControl("", Validators.required),
              day: new FormControl("", Validators.required),
              dateFrom: new FormControl("", Validators.required),
              to: new FormControl("", Validators.required),
              remarks: new FormControl("")
            });*/

    // Creo un array de strings con los datos de los combos que voy a necesitar en el modulo Accounts

    // Llamada al servio post con los datos del formulario en un json
    // Se espera a la respuesta y se muestra la modal de OK el envío.
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.refresh()
    })
    this.refresh()
  }

  refresh() {
    this.formDataService.combostandingordenPurpose().subscribe((result) => {
      if (result === null) {
      } else {
        this.purposeTypes = this.reorder(result)
        //this.pro = result;
        //console.log("aqui vamos-->" + this.pro );
      }
    })
  }

  goBack() {
    if (this.wizardStep == 1) {
      this.router.navigate(['/payments/stadingOrders'])
    } else {
      this.wizardStep = 1
    }
  }

  saveStandingOrder() {
    //console.log("!!!!!!!!!!!!!!!!!!!!")

    //this.generateChallengeAndOTP =  { ...this.resulValidation.generateChallengeAndOTP };
    delete this.resulValidation.generateChallengeAndOTP
    this.resulValidation.standingOrderBatch.dateFrom =
      this.resulValidation.standingOrderBatch.dateFrom + 'T00:00:00.000Z'
    this.resulValidation.standingOrderBatch.dateTo =
      this.resulValidation.standingOrderBatch.dateTo + 'T00:00:00.000Z'
    this.resulValidation.standingOrderBatch.orderDate =
      this.resulValidation.standingOrderBatch.orderDate + 'T00:00:00.000Z'

    delete this.resulValidation.errorCode
    delete this.resulValidation.errorDescription
    delete this.resulValidation.errorResponse
    delete this.resulValidation.generateChallengeAndOTP
    delete this.resulValidation.standingOrderBatch.account15Length
    delete this.resulValidation.standingOrderBatch.fullAccountNumber
    delete this.resulValidation.standingOrderBatch.accountFromFk
    delete this.resulValidation.standingOrderBatch.accountFromFk
    delete this.resulValidation.standingOrderBatch
      .authorizationResponseRecordWSDTO
    delete this.resulValidation.standingOrderBatch
      .authorizationResponseRecordWSDTO
    delete this.resulValidation.standingOrderBatch.batchPk
    delete this.resulValidation.standingOrderBatch.cic
    delete this.resulValidation.standingOrderBatch.companyFk
    delete this.resulValidation.standingOrderBatch.futureStatus
    delete this.resulValidation.standingOrderBatch.hostRequest
    delete this.resulValidation.standingOrderBatch.initiationDate
    delete this.resulValidation.standingOrderBatch.initiationResponseRecordWSDTO
    delete this.resulValidation.standingOrderBatch.max
    delete this.resulValidation.standingOrderBatch.nextStatus
    delete this.resulValidation.standingOrderBatch.offset
    delete this.resulValidation.standingOrderBatch.rejectedReason
    delete this.resulValidation.standingOrderBatch.securityLevelsDTOList
    delete this.resulValidation.standingOrderBatch.sessionInfo

    this.resulValidation.requestValidate = this.requestValidate

    this.formDataService.confirmStandingOrder2(this.resulValidation).subscribe(
      (responseMsg) => {
        if (responseMsg['errorCode'] == 0) {
          this.wizardStep = 3
        } else {
          //console.log("Error ="+responseMsg.errorCode);
          this.wizardStep = 2
        }
      },
      (error) => {
        this.wizardStep = 2
      },
    )
  }

  onFormSubmit() {
    this.isValidFormSubmitted = false
    if (this.myGroup.invalid) {
      return
    }
    this.isValidFormSubmitted = true
    //console.log(this.myGroup.valid);
    this.user.amounttype = this.myGroup.get('amounttype').value
    this.user.Accountto = this.myGroup.get('Accountto').value
    this.user.purpose = this.myGroup.get('purpose').value
    this.user.monthfrecuency = this.myGroup.get('monthfrecuency').value
    this.user.amount = this.myGroup.get('amount').value
    this.user.day = this.myGroup.get('day').value
    this.user.datefrom = this.myGroup.get('datefrom').value
    this.user.to = this.myGroup.get('to').value
    this.user.remarks = this.myGroup.get('remarks').value

    //this.reset();

    this.formDataService
      .ValidacionaddStandingOrder(
        this.formDataService.getAccount().fullAccountNumber,
        this.user.Accountto,
        this.user.amounttype,
        this.beneficiaryAccount,
        this.beneficiaryId,
        this.user.amount,
        this.user.datefrom,
        this.user.to,
        this.user.day,
        this.name,
        this.onType1,
        this.onType2,
        this.orderType1,
        this.user.monthfrecuency,
        this.ownAccountsFlag,
        this.user.purpose,
        this.user.remarks,
      )
      .subscribe(
        (responseMsg) => {
          if (responseMsg.errorCode == 0) {
            this.resulValidation = responseMsg
            this.accountFrom =
              this.resulValidation.standingOrderBatch.accountNumber
            this.generateChallengeAndOTP = {
              ...this.resulValidation.generateChallengeAndOTP,
            }

            this.wizardStep = 2
          } else {
            //console.log("Error ="+responseMsg.errorCode);
            this.wizardStep = 1
          }
        },
        (error) => {
          this.wizardStep = 1
        },
      )
  }

  getAllTables(): any[] {
    const tablas = []
    //console.log(this.tableL);
    if (this.table) {
      tablas.push(this.table)
    }
    if (this.tableL) {
      tablas.push(this.tableL)
    }
    return tablas
  }

  changeDateTo() {
    if (this.datefrom) {
      const dia = new Date().getTime() + 30 * 24 * 60 * 60 * 1000 + 2
      //console.log(dia);
      //this.to = dateTo;
      //this.minimato =dateTo;
      //console.log("funciona el cambio");

      this.myGroup.get('datefrom').valueChanges.subscribe((val) => {
        const _dia = new Date(val).getTime() + 30 * 24 * 60 * 60 * 1000 + 2
        this.to = new Date(_dia)
        this.minimato = new Date(_dia)
        //console.log(`My name is ${dia}.`) ;
      })

      //console.log(this.myGroup);
    }
  }

  changeday() {
    this.myGroup.get('day').valueChanges.subscribe((val) => {
      if (val < 0 || val > 31) {
        this.alertday = true
      } else {
        this.alertday = false
      }
    })
  }

  /* PARA MOSTRAR LA INFORMACION DE LO LOCALES*/

  openModal(template: any) {
    // this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
    this.template.show()
    this.titleText = 'Confirm Dialog'

    this.getBeneficiaries()
    this.loadingIndicator = true
  }

  closeModal() {
    this.modalRef.hide()
  }

  /* PARA MOSTRAR LA INFORMACION DE  LOS  INTERNACIONALES*/

  openModal2(template: any) {
    // this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
    this.template2.show()
    this.getBeneficiaries()
    this.titleText = 'confirmacion y listo'
    this.loadingIndicator = true
  }

  Open() {
    //console.log("si esta aqui");
  }

  getBeneficiaries() {
    if (this.local.length == 0 || this.saad.length == 0) {
      this.formDataService
        .getBeneficiaries(this.accountFrom)
        .subscribe((data) => {
          if (data['errorCode'] != '0') {
            this.template.hide()
            this.template2.hide()
            this.loadingIndicator = false
          } else {
            this.local = data['beneficiaryList'].filter((x) => x.type === '02')
            this.temp = [...this.local]

            this.saad = data['beneficiaryList'].filter((x) => x.type === '01')

            this.temp1 = [...this.saad]
            this.loadingIndicator = false
          }
        })
    }
  }

  /*
      /* obtiene las cuentas locales*/
  // GetLocal() {
  //   this.formDataService
  //     .getBeneficiaries(this.accountFrom)
  //     .subscribe((data) => {
  //       this.local = data;
  //       this.temp = [...data];
  //       this.loadingIndicator = false;
  //     });
  // }
  //
  // GetInternacional() {
  //   this.formDataService
  //     .getBeneficiariesASad(this.accountFrom)
  //     .subscribe((data) => {
  //       this.saad = data;
  //       this.temp1 = [...data];
  //       //  //console.log("internacional"+ JSON.stringify(data));
  //       this.loadingIndicator = false;
  //     });
  // }

  callcombo(value) {
    //console.log("el valor que llega -->"+value);
  }

  onError(result) {
    //
  }

  ngOnDestroy() {
    // this.formDataService.setData(this.formData);
  }

  nextAdd(myGroup: any): void {
    //console.log("Form Data: ");
    //console.log(myGroup.value);
  }

  onSelect(event) {
    //console.log("Event: select", event, this.selected);
  }

  onActivate(event) {
    //console.log("Event: activate", event);
  }

  addStandindOrder(myGroup: any): void {
    // Call service to validate account

    this.formDataService
      .addStandingOrder(
        this.Accountparameter,
        this.myGroup.value.Accountto,
        this.myGroup.value.amounttype,
        this.beneficiaryAccount,
        this.beneficiaryId,
        this.myGroup.value.amount,
        this.myGroup.value.from,
        this.myGroup.value.to,
        this.myGroup.value.day,
        this.name,
        this.onType1,
        this.onType2,
        this.orderType1,
        this.myGroup.value.monthfrecuency,
        this.ownAccountsFlag,
        this.myGroup.value.purpose,
        this.myGroup.value.remarks,
      )
      .subscribe((responseMsg) => {
        if (responseMsg['errorCode'] === '0') {
          this.wizardStep = 3
        } else {
          this.wizardStep = 2
        }
      })
  }

  /* seleccion*/

  onSelectLocal($event) {
    //
    const valor = $event.selected[0].beneficiaryAccountCode
    this.accountTo = valor
    //console.log(valor);
    this.beneficiaryAccount = valor
    this.beneficiaryId = $event.selected[0].beneficiaryId
    this.name = $event.selected[0].name
    const vertype = $event.selected[0].type

    if (vertype === '02') {
      this.ownAccountsFlag = 'N'
    } else {
      this.ownAccountsFlag = 'N'
    }
    this.template.hide()
    // this.closeModal();
  }

  onSelectLocalMobile(row) {
    const valor = row.beneficiaryAccountCode
    this.accountTo = valor
    //console.log(valor);
    this.beneficiaryAccount = valor
    this.beneficiaryId = row.beneficiaryId
    this.name = row.name
    const vertype = row.type

    if (vertype === '02') {
      this.ownAccountsFlag = 'N'
    } else {
      this.ownAccountsFlag = 'N'
    }
    this.template.hide()
    // this.closeModal();
  }

  onSelectInternacional($event) {
    const valor = $event.selected[0].beneficiaryAccount.fullAccountNumber
    this.accountTo = valor
    //console.log(valor);
    this.beneficiaryAccount = valor
    this.beneficiaryId = $event.selected[0].beneficiaryId
    this.name = $event.selected[0].name
    const vertype = $event.selected[0].type

    if (vertype === '02') {
      this.ownAccountsFlag = 'N'
    } else {
      this.ownAccountsFlag = 'N'
    }
    this.template2.hide()
    // this.closeModal();
  }

  onSelectInternacionalMobile(row) {
    const valor = row.beneficiaryAccount.fullAccountNumber
    this.accountTo = valor
    //console.log(valor);
    this.beneficiaryAccount = valor
    this.beneficiaryId = row.beneficiaryId
    this.name = row.name
    const vertype = row.type

    if (vertype === '02') {
      this.ownAccountsFlag = 'N'
    } else {
      this.ownAccountsFlag = 'N'
    }
    this.template2.hide()
  }

  // updateFilterLocal(event)
  // {
  //     this.loadingIndicator = true;
  //     const val = event.target.value.toLowerCase();
  //     this.formDataService
  //         .getBeneficiaries(this.Accountparameter)
  //         .subscribe((data) => {
  //             this.local = data;
  //             this.temp = [...data];
  //             this.temp = this.local.filter(
  //                 (row) => row.name.toLowerCase().indexOf(val) !== -1 || !val);
  //             this.local = this.temp;
  //             this.loadingIndicator = false;
  //         });
  // }

  updateFilter(event) {
    this.loadingIndicator = true
    const val = event.target.value.toLowerCase()
    this.formDataService
      .getBeneficiaries(this.accountFrom)
      .subscribe((data) => {
        this.saad = data['beneficiaryList'].filter((x) => x.type === '01')
        this.temp1 = [...this.saad]
        //  //console.log("internacional"+ JSON.stringify(data));
        this.temp1 = this.saad.filter(
          (row) => row.name.toLowerCase().indexOf(val) !== -1 || !val,
        )
        this.saad = this.temp1

        this.local = data['beneficiaryList'].filter((x) => x.type === '02')
        this.temp = [...this.local]
        this.temp = this.local.filter(
          (row) => row.name.toLowerCase().indexOf(val) !== -1 || !val,
        )
        this.local = this.temp

        this.loadingIndicator = false
      })
  }

  // updateFilter(event)
  // {
  //     this.loadingIndicator = true;
  //     const val = event.target.value.toLowerCase();
  //     this.formDataService
  //         .getBeneficiariesASad(this.Accountparameter)
  //         .subscribe((data) => {
  //             this.saad = data;
  //             this.temp1 = [...data];
  //             //  //console.log("internacional"+ JSON.stringify(data));
  //             this.temp1 = this.saad.filter(
  //                 (row) => row.name.toLowerCase().indexOf(val) !== -1 || !val);
  //             this.saad = this.temp1;
  //             this.loadingIndicator = false;
  //         });
  // }

  /*calendar */

  public

  componentAdded(event) {}

  isPending() {
    if (
      this.generateChallengeAndOTP &&
      (this.generateChallengeAndOTP.typeAuthentication === 'STATIC' ||
        this.generateChallengeAndOTP.typeAuthentication === 'OTP' ||
        this.generateChallengeAndOTP.typeAuthentication === 'CHALLENGE')
    ) {
      return false
    } else {
      return true
    }
  }

  valid() {
    if (this.authorization) {
      return this.authorization.valid()
    } else {
      return true
    }
  }

  reorder(list: any) {
    const newList = []
    let others
    if (list) {
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].key != '09') {
          newList.push(list[i])
        } else {
          others = list[i]
        }
      }
      newList.push(others)
    }
    return newList
  }
}
