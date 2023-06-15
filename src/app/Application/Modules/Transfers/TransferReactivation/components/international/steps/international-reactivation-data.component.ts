import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core'
import { TransferReactivationService } from '../../../transfer-reactivation.service'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ModelPipe } from '../../../../../../Components/common/Pipes/model-pipe'
import { TranslateService } from '@ngx-translate/core'
import { AbstractAppComponent } from '../../../../../Common/Components/Abstract/abstract-app.component'
import { StaticService } from '../../../../../Common/Services/static.service'
import { Exception } from '../../../../../../Model/exception'
import { TransferInternationalService } from '../../../../Services/transfer-international.service'

@Component({
  selector: 'international-reactivation-data',
  templateUrl: './international-reactivation-data.component.html',
})
export class InternationalReactivationDataComponent
  extends AbstractAppComponent
  implements OnInit, OnChanges
{
  @Input()
  batches: any[] = []
  @Input()
  accounts: any[] = []
  @Input()
  beneficiaries: any[] = []
  @Input()
  forms: FormGroup[] = []
  @Input()
  formsFieldsConfigs: any[] = []
  @Input()
  disabled: boolean
  @Input()
  transferReasons: any[] = []
  combosData: any = {}

  constructor(
    public reactivationService: TransferReactivationService,
    public fb: FormBuilder,
    public modelPipe: ModelPipe,
    public staticService: StaticService,
    public translateService: TranslateService,
  ) {
    super(translateService)
    this.combosData['accounts'] = []
    this.combosData['transferReasons'] = []
  }

  ngOnInit(): void {
    this.prepareForms()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.prepareForms()
  }

  refreshData() {
    this.prepareForms()
  }

  prepareForms() {
    this.accounts.forEach((element) => {
      this.combosData['accounts'].push({
        key: element['fullAccountNumber'],
        value: element['fullAccountNumber'],
      })
    })

    this.transferReasons.forEach((item) => {
      this.combosData['transferReasons'].push({
        key: item['purposeCode'],
        value:
          this.translate.currentLang == 'en'
            ? item.purposeDescriptionEn
            : item.purposeDescriptionAr,
      })
    })

    if (Array.isArray(this.batches) && this.forms.length == 0) {
      this.batches.forEach((batch, i) => {
        const formGroup = this.fb.group({})
        this.forms.push(formGroup)
        const formFieldsConfig =
          this.reactivationService.getInternationalDynamicFormFields(
            batch,
            this.beneficiaries && this.beneficiaries[i]
              ? this.beneficiaries[i]
              : null,
            this.accounts,
          )
        this.formsFieldsConfigs.push(formFieldsConfig)
      })
    }
  }

  enableDisable(form: FormGroup) {
    if (this.disabled) {
      form.disable()
    } else {
      form.enable()
    }
    this.subscriptions.push(
      form.get('transferReason').valueChanges.subscribe((values) => {
        this.transferReasons.forEach((item) => {
          if (form.get('transferReason').value === item['purposeCode']) {
            form
              .get('transferReasonLbl')
              .setValue(
                this.translate.currentLang == 'en'
                  ? item.purposeDescriptionEn
                  : item.purposeDescriptionAr,
              )
            form.get('additionalInfoFlag').setValue(item['additionalInfoFlag'])
            form.get('additionalInfo1').setValue(item['additionalInfo1En'])
            form.get('additionalInfo1Lbl').setValue('additionalInfo1En')
            form.get('additionalInfo2').setValue(item['additionalInfo2En'])
            form.get('additionalInfo2Lbl').setValue('additionalInfo2En')
            form.get('payType').setValue(item['payType'])
          }
        })
      }),
    )
  }
}
