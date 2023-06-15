import {
  Component,
  OnInit,
  OnChanges,
  Input,
  ViewChild,
  OnDestroy,
  Injector,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { DataTableWraperComponent } from '../../../../../../Components/common/data-table-wrapper.component'
import { LevelFormatPipe } from '../../../../../../Components/common/Pipes/getLevels-pipe'
import { StorageService } from '../../../../../../../core/storage/storage.service'
import { MOI_PAYMENTS_FORMS_FIELDS_CONFIGS } from '../../moi-payment.form-fields-configs'
import { ModelPipe } from '../../../../../../Components/common/Pipes/model-pipe'

@Component({
  selector: 'app-moi-payment-confirmation-table',
  templateUrl: './moi-payment-confirmation-table.component.html',
})
export class MoiPaymentConfirmationTableComponent
  extends DataTableWraperComponent
  implements OnInit, OnChanges, OnDestroy
{
  MOI_PAYMENTS_FORMS_FIELDS_CONFIGS: any = MOI_PAYMENTS_FORMS_FIELDS_CONFIGS

  @Input() showCitizenId = false
  @ViewChild('table', { static: true }) table: DatatableComponent
  selectAllOnPage: any = []
  tableSelectedRows: any = []

  constructor(
    public translate: TranslateService,
    private levelsPipe: LevelFormatPipe,
    private storage: StorageService,
    public injector: Injector,
  ) {
    super()
  }

  ngOnDestroy() {}

  ngOnInit(): void {
    super.ngOnInit()
  }

  ngOnChanges() {
    this.prepareItems()
  }

  getId(row) {
    return row['batchPk']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  private prepareItems() {
    this.items.forEach((item) => {
      const status = this.futureLevels
        ? item.futureSecurityLevelsDTOList
        : item.securityLevelsDTOList
      const nextStatus = status
      item.statusTranslated = this.levelsPipe.transform(status, 'status')
      item.nextStatusTranslated = this.levelsPipe.transform(
        nextStatus,
        'nextStatus',
      )
      item.citizenId = this.getCitizenIdFromDetails(
        item.details ? item.details : [],
      )
    })
  }

  public getCitizenIdFromDetails(details: any[]) {
    return details && details[0] ? details[0].value : null
  }

  getNowDate() {
    return new Date()
  }

  getCurrentUser() {
    const storageVal = this.storage.retrieve('currentuser')
    if (!storageVal) {
      return
    }
    const userTemp = JSON.parse(storageVal)
    return userTemp && userTemp.user ? userTemp.user.userId : ''
  }

  getDetailLabel(row, detail) {
    const detailKey = (detail.labelKey + '.id').split('.')[1]
    const fieldsConfigs = this.getExtraFormFieldsConfigs(row)
    let labelId = null
    fieldsConfigs.forEach((config) => {
      if (config.key == detailKey) {
        labelId = 'payments.moiPayments.' + config.translate
      }
    })
    return labelId ? labelId : 'myProfile.pending_actions.' + detailKey
  }

  getDetailValue(row, detail) {
    const detailKey = (detail.labelKey + '.id').split('.')[1]
    const fieldsConfigs = this.getExtraFormFieldsConfigs(row)
    let detailValue = detail.value
    fieldsConfigs.forEach((config) => {
      if (
        config.key == detailKey &&
        config.type == 'select' &&
        config.select_combo_key
      ) {
        let select_combo_key = config.select_combo_key
        if (config.select_dependent) {
          const select_parent = config.select_parent
          select_combo_key = config.select_combo_key_by_parent_value
          row.details.forEach((dt) => {
            const dtKey = (dt.labelKey + '.id').split('.')[1]
            if (dtKey == select_parent) {
              const parentValue = dt.value
              select_combo_key = select_combo_key.replace(
                '[%value%]',
                parentValue,
              )
              select_combo_key = select_combo_key.replace(
                '[%value0%]',
                parentValue,
              )
            }
          })
        }
        detailValue = new ModelPipe(this.injector).transform(
          select_combo_key,
          detail.value,
        )
      }
    })
    return detailValue
  }

  getCivilianIdLabel(row) {
    const fieldsConfigs = this.getExtraFormFieldsConfigs(row)
    let labelId = null
    fieldsConfigs.forEach((config) => {
      switch (config.key) {
        case 'sponsorId':
        case 'citizenId':
        case 'violatorId':
        case 'nationalIdNumber':
        case 'iqamaId':
        case 'householdIdNumber':
        case 'currentOwnerId':
        case 'newOwnerId':
        case 'civilianID':
        case 'civilianId':
          labelId = config.key
          break
      }
    })
    return labelId
      ? 'myProfile.pending_actions.' + labelId
      : 'myProfile.pending_actions.civilianID'
  }

  getExtraFormFieldsConfigs(values: any): any[] {
    let fieldsConfigs =
      values.serviceType &&
      values.applicationType &&
      this.MOI_PAYMENTS_FORMS_FIELDS_CONFIGS[values.serviceType] &&
      this.MOI_PAYMENTS_FORMS_FIELDS_CONFIGS[values.serviceType]
        .applicationsTypes[values.applicationType]
        ? this.MOI_PAYMENTS_FORMS_FIELDS_CONFIGS[values.serviceType]
            .applicationsTypes[values.applicationType].fieldsConfigs
        : null

    if (!fieldsConfigs) {
      const servicesIDs = Object.keys(this.MOI_PAYMENTS_FORMS_FIELDS_CONFIGS)
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < servicesIDs.length; i++) {
        const serviceDef =
          this.MOI_PAYMENTS_FORMS_FIELDS_CONFIGS[servicesIDs[i]]
        const applicationTypes = Object.keys(serviceDef.applicationsTypes)
        if (applicationTypes.indexOf(values.applicationType) >= 0) {
          fieldsConfigs =
            serviceDef.applicationsTypes[values.applicationType].fieldsConfigs
          break
        }
      }
    }
    return fieldsConfigs ? fieldsConfigs : []
  }
}
