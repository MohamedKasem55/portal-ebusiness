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
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../core/responsive/datatable-mobile.component'
import { StaticService } from '../../../../Common/Services/static.service'
import { RequestReactivateService } from './request-reactivate.service'

@Component({
  selector: 'app-request-reactivate-step1',
  templateUrl: './request-reactivate-step1.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateStep1Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @Input() batch: any
  @Input() data: any
  @Input() accounts: any
  @Input() isActivating: boolean
  @Output() onInit = new EventEmitter<Component>()
  @ViewChild('form') public form: NgForm

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
    this.combo.iquamaDurations = []
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

  ngOnInit() {
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

    const date = new Date(this.batch.initiationDate)
    this.data.initiationDate = `${date.getDate()}.${
      date.getUTCMonth() + 1
    }.${date.getFullYear()}`
    const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
    const dayPart = date.getHours() > 12 ? 'PM' : 'AM'
    this.data.initiationTime = `${hours}.${this.fill(
      date.getMinutes(),
    )}.${this.fill(date.getSeconds())} ${dayPart}`
    this.data.initiationBy = this.batch.securityLevelsDTOList[0].updater
  }

  changeLicenseType() {
    this.refreshDataLicenseType()
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
        //console.log(this.combo);
      })

    if (this.data.transactionType == 'R') {
      this.data.passportType =
        this.data.passportType == null ? '0000000000' : this.data.passportType
      this.data.passportDuration =
        this.data.passportDuration == null
          ? '0000000000'
          : this.data.passportDuration
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

  private fill(value: number): string {
    if (value < 10) {
      return `0${value}`
    }

    return value.toString()
  }
}
