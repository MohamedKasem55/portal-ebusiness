import { DatePipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Injectable, Injector } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { isEmpty } from 'lodash'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { TreeViewConfiguratorUtilityService } from '../../../../Common/Components/TreeView/Configurator/tree-view-configurator-utility.service'
import { TreeViewUtilityComponentActions } from '../../../../Common/Components/TreeView/tree-view-utility.service'

@Injectable()
export class CashManagementSweepingDetailService extends TreeViewConfiguratorUtilityService {
  structure: any = null

  constructor(
    protected http: HttpClient,
    public translate: TranslateService,
    public config: ConfigResourceService,
    public injector: Injector,
  ) {
    super(http, config)
  }

  //--------------------------------------------------------------------

  public initStructure(values: any): Observable<any> {
    if (!this.structure || !this.structure.structureId) {
      return this.createNewStructureRequest(values).pipe(
        map((response: any) => {
          const result = this.getOutputFromNewStructureResponse(response)
          return result
        }),
        catchError(this.handleError),
      )
    } else {
      return this.createLoadStructureRequest(values).pipe(
        map((response: any) => {
          const result = this.getOutputFromLoadStructureResponse(response)
          return result
        }),
        catchError(this.handleError),
      )
    }
  }

  protected createLoadStructureRequest(values: any): Observable<any> {
    const data = {
      structureId: this.structure.structureId,
    }

    return this.http.post(this.servicesUrl + '/sweeping/structure', data)
  }

  protected getOutputFromLoadStructureResponse(response: any) {
    const liquidityAccList = response.liquidityAccList

    const nodeList = response.nodeList

    const configuredNodeList = {}

    nodeList.forEach((node) => {
      configuredNodeList[node['nodeAccount']['liquidityAccountNumber']] = true
    })

    liquidityAccList.forEach((item) => {
      if (
        typeof configuredNodeList[item['liquidityAccountNumber']] == 'undefined'
      ) {
        nodeList.push(this.createNodeItem(item))
        configuredNodeList[item['liquidityAccountNumber']] = false
      }
    })

    this.emitChangedItems(nodeList)

    return response
  }

  protected createNewStructureRequest(values: any): Observable<any> {
    const data: any = {}

    return this.http.get(this.servicesUrl + '/sweeping/accounts', {
      params: data,
    })
  }

  protected getOutputFromNewStructureResponse(response: any) {
    const liquidityAccList = response.liquidityAccList

    const nodeList = []

    liquidityAccList.forEach((item) => {
      nodeList.push(this.createNodeItem(item))
    })

    this.emitChangedItems(nodeList)

    return response
  }

  //--------------------------------------------------------------------

  public removeStructure(values: any): Observable<any> {
    return this.createRemoveStructureRequest(values).pipe(
      map((response: any) => {
        this.setStructure(null)
        return response
      }),
      catchError(this.handleError),
    )
  }

  protected createRemoveStructureRequest(values: any): Observable<any> {
    if (!values.structureId) {
      return of({ errorCode: '0' })
    }

    const data = {
      structureId: this.structure.structureId,
    }

    return this.http.post(this.servicesUrl + '/sweeping/delete', data)
  }

  //--------------------------------------------------------------------

  public validateStructure(values: any): Observable<any> {
    return this.createValidateStructureRequest(values).pipe(
      map((response: any) => {
        return response
      }),
      catchError(this.handleError),
    )
  }

  protected createValidateStructureRequest(values: any): Observable<any> {
    let structureId = null

    if (
      values.structureId !== '' &&
      values.structureId !== null &&
      values.structureId !== undefined
    ) {
      structureId = values.structureId
    } else {
      values.nodeList
        .filter(
          (item) =>
            this.getParentItemId(item) == null ||
            this.getParentItemId(item) == this.getRootId(),
        )
        .forEach((item) => {
          item.structureStatus = 'new'
          structureId = item.structureDescription
        })
    }
    const data = {
      structureId,
      nodeList: values.nodeList,
    }

    return this.http.post(this.servicesUrl + '/sweeping/validate', data)
  }

  //--------------------------------------------------------------------

  public saveStructure(values: any): Observable<any> {
    return this.createSaveStructureRequest(values).pipe(
      map((response: any) => {
        return response
      }),
      catchError(this.handleError),
    )
  }

