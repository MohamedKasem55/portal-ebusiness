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
import { DataTableWraperComponent } from '../../../../../Components/common/data-table-wrapper.component'
import { LevelFormatPipe } from '../../../../../Components/common/Pipes/getLevels-pipe'
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { MoiPaymentsService } from '../moi-payments.service'
import { Subscription } from 'rxjs'
import { MOI_REFUNDS_FORMS_FIELDS_CONFIGS } from '../../../../Payments/MOI/Refund/moi-refund.form-fields-configs'
import { StorageService } from '../../../../../../core/storage/storage.service'
import { ModelPipe } from '../../../../../Components/common/Pipes/model-pipe'

@Component({
  selector: 'app-moi-refund-pa-confirmation-table',
  templateUrl: './moi-refund-pa-confirmation-table.component.html',
})
export class MoiRefundPaConfirmationTableComponent
  extends DataTableWraperComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() showCitizenId = false
  @ViewChild('table', { static: true }) table: DatatableComponent
  selectAllOnPage: any = []
  tableSelectedRows: any = []
  refundsSelectedSubscription: Subscription

  MOI_REFUNDS_FORMS_FIELDS_CONFIGS: any = MOI_REFUNDS_FORMS_FIELDS_CONFIGS

  constructor(
    public translate: TranslateService,
    private levelsPipe: LevelFormatPipe,
    public service: MoiPaymentsService,
    private storage: StorageService,
    public injector: Injector,
  ) {
    super()
  }

  ngOnDestroy() {
    this.refundsSelectedSubscription.unsubscribe()
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.refundsSelectedSubscription = this.service.refundsSelected.subscribe(
      (selected) => {
        if (selected.length == 0) {
          this.selectAllOnPage = []
        }
      },
    )
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

  private getCitizenIdFromDetails(details: any[]) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < details.length; i++) {
      if (
        details[i].labelKey.endsWith('citizenId') ||
        details[i].labelKey.endsWith('sponsorId') ||
        details[i].labelKey.endsWith('iqamaId') ||
        details[i].labelKey.endsWith('nationalIdNumber') ||
        details[i].labelKey.endsWith('violatorId') ||
        details[i].labelKey.endsWith('borderNumber') ||
        details[i].labelKey.endsWith('householdIdNumber') ||
        details[i].labelKey.endsWith('currentOwnerId') ||
        details[i].labelKey.endsWith('newOwnerId')
      ) {
        return details[i].value
      }
    }
    return null
  }

  onCustomInnerSelect({ selected }) {
    // console.log('Inner select',event);
    this.selectAllOnPage[this.table.offset] = false
    this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
    this.tableSelectedRows.push(...selected)
    this.service.setRefundsSelected(this.tableSelectedRows)
  }

  selectAll(event) {
    if (!this.selectAllOnPage[this.table.offset]) {
      // Unselect all so we dont get duplicates.
      if (this.tableSelectedRows.length > 0) {
        this.items.map((bill) => {
          this.tableSelectedRows = this.tableSelectedRows.filter(
            (selected) => this.getId(selected) !== this.getId(bill),
          )
        })
      }
      // Select all again
      this.tableSelectedRows.push(...this.items)
      this.selectAllOnPage[this.table.offset] = true
    } else {
      // Unselect all
      this.items.map((bill) => {
        this.tableSelectedRows = this.tableSelectedRows.filter(
          (selected) => this.getId(selected) !== this.getId(bill),
        )
      })
      this.selectAllOnPage[this.table.offset] = false
    }
    if (this.externalPagination) {
      this.onSelect.emit(this.tableSelectedRows)
    }
    this.service.setRefundsSelected(this.tableSelectedRows)
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
      this.MOI_REFUNDS_FORMS_FIELDS_CONFIGS[values.serviceType] &&
      this.MOI_REFUNDS_FORMS_FIELDS_CONFIGS[values.serviceType]
        .applicationsTypes[values.applicationType]
        ? this.MOI_REFUNDS_FORMS_FIELDS_CONFIGS[values.serviceType]
            .applicationsTypes[values.applicationType].fieldsConfigs
        : null

    if (!fieldsConfigs) {
      const servicesIDs = Object.keys(this.MOI_REFUNDS_FORMS_FIELDS_CONFIGS)
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < servicesIDs.length; i++) {
        const serviceDef = this.MOI_REFUNDS_FORMS_FIELDS_CONFIGS[servicesIDs[i]]
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
