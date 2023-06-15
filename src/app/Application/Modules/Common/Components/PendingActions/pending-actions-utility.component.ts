import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { SecuredAuthentication } from '../../../../Components/secured-authentication/secured-authentication.component'
import { StaticService } from '../../Services/static.service'
import { AbstractWizardComponent } from '../Abstract/abstract-wizard.component'
import { PendingActionsUtilityService } from './pending-actions-utility.service'
import { PendingActionsUtilityStep1Component } from './Steps/Step1/pending-actions-utility-step1.component'
import { PendingActionsUtilityStep2Component } from './Steps/Step2/pending-actions-utility-step2.component'
import { PendingActionsUtilityStep3Component } from './Steps/Step3/pending-actions-utility-step3.component'
import { StorageService } from '../../../../../core/storage/storage.service'
import { PendingActionsUtilityStep0Component } from './Steps/Step0/pending-actions-utility-step0.component'

@Component({
  selector: 'app-pending-actions-utility',
  templateUrl: './pending-actions-utility.component.html',
  styleUrls: ['./pending-actions-utility.component.scss'],
})
export class PendingActionsUtilityComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy {
  @ViewChild(PendingActionsUtilityStep0Component)
  step0: PendingActionsUtilityStep0Component
  @ViewChild(PendingActionsUtilityStep1Component)
  step1: PendingActionsUtilityStep1Component
  @ViewChild(PendingActionsUtilityStep2Component)
  step2: PendingActionsUtilityStep2Component
  @ViewChild(PendingActionsUtilityStep3Component)
  step3: PendingActionsUtilityStep3Component

  @Input() service: PendingActionsUtilityService

  @Input() fieldsConfigForSearchForm: any[]

  @Input() fieldsConfigForList: any[]

  @Input() translate_prefix = 'pendingActions'

  @Input() custom_fields_templates: any = {}

  @Input() custom_steps_templates: any = {}

  @Input() step0_table_externalPaging = true
  @Input() step0_table_externalSorting = true

  @Input() combosKeys: any[] = []
  @Input() combosData: any = {}

  @Input() hasSearchFilters = true

  @Input() search_form_collapsed: any = false

  @Input() table_allow_link_to_detail: any = true

  @Output() onSelectPendingActions = new EventEmitter<any>()
  @Output() onClickPendingAction = new EventEmitter<any>()
  @Output()
  onAllSearchFieldsCreated: EventEmitter<any> = new EventEmitter<any>()
  @Output()
  onInitSearchFormFieldsUtility: EventEmitter<any> = new EventEmitter<any>()

  @ViewChild(SecuredAuthentication)
  authorization: SecuredAuthentication

  generateChallengeAndOTP: any = null
  requestValidate: any = {}

  public operation: any

  public pendingActionsShowDetails = false
  public pendingActionsShowDetailsData: any = {}
  public pendingActionsSelected: any[] = []
  public pendingActionsSelectedFormModels: FormGroup[] = []
  public pendingActionsSelectedFormConfigs: any[] = []

  rejectedReason: string