  protected createSaveStructureRequest(values: any): Observable<any> {
    let structureId = null

    if (
      values.structureId !== '' &&
      values.structureId !== null &&
      values.structureId !== undefined
    ) {
      structureId = values.structureId
    } else {
      values.nodeList
        .filter(
          (item) =>
            this.getParentItemId(item) == null ||
            this.getParentItemId(item) == this.getRootId(),
        )
        .forEach((item) => {
          item.structureStatus = 'new'
          structureId = item.structureDescription
        })
    }
    const data = {
      structureId,
      nodeList: values.nodeList,
    }

    return this.http.post(this.servicesUrl + '/sweeping/save', data)
  }

  //--------------------------------------------------------------------

  public setStructure(structure: any) {
    this.structure = structure
    this.emitChangedItems([])
  }

  public getSelectedStructure() {
    return this.structure
  }

  public createNodeItem(accountItem = null) {
    return {
      SweepingAccTier1: null,
      SweepingAccTier2: null,
      dailySweepOption: null,
      intradayHour: null,
      level: null,
      nodeAccount: accountItem,
      nodePosition: null,
      parentAccount: null,
      poolAccountHierarchyInternalId: null,
      poolPriority: null,
      poolStatus: null,
      priority: null,
      processingPlanDescription: null,
      processingPlanInternalId: null,
      reverseSweepingAllowed: null,
      standardSweepingAllowed: null,
      structureDescription: null,
      structureStatus: null,
      sweepBalanceTrigger: null,
      sweepDay: null,
      sweepFinishDate: null,
      sweepFixedAmount: null,
      sweepFrequency: null,
      sweepLastReturnCode: null,
      sweepMaxBalance: null,
      sweepMinBalance: null,
      sweepNextDate: null,
      sweepPercentage: null,
      sweepStartDate: null,
      sweepTargetBalance: null,
      sweepType: null,
      sweepZeroBalance: null,
      sweepingAccTier1: null,
      sweepingAccTier2: null,
      virtualAccount: null,
    }
  }

  //--------------------------------------------------------------------

  public getTranslationPrefix() {
    return 'dashboard.cashManagement.sweeping'
  }

  public getItemId(item) {
    return item['nodeAccount']
      ? item['nodeAccount']['liquidityAccountNumber']
      : ''
  }

  public getItemNodeTitle(item) {
    let title = item['nodeAccount']
      ? item['nodeAccount']['liquidityAccountNumber']
      : ''
    if (
      item['reverseSweepingAllowed'] &&
      this.getParentItemId(item) != this.getRootId() &&
      this.getParentItemId(item) != null &&
      this.getParentItemId(item) != undefined
    ) {
      const comboData = this.getExtraCombosData()
      title +=
        '<br/>' +
        '(Reverse) priority:' +
        comboData['priorityList'][item['priority'] ? item['priority'] : 0].value
    }
    return title
  }

  public getItemEditFormTitle(item) {
    let title = item['nodeAccount']
      ? item['nodeAccount']['liquidityAccountNumber'] +
        (!isEmpty(item['nodeAccount']['subCICNumber'])
          ? ' SubCIC: ' + item['nodeAccount']['subCICNumber']
          : '') +
        (item['nodeAccount']['availableBalance']
          ? ' -' +
            item['nodeAccount']['availableBalance'] +
            ' ' +
            this.getCurrencyText(item['nodeAccount']['currency'])
          : '')
      : '' // + " (" + item['nodeAccount']['accountType'] + ")" : '';

    if (item['nodeAccount']['accountType'] == 'Internal') {
      if (
        item['nodeAccount']['alias'] != null &&
        item['nodeAccount']['alias'] != ''
      ) {
        title = title + ' - ' + item['nodeAccount']['alias'] // TODO alias?
      }
      if (
        item['nodeAccount']['sweepTargetBalance'] != null &&
        item['nodeAccount']['sweepTargetBalance'] != undefined
      ) {
        title = title + ' - ' + item['nodeAccount']['sweepTargetBalance'] // TODO sweepTargetBalance?
        if (
          item['nodeAccount']['currency'] != null &&
          item['nodeAccount']['currency'] != undefined
        ) {
          title =
            title +
            ' ' +
            this.getCurrencyIsoCode(item['nodeAccount']['currency'])
        }
      } else if (
        item['nodeAccount']['availableBalance'] != null &&
        item['nodeAccount']['availableBalance'] != undefined
      ) {
        title = title + ' - ' + item['nodeAccount']['availableBalance'] // TODO sweepTargetBalance?
        if (
          item['nodeAccount']['currency'] != null &&
          item['nodeAccount']['currency'] != undefined
        ) {
          title =
            title +
            ' ' +
            this.getCurrencyIsoCode(item['nodeAccount']['currency'])
        }
      }
    } else if (item['nodeAccount']['accountType'] == 'SubCIC') {
      title = title + ' - Sub CIC: ' + item['nodeAccount']['subCICNumber'] // TODO subCICNumber?
      if (
        item['nodeAccount']['currency'] != null &&
        item['nodeAccount']['currency'] != undefined
      ) {
        title =
          title + ' ' + this.getCurrencyIsoCode(item['nodeAccount']['currency'])
      }
    } else if (item['nodeAccount']['accountType'] == 'External') {
      title = title + ' - '
      if (
        item['nodeAccount']['bankBusinessIdentifierCode'] != null &&
        item['nodeAccount']['bankBusinessIdentifierCode'] != ''
      ) {
        title =
          title + item['nodeAccount']['bankBusinessIdentifierCode'] + ' - ' // TODO bankBusinessIdentifierCode
      }
      title = title + item['nodeAccount']['bankName'] // TODO bankName
      if (
        item['nodeAccount']['currency'] != null &&
        item['nodeAccount']['currency'] != undefined
      ) {
        title =
          title + ' ' + this.getCurrencyIsoCode(item['nodeAccount']['currency'])
      }
    }
    return title
  }

