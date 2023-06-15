import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { TreeViewConfiguratorUtilityService } from '../../../../Common/Components/TreeView/Configurator/tree-view-configurator-utility.service'
import { TreeViewUtilityComponentActions } from '../../../../Common/Components/TreeView/tree-view-utility.service'
import { CashManagementPoolingListService } from '../list/cash-management-pooling-list.service'
import { Exception } from '../../../../../Model/exception'

@Injectable()
export class CashManagementPoolingDetailService extends TreeViewConfiguratorUtilityService {
  structure: any = null

  structureList: any[] = []

  currencyCodesCombo: any[]

  constructor(
    protected poolingListService: CashManagementPoolingListService,
    protected http: HttpClient,
    public translate: TranslateService,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  //--------------------------------------------------------------------

  public setCurrencyCodesCombo(currencyCodesCombo) {
    this.currencyCodesCombo = currencyCodesCombo
  }

  public initStructure(values: any): Observable<any> {
    this.poolingListService
      .getResults({}, '', '', 1, 100)
      .subscribe((result) => {
        if (result != null) {
          this.structureList = result.data
        }
      })

    if (!this.structure || !this.structure.structureId) {
      return this.createNewStructureRequest(values).pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              response.errorCode,
              response.errorDescription,
            )
            return exception
          } else {
            const result = this.getOutputFromNewStructureResponse(response)
            return result
          }
        }),
        catchError(this.handleError),
      )
    } else {
      return this.createLoadStructureRequest(values).pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              response.errorCode,
              response.errorDescription,
            )
            return exception
          } else {
            const result = this.getOutputFromLoadStructureResponse(response)
            return result
          }
        }),
        catchError(this.handleError),
      )
    }
  }

  protected createLoadStructureRequest(values: any): Observable<any> {
    const data = {
      structureId: this.structure.structureId,
    }

    return this.http.post(this.servicesUrl + '/pooling/structure', data)
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

  protected emitChangedItems(items: any[]) {
    const treeItems = items.filter((item) => this.isItemBelongsToTree(item))
    this.calculateNodesBalances(treeItems)
    super.emitChangedItems(items)
  }

  public calculateNodesBalances(treeItems: any[]) {
    treeItems.sort((a, b) => {
      if (
        a['_parent_id'] === null ||
        a['_parent_id'] === undefined ||
        a['_parent_id'] === ''
      ) {
        return -1
      }
      if (
        b['_parent_id'] === null ||
        b['_parent_id'] === undefined ||
        b['_parent_id'] === ''
      ) {
        return 1
      }
      return a['_chil_id'] <= b['_chil_id'] ? -1 : 1
    })
    const totals = {}
    if (treeItems && treeItems.length > 0) {
      for (let i = 0; i < treeItems.length; i++) {
        const item = treeItems[i]
        if (
          this.getParentItemId(item) !== null &&
          this.getParentItemId(item) !== '' &&
          this.getParentItemId(item) !== this.getRootId()
        ) {
          const nodeBalance = parseFloat(
            '' +
              (item['nodeAccount'] && item['nodeAccount']['availableBalance']
                ? item['nodeAccount']['availableBalance']
                : 0),
          )
          const nodeCurrency =
            item['nodeAccount'] && item['nodeAccount']['currency']
              ? item['nodeAccount']['currency']
              : 608
          const nodeCurrencyText = this.getCurrencyCode(nodeCurrency)
          if (
            totals[nodeCurrencyText] === undefined ||
            totals[nodeCurrencyText] === null
          ) {
            totals[nodeCurrencyText] = 0
          }
          totals[nodeCurrencyText] += nodeBalance
        }
      }
      for (let i = 0; i < treeItems.length; i++) {
        const item = treeItems[i]
        if (
          this.getParentItemId(item) == null ||
          this.getParentItemId(item) == '' ||
          this.getParentItemId(item) == this.getRootId()
        ) {
          let nodeValue = treeItems[i]['nodeValue']
          const totalsKeys = Object.keys(totals)
          totalsKeys.forEach((key) => {
            if (totals[key] != 0) {
              nodeValue += '<br/>' + totals[key] + ' ' + key
            }
          })
          treeItems[i]['nodeValueWithAmount'] = nodeValue
        }
      }
    }
  }

  protected createNewStructureRequest(values: any): Observable<any> {
    const data: any = {}

    return this.http.get(this.servicesUrl + '/pooling/accounts', {
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
        if (response.errorCode !== '0') {
          const exception: Exception = new Exception(
            response.errorCode,
            response.errorDescription,
          )
          return exception
        } else {
          this.setStructure(null)
          return response
        }
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

    return this.http.post(this.servicesUrl + '/pooling/delete', data)
  }

  //--------------------------------------------------------------------

  public validateStructure(values: any): Observable<any> {
    return this.createValidateStructureRequest(values).pipe(
      map((response: any) => {
        if (response.errorCode !== '0') {
          const exception: Exception = new Exception(
            response.errorCode,
            response.errorDescription,
          )
          return exception
        } else {
          return response
        }
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
          structureId = item.structureDescription
        })
    }

    const data = {
      structureId,
      nodeList: values.nodeList,
    }

    return this.http.post(this.servicesUrl + '/pooling/validate', data)
  }

  //--------------------------------------------------------------------

  public saveStructure(values: any): Observable<any> {
    return this.createSaveStructureRequest(values).pipe(
      map((response: any) => {
        if (response.errorCode !== '0') {
          const exception: Exception = new Exception(
            response.errorCode,
            response.errorDescription,
          )
          return exception
        } else {
          return response
        }
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
          structureId = item.structureDescription
        })
    }
    const data = {
      structureId,
      nodeList: values.nodeList,
    }

    return this.http.post(this.servicesUrl + '/pooling/save', data)
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
      dailyPoolingInstructions: null,
      level: null,
      nodeAccount: accountItem,
      nodeBalance: null,
      nodePosition: null,
      nodeSARBalance: null,
      nodeType: null,
      nodeValue: null,
      parentPosition: null,
      parentType: null,
      parentValue: null,
      poolAccountHierarchyInternalId: null,
      poolPriority: null,
      poolStatus: null,
      processingPlanDescription: null,
      processingPlanInternalId: null,
      structureDescription: null,
      structurePoolingType: null,
      structureStatus: null,
      virtualStatement: null,
      _totalAmount: null,
    }
  }

  //--------------------------------------------------------------------

  public getTranslationPrefix() {
    return 'dashboard.cashManagement.pooling'
  }

  public getItemId(item) {
    return item['nodeAccount']
      ? item['nodeAccount']['liquidityAccountNumber']
      : item['nodeValue']
      ? item['nodeValue']
      : ''
  }

  public getItemNodeTitle(item) {
    if (
      this.getParentItemId(item) == null ||
      this.getParentItemId(item) == '' ||
      this.getParentItemId(item) == this.getRootId()
    ) {
      if (item['nodeValueWithAmount']) {
        return item['nodeValueWithAmount']
      }
    }
    if (item['nodeAccount']) {
      return item['nodeAccount']['liquidityAccountNumber']
    }
    if (item['nodeValue']) {
      return item['nodeValue']
    }
    return ''
  }

  public getItemEditFormTitle(item) {
    if (item['nodeType'] == 2) {
      return this.getItemNodeTitle(item).split('<br')[0]
    }

    let title = item['nodeAccount']
      ? item['nodeAccount']['liquidityAccountNumber'] +
        (item['nodeAccount']['accountType']
          ? ' (' +
            item['nodeAccount']['accountType'] +
            ') ' +
            (item['nodeAccount']['availableBalance']
              ? ' - ' +
                item['nodeAccount']['availableBalance'] +
                ' ' +
                this.getCurrencyText(item['nodeAccount']['currency'])
              : '')
          : '')
      : ''

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
            title + ' ' + this.getCurrencyText(item['nodeAccount']['currency'])
        }
      }
    } else if (item['nodeAccount']['accountType'] == 'SubCIC') {
      title = title + ' - Sub CIC: ' + item['nodeAccount']['subCICNumber'] // TODO subCICNumber?
      if (
        item['nodeAccount']['currency'] != null &&
        item['nodeAccount']['currency'] != undefined
      ) {
        title =
          title + ' ' + this.getCurrencyText(item['nodeAccount']['currency'])
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
          title + ' ' + this.getCurrencyText(item['nodeAccount']['currency'])
      }
    }
    return title
  }

  public getParentItemId(item) {
    return item['parentValue'] != null &&
      item['parentValue'] != this.getRootId()
      ? item['parentValue']
      : null
  }

  public isItemBelongsToTree(item: any) {
    return (
      (item['parentValue'] != null && item['parentValue'] != '') ||
      item['nodeValue'] != null
    )
  }

  public canAppendItemAsChild(parent, item) {
    // TODO

    if (
      parent == null ||
      parent['nodeAccount'] == null ||
      parent['nodeType'] == 2
    ) {
      return true //item['nodeAccount']['accountType'] == 'Internal';
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
    item['parentValue'] =
      parent != null && parent != '' ? this.getItemId(parent) : this.getRootId()
    item['parentType'] =
      parent != null && parent != '' ? parent['nodeType'] : null
  }

  protected setItemBelongsToTree(item: any, belong: boolean) {
    if (belong) {
      item['parentValue'] =
        item['parentValue'] != null && item['parentValue'] != ''
          ? item['parentValue']
          : this.getRootId()
    } else {
      item['parentValue'] = null
    }
  }

  protected setItemValues(action = '', item, values) {
    //console.log("action", action);

    item = Object.assign(item, values)

    //console.log("item", item);

    switch (action) {
      case TreeViewUtilityComponentActions.APPEND_CHILD_TO_SELECTED_ITEM:
        if (
          this.getParentItemId(item) == null ||
          this.getParentItemId(item) == '' ||
          this.getParentItemId(item) == this.getRootId()
        ) {
          // item['nodeType'] = 2;
          //item['nodeValue'] = values['nodeValue'];
          // this.structure.structureId = item['structureDescription'];
          this.structure.description = item['structureDescription']
        }
        break
      case 'APPEND_NEW_VIRTUAL_TO_SELECTED_ITEM':
        if (values.nodeType == 2) {
          // values.nodeValue
        } else if (values.nodeType == 3) {
          item['nodeValue'] = values.nodeValueStructure
        }
        break
      default:
        break
    }
    //item['nodeAccount']['currency'] = values['currency'] ? values['currency'] : item['nodeAccount']['currency'];
  }

  public compare(a, b) {
    // a debe ser menor que b
    const av = a['nodeAccount']
      ? a['nodeAccount']['liquidityAccountNumber']
      : a['nodeValue']
    const bv = b['nodeAccount']
      ? b['nodeAccount']['liquidityAccountNumber']
      : b['nodeValue']
    if (av < bv) {
      return -1
    }
    // a debe ser mayor que b
    if (av > bv) {
      return 1
    }
    // a debe ser igual b
    return 0
  }

  //--------------------------------------------------------------------

  public getRootId(): string {
    return '000000000000000000000'
  }

  protected allowConfigureItemAction(): boolean {
    return false
  }

  public getTreeNodeActionsButtons(nodeItem): string {
    const item = nodeItem['item']

    const item_id = this.getItemId(item)

    let actions_buttons = ''

    actions_buttons +=
      '<a data-id="' +
      item_id +
      '" data-action="' +
      'APPEND_NEW_VIRTUAL_TO_SELECTED_ITEM' +
      '" ' +
      'class="human-selectable TREE_VIEW_UTILITY_ACTION" style="margin: 5px;">' +
      '<img src="assets/img/ocNewVirtual.png"/>' +
      '</a>'

    actions_buttons += super.getTreeNodeActionsButtons(nodeItem)

    return actions_buttons
  }

  //--------------------------------------------------------------------

  public getExtraCombosKeys() {
    return ['liquidityPoolingTypes', 'poolingDailyInstructions']
  }

  public getExtraCombosData() {
    const combosData = []

    // TODO filter except current

    combosData['structureList'] = []

    this.structureList
      .filter((item) => this.structure.structureId != item.structureId)
      .forEach((item) => {
        combosData['structureList'].push({
          key: item['structureId'],
          value: item['description'],
        })
      })

    combosData['nodeTypeList'] = [
      {
        key: 3,
        value: this.getTranslationPrefix() + '.nodeTypeList.structure',
      },
      {
        key: 2,
        value: this.getTranslationPrefix() + '.nodeTypeList.virtualAccount',
      },
    ]

    /*
        combosData['priorityList'] = [
            {
                key: 0,
                value: 'Default'
            },
            {
                key: 1,
                value: '1st'
            },
            {
                key: 2,
                value: '2nd'
            },
            {
                key: 3,
                value: '3rd'
            }
        ];

        for (let i = 4; i <= this._items.length; i++) {
            combosData['priorityList'].push({
                key: i,
                value: '' + i + 'th'
            });
        }

        for (let i = 1; i <= this._items.length; i++) {
            combosData['priority' + i + 'List'] = combosData['priorityList'].slice(0, i + 1);
        }

        combosData['sweepDayMonthList'] = [];

        for (let i = 1; i <= 31; i++) {
            combosData['sweepDayMonthList'].push({
                key: i,
                value: i
            });
        }
         */

    return combosData
  }

  //-------------------------------------------------------------------

  public allowActionFormForExtraAction(action = '') {
    switch (action) {
      case 'APPEND_NEW_VIRTUAL_TO_SELECTED_ITEM':
        return true
      default:
        return super.allowActionFormForExtraAction(action)
    }
  }

  public getParentActionFormConfig(
    action = '',
    parents: any[] = [],
    children: any[] = [],
    parent_id: any = null,
    child_id: any = null,
    rootItems: any[] = [],
    elementsEnabled = true,
  ): any[] {
    let parentConfig = []

    switch (action) {
      case 'APPEND_NEW_VIRTUAL_TO_SELECTED_ITEM':
      //    break;
      default:
        parentConfig = super.getParentActionFormConfig(
          action,
          parents,
          children,
          parent_id,
          child_id,
          rootItems,
          elementsEnabled,
        )
    }

    return parentConfig
  }

  public getChildActionFormConfig(
    action = '',
    parents: any[] = [],
    children: any[] = [],
    parent_id: any = null,
    child_id: any = null,
    rootItems: any[] = [],
    elementsEnabled = true,
  ): any[] {
    let childConfig = []

    switch (action) {
      case 'APPEND_NEW_VIRTUAL_TO_SELECTED_ITEM':
        break
      default:
        let child = null

        if (child_id != null) {
          children
            .filter((item) => this.getItemId(item) == child_id)
            .forEach((item) => {
              child = item
            })
        }

        if (parents.length == 0) {
          childConfig.push({
            key: '_child_id',
            title: '_child_id',
            translate: '_child_element',
            type: 'hidden',
            required: false,
            default: '',
            disabled: !elementsEnabled,
            readonly: true,
            validators: [],
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-6 col-md-6',
            widget_container_init_row: false,
            widget_container_end_row: false,
          })
        } else {
          childConfig = super.getChildActionFormConfig(
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

    return childConfig
  }

  public getExtraActionFormConfig(
    action = '',
    parents = [],
    children = [],
    parent_id = null,
    child_id = null,
    rootItems = [],
    elementsEnabled = true,
  ) {
    let config = []

    switch (action) {
      case 'APPEND_NEW_VIRTUAL_TO_SELECTED_ITEM':
        config = this.getExtraVirtualNodeActionFormConfig(
          action,
          parents,
          children,
          parent_id,
          child_id,
          rootItems,
          elementsEnabled,
        )
        break
      default:
        if (parents.length == 0 && parent_id == null) {
          config = this.getExtraRootNodeActionFormConfig(
            action,
            parents,
            children,
            parent_id,
            child_id,
            rootItems,
            elementsEnabled,
          )
        } else {
          config = this.getExtraChildNodeActionFormConfig(
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

    return config
  }

  public getExtraRootNodeActionFormConfig(
    action = '',
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
          this.getTranslationPrefix() + '.PoolingStructureList',
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
      widget_container_class: 'col-xs-12 col-sm-6',
      widget_container_init_row: true,
      widget_container_end_row: false,
    })

    config.push({
      key: 'nodeValue',
      title: 'nodeValue',
      translate: 'nodeValue',
      type: 'text',
      required: true,
      default: child != null ? child['nodeValue'] : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-6',
      widget_container_init_row: true,
      widget_container_end_row: false,
    })

    config.push({
      key: 'structurePoolingType',
      title: 'structurePoolingType',
      translate: 'structurePoolingType',
      type: 'select',
      required: true,
      default: child != null ? child['structurePoolingType'] : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-6 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      select_combo_key: 'liquidityPoolingTypes',
    })
    config.push({
      key: 'dailyPoolingInstructions',
      title: 'dailyPoolingInstructions',
      translate: 'dailyPoolingInstructions',
      type: 'select',
      required: true,
      default: child != null ? child['dailyPoolingInstructions'] : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-6 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      select_combo_key: 'poolingDailyInstructions',
    })
    config.push({
      key: 'virtualStatement',
      title: 'virtualStatement',
      translate: 'virtualStatement',
      type: 'checkbox',
      required: false,
      default: child != null ? child['virtualStatement'] : false,
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-6 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: false,
    })

    config.push({
      key: 'structureStatus',
      title: 'structureStatus',
      translate: 'structureStatus',
      type: 'hidden',
      required: false,
      default:
        child != null &&
        child['structureStatus'] != null &&
        child['structureStatus'] != ''
          ? child['structureStatus']
          : 'New',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-6 col-sm-3 hidden',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    config.push({
      key: 'nodeType',
      title: 'nodeType',
      translate: 'nodeType',
      type: 'hidden',
      required: false,
      default: 2,
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-6 col-sm-3 hidden',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    config.push({
      key: 'parentType',
      title: 'parentType',
      translate: 'parentType',
      type: 'hidden',
      required: false,
      default: 1,
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-6 col-sm-3 hidden',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    return config
  }

  public getExtraChildNodeActionFormConfig(
    action = '',
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

    // TODO

    config.push({
      key: 'nodeType',
      title: 'nodeType',
      translate: 'nodeType',
      type: 'hidden',
      required: false,
      default: 1,
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-6 col-sm-3 hidden',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    return config
  }

  public getExtraVirtualNodeActionFormConfig(
    action = '',
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

    // TODO

    config.push({
      key: 'nodeType',
      title: 'nodeType',
      translate: 'nodeType',
      type: 'radioGroup',
      required: true,
      default: child != null ? child['nodeType'] : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-6 col-sm-6',
      widget_container_init_row: false,
      widget_container_end_row: false,
      widget_options_in_separated_lines: false,
      select_combo_key: 'nodeTypeList',
      translate_rendered_text: true,
      mask_fields_to_show: {
        '': [],
        '2': ['nodeValue'],
        '3': ['nodeValueStructure'],
      },
    })

    config.push({
      key: 'nodeValueStructure',
      title: 'nodeValueStructure',
      translate: 'nodeValueStructure',
      type: 'select',
      required: true,
      default: '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-6 col-sm-6',
      widget_container_init_row: true,
      widget_container_end_row: false,
      select_combo_key: 'structureList',
    })

    config.push({
      key: 'nodeValue',
      title: 'nodeValue',
      translate: 'nodeValue',
      type: 'text',
      required: true,
      default: child != null ? child['nodeValue'] : '',
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-6',
      widget_container_init_row: true,
      widget_container_end_row: false,
    })

    config.push({
      key: 'virtualStatement',
      title: 'virtualStatement',
      translate: 'virtualStatement',
      type: 'checkbox',
      required: false,
      default: child != null ? child['virtualStatement'] : false,
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-6 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: false,
    })

    config.push({
      key: 'parentType',
      title: 'parentType',
      translate: 'parentType',
      type: 'hidden',
      required: false,
      default: parent['nodeType'],
      disabled: !elementsEnabled,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-6 col-sm-3 hidden',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    return config
  }

  //-------------------------------------------------------------------

  private getCurrencyCode(code) {
    return this.currencyCodesCombo && this.currencyCodesCombo[code]
      ? this.currencyCodesCombo[code]
      : code
  }

  private getCurrencyText(code) {
    let text = code
    if (this.currencyCodesCombo) {
      text = this.currencyCodesCombo[code]
    }
    return text
  }

  //---------------------------------------------------------------------

  public confirmAction(action = '', actionForm: FormGroup): void {
    switch (action) {
      case 'APPEND_NEW_VIRTUAL_TO_SELECTED_ITEM':
        this.appendNewVirtualToSelectedItem(
          actionForm.get('_parent_id').value,
          Object.assign({}, actionForm.value),
        )
        break
      default:
        super.confirmAction(action, actionForm)
    }
  }

  public appendChildToSelectedItem(parent_id, child_id, values) {
    let itemSelected = null

    let parentSelected = null

    this._items
      .filter((item) => this.getItemId(item) == child_id)
      .forEach((item) => {
        itemSelected = item
      })

    if (itemSelected === null) {
      itemSelected = this.createNodeItem(null)
      this._items.push(itemSelected)
    }

    this._items
      .filter((parent) => this.getItemId(parent) == parent_id)
      .forEach((parent) => {
        parentSelected = parent
      })

    this.setParentItem(itemSelected, parentSelected)

    this.setItemBelongsToTree(itemSelected, true)

    this.setItemValues(
      TreeViewUtilityComponentActions.APPEND_CHILD_TO_SELECTED_ITEM,
      itemSelected,
      values,
    )

    this.emitChangedItems(this._items)
  }

  public appendNewVirtualToSelectedItem(parent_id, values) {
    let parentSelected = null

    this._items
      .filter((parent) => this.getItemId(parent) == parent_id)
      .forEach((parent) => {
        parentSelected = parent
      })

    const itemSelected = this.createNodeItem(null)
    this._items.push(itemSelected)

    this.setParentItem(itemSelected, parentSelected)

    this.setItemBelongsToTree(itemSelected, true)

    this.setItemValues(
      'APPEND_NEW_VIRTUAL_TO_SELECTED_ITEM',
      itemSelected,
      values,
    )

    this.emitChangedItems(this._items)
  }
}