  userTemp: any = null

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public translate: TranslateService,
    public router: Router,
    public storage: StorageService,
  ) {
    super(fb, translate, router)
    this.wizardStep = 0
    //this.combosKeys = [];
    //this.combosData = {};
    this.operation = null
    this.pendingActionsShowDetails = false
    this.pendingActionsSelected = []
    this.pendingActionsSelectedFormModels = []
    this.pendingActionsSelectedFormConfigs = []
    this.rejectedReason = ''
    this.generateChallengeAndOTP = null
    this.requestValidate = {}
  }

  ngOnInit() {
    super.ngOnInit()

    const storageVal = this.storage.retrieve('currentuser')
    if (!storageVal) {
      return
    }
    this.userTemp = JSON.parse(storageVal)

    this.wizardStep = 0
    this.operation = null
    this.pendingActionsShowDetails = false
    this.pendingActionsSelected = []
    this.generateChallengeAndOTP = null
    this.requestValidate = {}

    this.resetAndPrepareFormModels()
  }

  refreshData() {
    super.refreshData()
    const combosKeysAll = ['process', 'processStatus']
      .concat(this.combosKeys)
      .concat(this.service.getCombosKeys())
    this.subscriptions.push(
      this.staticService
        .getAllCombosAsArrays(combosKeysAll)
        .subscribe((resultC) => {
          if (resultC === null) {
            this.onError(resultC)
          } else {
            const data = resultC
            combosKeysAll.forEach((comboKey) => {
              this.combosData[comboKey] = data[comboKey]
            })
            this.service.setCombosData(this.combosData)
            this.resetFixedDataFormModels()
          }
        }),
    )
  }

  onInitStep(step, events) {
    switch (step) {
      case 0:
        this.step0 = events
        break
      case 1:
        this.step1 = events
        break
      case 2:
        this.step2 = events
        break
      case 3:
        this.step3 = events
        break
    }
  }

  getWizardStepsCount() {
    return 3
  }

  isPreviousAllowed() {
    return this.wizardStep > 0 && this.wizardStep < this.wizardStepsCount
  }

  isNextAllowed() {
    return this.wizardStep > 1 && this.wizardStep < this.wizardStepsCount
  }

  isRefuseAllowed() {
    return (
      (this.operation == null ||
        this.operation == this.service.refuseOperation) &&
      this.service.isRefuseAllowed()
    )
  }

  isApproveAllowed() {
    return (
      (this.operation == null ||
        this.operation == this.service.aproveOperation) &&
      this.service.isApproveAllowed()
    )
  }

  isDeleteAllowed() {
    return (
      (this.operation == null ||
        this.operation == this.service.deleteOperation) &&
      this.service.isDeleteAllowed()
    )
  }

  isReInitateAllowed() {
    return (
      (this.operation == null ||
        this.operation == this.service.reInitiateOperation) &&
      this.service.isReInitiateAllowed()
    )
  }

  isRefuseDisabled() {
    return this.isDisabled()
  }

  isApproveDisabled() {
    return this.isDisabled()
  }

  isDeleteDisabled() {
    if (this.pendingActionsSelected.length == 0) {
      return true
    }
    let disabled = false
    this.pendingActionsSelected.forEach((selected, i) => {
      if (
        !this.service.canDeleteRow(
          selected,
          this.userTemp ? this.userTemp.user.userId : null,
        )
      ) {
        disabled = true
      } else if (
        this.isEditableOperation() &&
        this.pendingActionsSelectedFormModels[i].enabled &&
        !this.pendingActionsSelectedFormModels[i].valid
      ) {
        disabled = true
      }
    })
    return disabled
  }

  isReInitiateDisabled() {
    if (this.pendingActionsSelected.length == 0) {
      return true
    }
    let disabled = false
    this.pendingActionsSelected.forEach((selected, i) => {
      if (
        !this.service.canReInitiateRow(
          selected,
          this.userTemp ? this.userTemp.user.userId : null,
        )
      ) {
        disabled = true
      } else if (
        this.isEditableOperation() &&
        this.pendingActionsSelectedFormModels[i].enabled &&
        !this.pendingActionsSelectedFormModels[i].valid
      ) {
        disabled = true
      }
    })
    return disabled
  }

  isNextDisabled() {
    return this.isDisabled()
  }

  everyTypeMU(): boolean {
    let everyTypeMU: boolean = false;
    if (this.operation === this.service.refuseOperation) {
      everyTypeMU = this.pendingActionsSelected.every(pendingAction => pendingAction.type === 'MU');
    }
    return everyTypeMU;
  }

  isDisabled() {
    let enabled = false
    switch (this.wizardStep) {
      case 0:
        enabled =
          this.pendingActionsSelected.length > 0 && !this.service.isDisabled()
        break
      case 1:
        enabled =
          this.pendingActionsSelected.length > 0 && !this.service.isDisabled()
        break
      case 2:
        enabled = this.valid()
        if (this.wizardStep === 2) {
          if (this.generateChallengeAndOTP === null) {
            enabled = true
          } else {
            enabled = this.authorization ? this.authorization.valid() : true
          }
        }
        break
      default:
        break
    }
    return !enabled
  }

  back() {
    if (this.wizardStep > 1) {
      this.wizardStep = 1
    } else if (this.wizardStep == 1) {
      this.wizardStep = 0
      this.refreshData()
    }
  }

  previous() {
    this.generateChallengeAndOTP = null
    this.requestValidate = {}
    if (this.wizardStep > 1) {
      this.wizardStep = 1
    } else if (this.wizardStep == 1) {
      this.operation = null
      this.wizardStep = 0
      this.refreshData()
      this.closeDetailOfSelectedItems()
    }
  }

  next() {
    switch (this.wizardStep) {
      case 1:
        this.generateChallengeAndOTP = null
        this.requestValidate = {}
        this.rejectedReason = ''
        this.subscriptions.push(
          this.service
            .validateOperation({
              operation: this.operation,
              items: this.pendingActionsSelected,
            })
            .subscribe((result) => {
              if (result['errorCode'] != '0') {
                this.onError(result)
              } else {
                this.validationResponse = result
                this.generateChallengeAndOTP = result['generateChallengeAndOTP']
                this.markNextWizardStep()
              }
            }),
        )
        break
      case 2:
        this.subscriptions.push(
          this.service
            .confirmOperation({
              operation: this.operation,
              items: this.pendingActionsSelected,
              models: this.pendingActionsSelectedFormModels,
              validationData: this.validationResponse,
              requestValidate: this.requestValidate,
              rejectedReason: this.rejectedReason,
            })
            .subscribe((result) => {
              if (result['errorCode'] != '0') {
                this.onError(result)
              } else {
                this.confirmResponse = result
                this.markNextWizardStep()
              }
            }),
        )
        break
      case 3:
        this.finish()
        break
    }
  }

  valid() {
    if (
      this.operation == this.service.refuseOperation &&
      this.service.showRejectReason()
    ) {
      return true //this.rejectedReason.length > 0;
    }
    return true
  }

  finish() {
    //super.finish();
    //this.service.clearData();
    this.wizardStep = 0
    this.refreshData()
    this.operation = null
    this.closeDetailOfSelectedItems();
  }

  //------------------

  aprove() {
    this.operation = this.service.aproveOperation
    this.pendingActionsShowDetails = false
    this.onClickPendingAction.emit({
      operation: this.operation,
      items: this.pendingActionsSelected,
      models: this.pendingActionsSelectedFormModels,
    })
    if (this.wizardStep == 0) {
      this.wizardStep = 1
    } else if (this.wizardStep == 1) {
      this.next()
    }
  }

  refuse() {
    this.operation = this.service.refuseOperation
    this.pendingActionsShowDetails = false
    this.onClickPendingAction.emit({
      operation: this.operation,
      items: this.pendingActionsSelected,
      models: this.pendingActionsSelectedFormModels,
    })
    if (this.wizardStep == 0) {
      this.wizardStep = 1
    } else if (this.wizardStep == 1) {
      this.next()
    }
  }

  delete() {
    this.operation = this.service.deleteOperation
    this.pendingActionsShowDetails = false
    this.onClickPendingAction.emit({
      operation: this.operation,
      items: this.pendingActionsSelected,
      models: this.pendingActionsSelectedFormModels,
    })
    if (this.wizardStep == 0) {
      this.wizardStep = 1
    } else if (this.wizardStep == 1) {
      this.next()
    }
  }

  reInitiate() {
    this.operation = this.service.reInitiateOperation
    this.pendingActionsShowDetails = false
    this.onClickPendingAction.emit({
      operation: this.operation,
      items: this.pendingActionsSelected,
      models: this.pendingActionsSelectedFormModels,
    })
    if (this.wizardStep == 0) {
      this.wizardStep = 1
    } else if (this.wizardStep == 1) {
      this.next()
    }
  }

  resetAndPrepareFormModels() {
    this.pendingActionsSelectedFormModels = []
    this.pendingActionsSelectedFormConfigs = []
    this.pendingActionsSelected.forEach((item) => {
      this.pendingActionsSelectedFormModels.push(this.fb.group({}))
      this.pendingActionsSelectedFormConfigs.push(
        this.service.getFormConfigsForSelectedItem(item, this.operation),
      )
    })
  }

  resetFixedDataFormModels() {
    const fixedFields = this.service.getTableFixedFieldsNames()
    this.pendingActionsSelected.forEach((item, i) => {
      this.service.reCalculateFixedFieldValue(item)
      if (
        this.pendingActionsSelectedFormModels &&
        this.pendingActionsSelectedFormModels[i]
      ) {
        fixedFields.forEach((fieldName) => {
          if (this.pendingActionsSelectedFormModels[i].get('_' + fieldName)) {
            this.pendingActionsSelectedFormModels[i]
              .get('_' + fieldName)
              .setValue(item['_' + fieldName])
          }
        })
      }
      if (
        this.pendingActionsSelectedFormConfigs &&
        this.pendingActionsSelectedFormConfigs[i]
      ) {
        const itemFormConfigs = this.service.getFormConfigsForSelectedItem(
          item,
          this.operation,
        )
        itemFormConfigs.forEach((config) => {
          if (this.pendingActionsSelectedFormModels[i].get(config.key)) {
            config.default = this.pendingActionsSelectedFormModels[i].get(
              config.key,
            ).value
          }
        })
        this.pendingActionsSelectedFormConfigs[i] = itemFormConfigs
      }
    })
  }

  closeDetailOfSelectedItems() {
    this.pendingActionsSelected = []
    this.resetAndPrepareFormModels()
    this.pendingActionsShowDetails = false
  }

  onSelect(selected) {
    this.pendingActionsSelected = selected
      ? selected
      : this.step0 && this.step0.tableSelectedRows
        ? this.step0.tableSelectedRows
        : []
    this.resetAndPrepareFormModels()
    this.onSelectPendingActions.emit(selected)
  }

  onClickItem(row) {
    this.onSelect([row])
    this.service.details(row).subscribe((result) => {
      this.pendingActionsShowDetailsData = result
      this.pendingActionsShowDetails = true
    })
  }

  showRejectReason() {
    if (
      this.wizardStep == 2 &&
      this.operation == this.service.refuseOperation &&
      this.service.showRejectReason()
    ) {
      return true
    } else {
      return false
    }
  }

  showStepWizard() {
    return this.service.showStepWizard()
  }

  getCurrentOperationLabel() {
    if (this.wizardStep == 2) {
      return 'public.proceed'
    }
    switch (this.operation) {
      case this.service.aproveOperation:
        return 'public.approve'
      case this.service.refuseOperation:
        return 'public.reject'
      case this.service.deleteOperation:
        return 'public.delete'
      case this.service.reInitiateOperation:
        return 'public.reInitiate'
      default:
        return 'public.proceed'
    }
  }

  isEditableOperation() {
    return this.service.isEditableOperation(this.operation)
  }

  getStepsDescriptions() {
    if (this.operation) {
      return [
        this.getCurrentOperationLabel(),
        'public.confirm',
        'public.summary',
      ]
    }
    return ['public.completeDetails', 'public.confirm', 'public.summary']
  }

  isPendingAction() {
    return this.service.isPendingAction(this.operation)
  }

  allSearchFieldsCreated($event) {
    this.onAllSearchFieldsCreated.emit($event)
  }

  initSearchFieldsUtility($event) {
    this.onInitSearchFormFieldsUtility.emit($event)
  }
}