  public getParentItemId(item) {
    return item['parentAccount'] != null &&
      item['parentAccount']['liquidityAccountNumber'] != this.getRootId()
      ? item['parentAccount']['liquidityAccountNumber']
      : null
  }

  public isItemBelongsToTree(item: any) {
    return item['parentAccount'] != null
  }

  public canAppendItemAsChild(parent, item) {
    if (parent == null) {
      return item['nodeAccount']['accountType'] == 'Internal'
    }
    if (parent['nodeAccount']['accountType'] == 'External') {
      if (item['nodeAccount']['accountType'] != 'External') {
        return false
      } else if (parent['nodeAccount']['currency'] == 608) {
        //CashManagementConstants.CURRENCY_SAUDI
        return true
      } else if (
        parent['nodeAccount']['currency'] == item['nodeAccount']['currency']
      ) {
        return true
      }
      return false
    } else {
      if (parent['nodeAccount']['currency'] == 608) {
        //CashManagementConstants.CURRENCY_SAUDI
        return true
      } else if (
        parent['nodeAccount']['currency'] == item['nodeAccount']['currency']
      ) {
        return true
      }
      return false
    }
    return false
  }

  public setParentItem(item, parent) {
    item['parentAccount'] = {
      SweepingAccTier1: null,
      SweepingAccTier2: null,
      dailySweepOption: null,
      intradayHour: null,
      level: null,
      liquidityAccountNumber:
        parent != null
          ? parent['nodeAccount']['liquidityAccountNumber']
          : this.getRootId(),
      accountNumber:
        parent != null
          ? parent['nodeAccount']['accountNumber']
          : this.getRootId(),
      nodePosition: null,
      parentAccount: null,
      poolAccountHierarchyInternalId: null,
      poolPriority: null,
      poolStatus: null,
      priority: null,
      processingPlanDescription: null,
      processingPlanInternalId: null,
      reverseSweepingAllowed: null,
      standardSweepingAllowed: null,
      structureDescription: null,
      structureStatus: null,
      sweepBalanceTrigger: null,
      sweepDay: null,
      sweepFinishDate: null,
      sweepFixedAmount: null,
      sweepFrequency: null,
      sweepLastReturnCode: null,
      sweepMaxBalance: null,
      sweepMinBalance: null,
      sweepNextDate: null,
      sweepPercentage: null,
      sweepStartDate: null,
      sweepTargetBalance: null,
      sweepType: null,
      sweepZeroBalance: null,
      sweepingAccTier1: null,
      sweepingAccTier2: null,
      virtualAccount: null,
    }
  }

  protected setItemBelongsToTree(item: any, belong: boolean) {
    if (belong) {
      if (item['parentAccount'] == null) {
        this.setParentItem(item, null)
      }
    } else {
      item['parentAccount'] = null
    }
  }

