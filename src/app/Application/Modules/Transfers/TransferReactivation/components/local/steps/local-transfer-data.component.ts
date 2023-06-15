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

@Component({
  selector: 'local-transfer-data',
  templateUrl: './local-transfer-data.component.html',
})
export class LocalTransferDataComponent
  extends AbstractAppComponent
  implements OnInit, OnChanges
{
  @Input()
  batches: any[] = []
  @Input()
  accounts: any[] = []
  @Input()
  transferReasons: any[] = []
  @Input()
  beneficiaries: any[] = []
  @Input()
  forms: FormGroup[] = []
  @Input()
  formsFieldsConfigs: any[] = []
  @Input()
  disabled: boolean
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

    if (this.transferReasons) {
      this.transferReasons.forEach((item) => {
        this.combosData['transferReasons'].push({
          key: item['purposeCode'],
          value:
            this.translate.currentLang == 'en'
              ? item.purposeDescriptionEn
              : item.purposeDescriptionAr,
        })
      })
    }

    if (Array.isArray(this.batches) && this.forms.length == 0) {
      this.batches.forEach((batch, i) => {
        const formGroup = this.fb.group({})
        this.forms.push(formGroup)
        const formFieldsConfig =
          this.reactivationService.getLocalDynamicFormFields(
            batch,
            this.beneficiaries && this.beneficiaries[i]
              ? this.beneficiaries[i]
              : null,
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
  }
}
