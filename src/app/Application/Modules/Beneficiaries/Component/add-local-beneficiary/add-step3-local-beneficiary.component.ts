import { Location } from '@angular/common'
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'

// Import required to work with a shared data model.
import { Subscription } from 'rxjs'
import { FormData } from '../../Model/shared-form-Data.model'
import { FormDataService } from '../../Services/shared-form-data.service'

// General service to optain static data
import { BeneficiariesFormData } from '../../Services/beneficiaries-form-data.service'

// General service to add beneficiaries
import { BeneficiariesGlobalService } from '../../Services/beneficiaries-global.service'

@Component({
  templateUrl:
    '../../View/add-local-beneficiary/add-step3-local-beneficiary.html',
})
export class AddStep3LocalBeneficiary implements OnInit, OnDestroy {
  @ViewChild('authorization', { static: true }) authorization: any
  @Input() formData: FormData
  model: any
  banks: string[] = []
  subscription: Subscription
  sharedData: any

  constructor(
    public formDataService: FormDataService,
    public comboDataBeneficiaries: BeneficiariesFormData,
    public beneficiariesGlobalService: BeneficiariesGlobalService,
    public _location: Location,
    public router: Router,
  ) {
    this.model = {
      account: '',
    }
  }

  sendDetailLocalBeneficiary(): void {
    // Call service to validate account
    this.subscription = this.beneficiariesGlobalService
      .addLocalBeneficiary(
        this.formData.account,
        this.formData.bankName,
        this.formData.beneficiaryName,
        this.formData.phoneNumber,
        this.formData.email,
        this.formData.phoneNumber,
        this.formData.bankIbanCode,
        this.sharedData,
      )

      .subscribe((responseMsg) => {
        const msgResp = responseMsg['errorResponse']['englishMessage']
        //console.log("respMSG: ", responseMsg["errorResponse"]["englishMessage"] );

        if (responseMsg['errorCode'] == '0') {
          if (
            msgResp == 'Invalid IBAN number' ||
            msgResp == 'Account already exists'
          ) {
            //console.log("Error en iban");
            this.formData.invalidIBAN = true
            this.router.navigateByUrl(
              '/beneficiaries/LocalBeneficiary/AddStep3',
            )
          } else {
            this.router.navigateByUrl('/beneficiaries/AddBeneficiariesLastStep')
          }
          this.router.navigateByUrl('/beneficiaries/AddBeneficiariesLastStep')
        } else {
          this.router.navigateByUrl('/beneficiaries/LocalBeneficiary/AddStep3')
        }

        this.subscription.unsubscribe()
      })
  }

  goBack() {
    this.router.navigate(['/beneficiaries/LocalBeneficiary/AddStep2'])
  }

  ngOnInit() {
    // Obtención de los datos del modelo del componente anterior para el wizard
    this.formData = this.formDataService.getData()
    this.sharedData = this.formDataService.getSharedData()
    // -----------------------------------------------------------------------------------
    // CARGA DE LOS DATOS ESTATICOS DE LOS COMBOS DEL FORMUALRIO  */

    this.formData = this.formDataService.getData()

    // Creo un array de strings con los datos de los combos que voy a necesitar en el modulo Accounts
    const combosSolicitados = ['bankType']

    // Llamada al servio post con los datos del formulario en un json
    // Se espera a la respuesta y se muestra la modal de OK el envío.
    this.comboDataBeneficiaries
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: Object = comboData
        // this.cities = Posicion del parametro pasado al servicio
        // let combosSolicitados = ["cityType"]; por orden de petición
        this.banks = data[combosSolicitados.indexOf('bankType')]['values']
      })
  }

  ngOnDestroy() {
    this.formDataService.setData(this.formData)
    this.formDataService.setSharedData(this.sharedData)
  }

  valid() {
    return (
      !this.sharedData.generateChallengeAndOTP ||
      !this.authorization ||
      this.authorization.valid()
    )
  }
  finish() {
    this.formData.errorAccountValidation = false
    this.router.navigateByUrl('/beneficiaries/AddBeneficiariesLastStep')
  }
}