  protected setItemValues(
    action = TreeViewUtilityComponentActions.CONFIGURE_ITEM,
    item,
    values,
  ) {
    item = Object.assign(item, values)
    if (values.reverseSweepingAllowed === null) {
      item.standardSweepingAllowed = null
    } else if (
      item.standardSweepingAllowed === true ||
      item.standardSweepingAllowed === false
    ) {
      item.standardSweepingAllowed = !values.reverseSweepingAllowed
    }
    if (item['nodeAccount']['accountType'] == 'External') {
      item['reverseSweepingAllowed'] = false
      item['priority'] = null
    }
    //item['nodeAccount']['currency'] = values['currency'] ? values['currency'] : item['nodeAccount']['currency'];
    if (item['sweepStartDate']) {
      try {
        if (
          typeof item['sweepStartDate'] == 'string' &&
          item['sweepStartDate'].indexOf('/') !== -1
        ) {
          const sweepStartDateParts = (item['sweepStartDate'] + '//').split('/')
          item['sweepStartDate'] =
            sweepStartDateParts[2] +
            '-' +
            sweepStartDateParts[1] +
            '-' +
            sweepStartDateParts[0]
        } else {
          item['sweepStartDate'] = this.injector
            .get(DatePipe)
            .transform(item['sweepStartDate'], 'yyyy-MM-dd')
        }
      } catch (e) {
        item['sweepStartDate'] = ''
      }
    }
  }

  public compare(a, b) {
    // a debe ser menor que b
    if (
      a['nodeAccount']['liquidityAccountNumber'] <
      b['nodeAccount']['liquidityAccountNumber']
    ) {
      return -1
    }
    // a debe ser mayor que b
    if (
      a['nodeAccount']['liquidityAccountNumber'] >
      b['nodeAccount']['liquidityAccountNumber']
    ) {
      return 1
    }
    // a debe ser igual b
    return 0
  }

  //--------------------------------------------------------------------

  public getExtraCombosKeys() {
    return [
      'currency',
      'currencyIso',
      'sweepingDailyInstructions',
      'CMSweepingDay',
      'CMSweepingFrequency'
    ]
  }

  public getExtraCombosData() {
    const combosData = []

    combosData['priorityList'] = [
      {
        key: 0,
        value: 'Default',
      },
      {
        key: 1,
        value: '1st',
      },
      {
        key: 2,
        value: '2nd',
      },
      {
        key: 3,
        value: '3rd',
      },
    ]

    for (let i = 4; i <= this._items.length; i++) {
      combosData['priorityList'].push({
        key: i,
        value: '' + i + 'th',
      })
    }

    for (let i = 1; i <= this._items.length; i++) {
      combosData['priority' + i + 'List'] = combosData['priorityList'].slice(
        0,
        i + 1,
      )
    }

    combosData['sweepDayMonthList'] = []

    for (let i = 1; i <= 31; i++) {
      combosData['sweepDayMonthList'].push({
        key: i,
        value: i,
      })
    }

    return combosData
  }

  //-------------------------------------------------------------------

  public getExtraActionFormConfig(
    action = TreeViewUtilityComponentActions.VIEW_ITEM_DETAIL,
    parents = [],
    children = [],
    parent_id = null,
    child_id = null,
    rootItems = [],
    elementsEnabled = true,
  ) {
    if (parents.length == 0 && parent_id == null) {
      return this.getExtraRootNodeActionFormConfig(
        action,
        parents,
        children,
        parent_id,
        child_id,
        rootItems,
        elementsEnabled,
      )
    } else {
      return this.getExtraChildNodeActionFormConfig(
        action,
        parents,
        children,
        parent_id,
        child_id,
        rootItems,
        elementsEnabled,
      )
    }
  }

