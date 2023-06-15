import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../core/responsive/datatable-mobile.component'
import { StaticService } from '../../../../Common/Services/static.service'
import { RequestReactivateService } from './request-reactivate.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-request-reactivate-step2',
  templateUrl: './request-reactivate-step2.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateStep2Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('authorization') authorization: any
  @Input() batch: any
  @Input() data: any
  @Input() accounts: any
  @Input() option: any
  @Input() DeleteOption: any
  @Input() InitiateOption: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Output() onInit = new EventEmitter<Component>()
  @Input() isActivating: boolean

  bsConfig: any

  services: any
  subscriptions: Subscription[] = []
  combo: any = {}

  constructor(
    private fb: FormBuilder,
    public service: RequestReactivateService,
    public staticsService: StaticService,
    public translate: TranslateService,
  ) {
    super()
    this.services = this.service.getServicesConfig().services
    this.combo.issuanceReasons = []
    this.combo.licenseTypes = []
    this.combo.visaDurations = []
    this.combo.iqamaDurations = []
    this.combo.jobCategorys = []
    this.combo.passportTypes = []
    this.combo.passportDurations = []
    this.combo.vehicleRegistrationTypes = []
    this.combo.vehicleBodyTypes = []
    this.combo.visaTypes = []
    this.combo.licenseDurations = []
    this.combo.eGovViolationsIssuingEntity = []
    this.combo.eGovCategory = []
    this.combo.eGovCategory00000001 = []
    this.combo.eGovCategory00000002 = []
    this.combo.eGovCategory00000004 = []
    this.combo.eGovCategory00000005 = []
    this.combo.eGovCategory00000008 = []
  }

  valid(): boolean {
    if (this.authorization) {
      return this.authorization.valid()
    } else {
      return true
    }
  }

  ngOnInit() {
    this.onInit.emit(this as Component)
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
    this.onInit.emit(this as Component)
    this.refreshData()

    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.refreshData()
      }),
    )
  }

  refreshDataLicenseType(): void {
    if (this.data.licenseType) {
      let licenseStaticName: string
      licenseStaticName = 'eGovLicenseDurationType' + this.data.licenseType

      // Creo un array de strings con los datos de los combos que voy a necesitar en el modulo Accounts
      const combosSolicitados = [licenseStaticName]

      // Llamada al servio post con los datos del formulario en un json
      // Se espera a la respuesta y se muestra la modal de OK el envío.
      this.staticsService
        .getAllCombos(combosSolicitados)
        .subscribe((comboData) => {
          const data: any = comboData
          this.combo.licenseDurations = []
          this.combo.licenseDurations =
            data[combosSolicitados.indexOf(licenseStaticName)]['values']
        })
    }
  }

  refreshData(): void {
    // Creo un array de strings con los datos de los combos que voy a necesitar en el modulo Accounts
    const combosSolicitados = [
      'eGovVisaTypes',
      'eGovVehicleRegistrationType',
      'eGovVehicleBodyType',
      'eGovPassportTypes',
      'eGovSadadPassportDuration',
      'eGovSadadIssuanceReason',
      'eGovLicenseTypeApp',
      'eGovSadadVisaDuration',
      'eGovSadadIqamaDuration',
      'eGovSadadJobCategory',
      'eGovViolationsIssuingEntity',
      //"eGovCategory00000001",
      'eGovCategory00000002',
      'eGovCategory00000004',
      'eGovCategory00000005',
      'eGovCategory00000008',
    ]

    // Llamada al servio post con los datos del formulario en un json
    // Se espera a la respuesta y se muestra la modal de OK el envío.
    this.staticsService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: any = comboData
        this.combo.issuanceReasons = []
        this.combo.issuanceReasons =
          data[combosSolicitados.indexOf('eGovSadadIssuanceReason')]['values']
        this.combo.licenseTypes = []
        this.combo.licenseTypes =
          data[combosSolicitados.indexOf('eGovLicenseTypeApp')]['values']
        this.combo.visaDurations = []
        this.combo.visaDurations =
          data[combosSolicitados.indexOf('eGovSadadVisaDuration')]['values']
        this.combo.iqamaDurations = []
        this.combo.iqamaDurations =
          data[combosSolicitados.indexOf('eGovSadadIqamaDuration')]['values']
        this.combo.jobCategorys = []
        this.combo.jobCategorys =
          data[combosSolicitados.indexOf('eGovSadadJobCategory')]['values']
        this.combo.passportTypes = []
        this.combo.passportTypes =
          data[combosSolicitados.indexOf('eGovPassportTypes')]['values']
        this.combo.passportDurations = []
        this.combo.passportDurations =
          data[combosSolicitados.indexOf('eGovSadadPassportDuration')]['values']
        this.combo.vehicleRegistrationTypes = []
        this.combo.vehicleRegistrationTypes =
          data[combosSolicitados.indexOf('eGovVehicleRegistrationType')][
            'values'
          ]
        this.combo.vehicleBodyTypes = []
        this.combo.vehicleBodyTypes =
          data[combosSolicitados.indexOf('eGovVehicleBodyType')]['values']
        this.combo.visaTypes = []
        this.combo.visaTypes =
          data[combosSolicitados.indexOf('eGovVisaTypes')]['values']

        this.combo.eGovViolationsIssuingEntity =
          data[combosSolicitados.indexOf('eGovViolationsIssuingEntity')][
            'values'
          ]
        //this.combo.eGovCategory00000001 =
        //    data[combosSolicitados.indexOf("eGovCategory00000001")]["values"];
        this.combo.eGovCategory00000002 =
          data[combosSolicitados.indexOf('eGovCategory00000002')]['values']
        this.combo.eGovCategory00000004 =
          data[combosSolicitados.indexOf('eGovCategory00000004')]['values']
        this.combo.eGovCategory00000005 =
          data[combosSolicitados.indexOf('eGovCategory00000005')]['values']
        this.combo.eGovCategory00000008 =
          data[combosSolicitados.indexOf('eGovCategory00000008')]['values']

        this.refreshDataLicenseType()
      })
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  toShortDate(date) {
    if (date) {
      return date['day'] + '/' + date['month'] + '/' + date.birthDate['year']
    } else {
      return ''
    }
  }
}