  public getExtraRootNodeActionFormConfig(
    action = TreeViewUtilityComponentActions.VIEW_ITEM_DETAIL,
    parents = [],
    children = [],
    parent_id = null,
    child_id = null,
    rootItems = [],
    elementsEnabled = true,
  ) {
    let child = null

    if (child_id != null) {
      children
        .filter((item) => this.getItemId(item) == child_id)
        .forEach((item) => {
          child = item
        })
    }

    const config = []

    config.push({
      key: '__title',
      title: '__title',
      translate: '',
      type: 'custom-code',
      required: false,
      default: '',
      disabled: !elementsEnabled,
      validators: [],
      widget:
        '<div class="col-xs-12">' +
        '<div class="form-group">' +
        '<span class="form-control"><b>' +
        this.translate.instant(
          this.getTranslationPrefix() + '.ProcessingPlan',
        ) +
        '</b></span>' +
        '</div>' +
        '</div>',
      widget_container_class: 'col-xs-12 col-sm-6',
      widget_container_init_row: true,
      widget_container_end_row: false,
    })
    config.push({
      key: 'structureDescription',
      title: 'structureDescription',
      translate: 'structureDescription',
      type: 'text',
      required: true,
      default: child != null ? child['structureDescription'] : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: true,
      widget_container_end_row: false,
    })
    config.push({
      key: 'sweepStartDate',
      title: 'sweepStartDate',
      translate: 'sweepStartDate',
      type: 'date',
      required: true,
      default: child != null ? new Date(child['sweepStartDate']) : '',
      //default: child != null ? child['sweepStartDate'] : "",
      disabled: !elementsEnabled,
      widget: 'datepicker',
      //widget: "date",
      widget_datepicker_min_date: false,
      widget_datepicker_max_date: false,
      widget_container_class: 'col-xs-6 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })
    config.push({
      key: 'sweepFrequency',
      title: 'sweepFrequency',
      translate: 'sweepFrequency',
      type: 'radioGroup',
      required: true,
      default: child != null ? child['sweepFrequency'] : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-6 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      widget_options_in_separated_lines: false,
      select_combo_key: 'CMSweepingFrequency',
      translate_rendered_text: true,
      mask_fields_to_show: {
        '': [],
        '51': [],
        '52': ['sweepDay'],
        '53': ['sweepDayMonth'],
      },
    })
    config.push({
      key: 'sweepDay',
      title: 'sweepDay',
      translate: 'sweepDay',
      type: 'select',
      required: true,
      default: child != null ? child['sweepDay'] : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-6 col-sm-2',
      widget_container_init_row: false,
      widget_container_end_row: false,
      select_combo_key: 'CMSweepingDay',
    })
    config.push({
      key: 'sweepDayMonth',
      title: 'sweepDayMonth',
      translate: 'sweepDayMonth',
      type: 'select',
      required: true,
      default: child != null ? child['sweepDay'] : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-6 col-sm-2',
      widget_container_init_row: false,
      widget_container_end_row: false,
      select_combo_key: 'sweepDayMonthList',
    })
    config.push({
      key: 'dailySweepOption',
      title: 'dailySweepOption',
      translate: 'dailySweepOption',
      type: 'select',
      required: true,
      default: child != null ? child['dailySweepOption'] : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-6 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      select_combo_key: 'sweepingDailyInstructions',
      mask_fields_to_show: {
        '': [],
        '1': [],
        '2': [],
        '3': ['intradayHour'],
      },
    })
    config.push({
      key: 'intradayHour',
      title: 'intradayHour',
      translate: 'intradayHour',
      type: 'select',
      required: true,
      default: child != null ? child['intradayHour'] : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-6 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      select_combo_key: 'sweepingIntradayOptions',
    })

    return config
  }

  public getExtraChildNodeActionFormConfig(
    action = TreeViewUtilityComponentActions.VIEW_ITEM_DETAIL,
    parents = [],
    children = [],
    parent_id = null,
    child_id = null,
    rootItems = [],
    elementsEnabled = true,
  ) {
    const rootItem = rootItems.length > 0 ? rootItems[0] : null

    let child = null

    if (child_id != null) {
      children
        .filter((item) => this.getItemId(item) == child_id)
        .forEach((item) => {
          child = item
        })
    }

    const config = []

    config.push({
      key: 'reverseSweepingAllowed',
      title: 'reverseSweepingAllowed',
      translate: 'reverseSweepingAllowed',
      type: 'checkbox',
      required: false,
      default:
        child != null
          ? child['nodeAccount']['accountType'] == 'External'
            ? false
            : child['reverseSweepingAllowed']
          : false, // standardSweepingAllowed?
      disabled:
        !elementsEnabled ||
        (child != null && child['nodeAccount']['accountType'] == 'External'),
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-6 col-sm-2',
      widget_container_init_row: true,
      widget_container_end_row: false,
      mask_fields_to_show: {
        '': [],
        true: ['priority'],
        false: [],
      },
    })
    config.push({
      key: 'sweepType',
      title: 'sweepType',
      translate: 'sweepType',
      type: 'select',
      required: true,
      default: child != null ? child['sweepType'] : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-6 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      select_combo_key: 'liquiditySweepingTypes', //,",
      select_dependent: true,
      select_parent: 'reverseSweepingAllowed',
      select_combo_key_by_parent_value: {
        '': 'liquiditySweepingTypes',
        false: 'liquiditySweepingTypes',
        true: 'liquiditySweepingReverseTypes',
      },
      mask_fields_to_show: {
        '': [],
        '1': ['sweepFixedAmount'],
        '2': ['sweepPercentage'],
        '3': ['sweepMinBalance'],
        '4': ['sweepZeroBalance'],
        '5': ['sweepTargetBalance'], // ?
        '6': ['sweepingAccTier1', 'sweepingAccTier2', 'sweepTargetBalance'],
        '7': ['sweepBalanceTrigger'],
      },
    })
    config.push({
      key: 'sweepFixedAmount',
      title: 'sweepFixedAmount',
      translate: 'sweepFixedAmount',
      type: 'number',
      required: true,
      default: child != null ? child['sweepFixedAmount'] : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })
    config.push({
      key: 'sweepPercentage',
      title: 'sweepPercentage',
      translate: 'sweepPercentage',
      type: 'number',
      required: true,
      default: child != null ? child['sweepPercentage'] : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })
    config.push({
      key: 'sweepMinBalance',
      title: 'sweepMinBalance',
      translate: 'sweepMinBalance',
      type: 'number',
      required: true,
      default: child != null ? child['sweepMinBalance'] : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })
    config.push({
      key: 'sweepZeroBalance',
      title: 'sweepZeroBalance',
      translate: 'sweepZeroBalance',
      type: 'number',
      required: true,
      default: child != null ? child['sweepZeroBalance'] : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })
    config.push({
      key: 'sweepingAccTier1',
      title: 'sweepingAccTier1',
      translate: 'sweepingAccTier1',
      type: 'number',
      required: true,
      default: child != null ? child['sweepingAccTier1'] : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-2',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })
    config.push({
      key: 'sweepingAccTier2',
      title: 'sweepingAccTier2',
      translate: 'sweepingAccTier2',
      type: 'number',
      required: true,
      default: child != null ? child['sweepingAccTier2'] : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-2',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })
    config.push({
      key: 'sweepTargetBalance',
      title: 'sweepTargetBalance',
      translate: 'sweepTargetBalance',
      type: 'number',
      required: true,
      default: child != null ? child['sweepTargetBalance'] : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-2',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })
    config.push({
      key: 'sweepBalanceTrigger',
      title: 'sweepBalanceTrigger',
      translate: 'sweepBalanceTrigger',
      type: 'number',
      required: true,
      default: child != null ? child['sweepBalanceTrigger'] : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    const siblings = this._items.filter(
      (item) =>
        this.getItemId(item) != child_id &&
        this.getParentItemId(item) == parent_id,
    )

    config.push({
      key: 'priority',
      title: 'priority',
      translate: 'priority',
      type: 'select',
      required: true,
      default: child != null ? child['priority'] : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: false,
      select_combo_key: 'priority' + (siblings.length + 1) + 'List',
    })

    config.push({
      key: 'currency',
      title: 'currency',
      translate: 'currency',
      type: 'hidden', // label
      required: false,
      default:
        child != null
          ? this.getCurrencyText(child['nodeAccount']['currency'])
          : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-6',
      widget_container_init_row: true,
      widget_container_end_row: false,
    })
    config.push({
      key: 'currency_name',
      title: 'currency_name',
      translate: 'currency',
      type: 'text', // label
      required: false,
      default:
        child != null
          ? this.getCurrencyText(child['nodeAccount']['currency'])
          : '', // TODO translate
      disabled: true,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    //--------------------------------------------------------

    config.push({
      key: '__title',
      title: '__title',
      translate: '',
      type: 'custom-code',
      required: false,
      default: '',
      disabled: !elementsEnabled,
      validators: [],
      widget:
        '<div class="col-xs-12">' +
        '<div class="form-group">' +
        '<span class="form-control"><b>' +
        this.translate.instant(
          this.getTranslationPrefix() + '.ProcessingPlan',
        ) +
        '</b></span>' +
        '</div>' +
        '</div>',
      widget_container_class: 'col-xs-12 col-sm-6',
      widget_container_init_row: true,
      widget_container_end_row: false,
    })

    let rootSweepStartDate = ''

    try {
      if (
        rootItem != null &&
        typeof rootItem['sweepStartDate'] == 'string' &&
        rootItem['sweepStartDate'].indexOf('/') !== -1
      ) {
        rootSweepStartDate = rootItem['sweepStartDate']
      } else {
        rootSweepStartDate =
          rootItem != null
            ? this.injector
                .get(DatePipe)
                .transform(rootItem['sweepStartDate'], 'dd/MM/yyyy')
            : ''
      }
    } catch (e) {
      rootSweepStartDate = ''
    }

    config.push({
      key: 'sweepStartDate',
      title: 'sweepStartDate',
      translate: 'sweepStartDate',
      type: 'span',
      required: false,
      default: rootItem != null ? rootSweepStartDate : '',
      disabled: !elementsEnabled,
      widget: 'datepicker',
      widget_datepicker_min_date: false,
      widget_datepicker_max_date: true,
      widget_container_class: 'col-xs-6 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })
    config.push({
      key: 'sweepFrequency',
      title: 'sweepFrequency',
      translate: 'sweepFrequency',
      type: 'span',
      required: false,
      default:
        rootItem != null
          ? this.translate.instant(
            this.getSweepFrequencyText(rootItem['sweepFrequency']),
          ) +
          this.getSweepFrequencyWithDayText(
            rootItem['sweepFrequency'],
            rootItem['sweepDay'],
            rootItem['sweepDayMonth'],
          )
          : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-6 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      widget_options_in_separated_lines: false,
      translate_rendered_text: true,
    })
    config.push({
      key: 'dailySweepOption',
      title: 'dailySweepOption',
      translate: 'dailySweepOption',
      type: 'span',
      required: false,
      default:
        rootItem != null
          ? this.getSweepDailySweepOptionText(rootItem['dailySweepOption'])
          : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-6 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      select_combo_key: 'sweepingDailyInstructions',
    })

    return config
  }

  //-------------------------------------------------------------------

  public getCurrencyText(code) {
    let text = code
    if (this.combosData && this.combosData['currency']) {
      this.combosData['currency']
        .filter((item) => '' + item['key'] == '' + code)
        .forEach((item) => {
          text = item.value
        })
    }
    return text
  }

  public getCurrencyIsoCode(code) {
    let text = code
    if (this.combosData && this.combosData['currencyIso']) {
      this.combosData['currencyIso']
        .filter((item) => '' + item['key'] == '' + code)
        .forEach((item) => {
          text = item.value
        })
    }
    return text
  }

  private getSweepFrequencyText(code) {
    let text = code
    if (this.combosData && this.combosData['CMSweepingFrequency']) {
      this.combosData['CMSweepingFrequency']
        .filter((item) => '' + item['key'] == '' + code)
        .forEach((item) => {
          text = item.value
        })
    }
    return text
  }

  private getSweepFrequencyDayText(code) {
    let text = code
    if (this.combosData && this.combosData['CMSweepingDay']) {
      this.combosData['CMSweepingDay']
        .filter((item) => '' + item['key'] == '' + code)
        .forEach((item) => {
          text = item.value
        })
    }
    return text
  }

  private getSweepFrequencyDayMonthText(code) {
    let text = code
    if (
      this.combosData &&
      this.combosData['sweepDayMonthList'] &&
      this.combosData['sweepDayMonthList']
    ) {
      this.combosData['sweepDayMonthList']
        .filter((item) => '' + item['key'] == '' + code)
        .forEach((item) => {
          text = item.value
        })
    }
    return text
  }

  private getSweepFrequencyWithDayText(code, day, dayMonth) {
    let text = ''
    if ('' + code == '52') {
      text = ' (' + this.getSweepFrequencyDayText(day) + ')'
    } else if ('' + code == '53') {
      text = ' (' + this.getSweepFrequencyDayMonthText(day) + ')'
    }
    return text
  }

  private getSweepDailySweepOptionText(code) {
    let text = code
    if (this.combosData && this.combosData['sweepingDailyInstructions']) {
      this.combosData['sweepingDailyInstructions']
        .filter((item) => '' + item['key'] == '' + code)
        .forEach((item) => {
          text = item.value
        })
    }
    return text
  }

  getRootId(): string {
    return '000000000000000000000'
  }
}
