import { HttpClient } from '@angular/common/http'
import { FormGroup } from '@angular/forms'
import { BehaviorSubject, Observable } from 'rxjs'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import {
  TreeViewUtilityComponentActions,
  TreeViewUtilityService,
} from '../tree-view-utility.service'

export abstract class TreeViewConfiguratorUtilityService extends TreeViewUtilityService {
  protected _items: any[]

  protected treeItems$: BehaviorSubject<any[]>

  protected combosData: any[]

  protected constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
    this._items = []
    this.treeItems$ = new BehaviorSubject([])
    this.combosData = []
  }

  public getTreeItemsObserver(): Observable<any[]> {
    return this.treeItems$.asObservable()
  }

  public abstract getTranslationPrefix()

  protected abstract setParentItem(item, parent)

  public setCombosData(combosData) {
    this.combosData = combosData
  }

  protected setItemBelongsToTree(item: any, belong: boolean) {}

  public isItemBelongsToTree(item: any): boolean {
    return true
  }

  protected emitChangedItems(items: any[]) {
    this._items = items
    this.items$.next(items)
    this.treeItems$.next(items.filter((item) => this.isItemBelongsToTree(item)))
  }

  public abstract canAppendItemAsChild(parent, item)

  public getExtraCombosKeys() {
    return []
  }

  public getExtraCombosData() {
    return []
  }

  public getParentActionFormConfig(
    action = '',
    parents = [],
    children = [],
    parent_id = null,
    child_id = null,
    rootItems = [],
    elementsEnabled = true,
  ) {
    const parentConfig = []

    if (parents.length == 0 && parent_id == null) {
      parentConfig.push({
        key: '_parent_id',
        title: '_parent_id',
        translate: '_parent_element',
        type: 'hidden',
        required: parent_id != null,
        default: parent_id != null ? parent_id : '',
        disabled: !elementsEnabled,
        validators: [],
        select_combo_key: '_parent_id_data',
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-6 col-md-6',
        widget_container_init_row: true,
        widget_container_end_row: false,
      })
    } else if (parents.length == 1 && parent_id != null) {
      parentConfig.push({
        key: '_parent_id',
        title: '_parent_id',
        translate: '_parent_element',
        type: 'hidden',
        required: parent_id != null,
        default: parent_id != null ? parent_id : '',
        disabled: !elementsEnabled,
        readonly: true,
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-6 col-md-6',
        widget_container_init_row: true,
        widget_container_end_row: false,
      })
      parentConfig.push({
        key: '_parent_id_name',
        title: '_parent_id_name',
        translate: '_parent_element_name',
        type: 'span',
        required: parent_id != null,
        default: this.getItemEditFormTitle(parents[0]),
        disabled: !elementsEnabled,
        readonly: true,
        validators: [],
        select_combo_key: '_parent_id_data',
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-6 col-md-6',
        widget_container_init_row: true,
        widget_container_end_row: false,
      })
    } else {
      parentConfig.push({
        key: '_parent_id',
        title: '_parent_id',
        translate: '_parent_element_name',
        type: 'select',
        required: parent_id != null,
        default: parent_id != null ? parent_id : '',
        disabled: !elementsEnabled,
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-6 col-md-6',
        widget_container_init_row: true,
        widget_container_end_row: false,
      })
    }

    return parentConfig
  }

  public getChildActionFormConfig(
    action = '',
    parents = [],
    children = [],
    parent_id = null,
    child_id = null,
    rootItems = [],
    elementsEnabled = true,
  ) {
    const childConfig = []

    if (children.length == 1 && child_id != null) {
      childConfig.push({
        key: '_child_id',
        title: '_child_id',
        translate: '_child_element',
        type: 'hidden',
        required: true,
        default: child_id != null ? child_id : '',
        disabled: !elementsEnabled,
        readonly: true,
        validators: [],
        select_combo_key: '_child_id_data',
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-6 col-md-6',
        widget_container_init_row: false,
        widget_container_end_row: false,
      })
      childConfig.push({
        key: '_child_id_name',
        title: '_child_id_name',
        translate: '_child_element_name',
        type: 'span',
        required: true,
        default: '<b>' + this.getItemEditFormTitle(children[0]) + '</b>',
        disabled: !elementsEnabled,
        readonly: true,
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-6 col-md-6',
        widget_container_init_row: true,
        widget_container_end_row: false,
      })
    } else {
      childConfig.push({
        key: '_child_id',
        title: '_child_id',
        translate: '_child_element_name',
        type: 'select',
        required: true,
        default: child_id != null ? child_id : '',
        disabled: !elementsEnabled,
        validators: [],
        select_combo_key: '_child_id_data',
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-6 col-md-6',
        widget_container_init_row: true,
        widget_container_end_row: false,
      })
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
    return []
  }

  protected abstract setItemValues(action, item, values)

  public appendChildToSelectedItem(parent_id, child_id, values) {
    let itemSelected = null

    let parentSelected = null

    this._items
      .filter((item) => this.getItemId(item) == child_id)
      .forEach((item) => {
        itemSelected = item
      })

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

  public configureItem(child_id, values) {
    this._items
      .filter((item) => this.getItemId(item) == child_id)
      .forEach((item) => {
        this.setItemValues(
          TreeViewUtilityComponentActions.CONFIGURE_ITEM,
          item,
          values,
        )
      })

    this.emitChangedItems(this._items)
  }

  public clearElement(item) {
    //this.setItemBelongsToTree(item, false);
    item.dailyPoolingInstructions = null
    item.level = null
    item.nodeBalance = null
    item.nodePosition = null
    item.nodeSARBalance = null
    item.nodeType = null
    item.nodeValue = null
    item.parentPosition = null
    item.parentType = null
    item.parentValue = null
    item.poolAccountHierarchyInternalId = null
    item.poolPriority = null
    item.poolStatus = null
    item.processingPlanDescription = null
    item.processingPlanInternalId = null
    item.structureDescription = null
    item.structurePoolingType = null
    item.structureStatus = null
    item.virtualStatement = null
    this.emitChangedItems(this._items)
  }

  public removeAllSelectedItemAsChildren(tree_items, values) {
    tree_items.forEach((itemR) => {
      this._items
        .filter((item) => this.getItemId(item) == this.getItemId(itemR))
        .forEach((item) => {
          this.setParentItem(item, null)
          this.setItemBelongsToTree(item, false)
        })
    })

    this.emitChangedItems(this._items)
  }

  public changeParentForSelectedItem(parent_id, child_id, values) {
    this._items
      .filter((item) => this.getItemId(item) == child_id)
      .forEach((item) => {
        this._items
          .filter((parent) => this.getItemId(parent) == parent_id)
          .forEach((parent) => {
            this.setParentItem(item, parent)
          })
        this.setItemBelongsToTree(item, true)
      })

    this.emitChangedItems(this._items)
  }

  public unlinkSelectedItemAsChildOfParent(child_id, values) {
    this._items
      .filter((item) => this.getItemId(item) == child_id)
      .forEach((item) => {
        this.setParentItem(item, null)
        this.setItemBelongsToTree(item, true)
      })

    this.emitChangedItems(this._items)
  }

  public getTreeRootNodeActionsButtons(root_id): string {
    let actions_buttons = ''
    if (this.allowEmptyTreeToAddChildAction()) {
      actions_buttons +=
        '<a data-id="' +
        root_id +
        '" data-action="' +
        TreeViewUtilityComponentActions.APPEND_CHILD_TO_SELECTED_ITEM +
        '" ' +
        'class="human-selectable TREE_VIEW_UTILITY_ACTION" style="margin: 5px;">' +
        '<img src="assets/img/ocNew.png"/>' +
        '</a>'
    }
    return actions_buttons
  }

  public getTreeNodeActionsButtons(nodeItem): string {
    const item = nodeItem['item']

    const item_id = this.getItemId(item)
    let parent_id = this.getParentItemId(item)

    if (parent_id == this.getRootId() || parent_id == null) {
      parent_id = ''
    }

    let actions_buttons = ''

    if (
      this.isAllowedNodeAction(
        nodeItem,
        TreeViewUtilityComponentActions.APPEND_CHILD_TO_SELECTED_ITEM,
      )
    ) {
      actions_buttons +=
        '<a data-id="' +
        item_id +
        '" data-action="' +
        TreeViewUtilityComponentActions.APPEND_CHILD_TO_SELECTED_ITEM +
        '" ' +
        'class="human-selectable TREE_VIEW_UTILITY_ACTION" style="margin: 5px;">' +
        '<img src="assets/img/ocNew.png"/>' +
        '</a>'
    }
    if (
      this.isAllowedNodeAction(
        nodeItem,
        TreeViewUtilityComponentActions.REMOVE_ALL_SELECTED_TREE_ITEMS_AS_CHILDREN,
      )
    ) {
      actions_buttons +=
        '<a data-id="' +
        item_id +
        '" data-action="' +
        TreeViewUtilityComponentActions.REMOVE_ALL_SELECTED_TREE_ITEMS_AS_CHILDREN +
        '" ' +
        'class="human-selectable TREE_VIEW_UTILITY_ACTION" style="margin: 5px;">' +
        '<img src="assets/img/ocDelete.png"/>' +
        '</a>'
    }
    if (
      this.isAllowedNodeAction(
        nodeItem,
        TreeViewUtilityComponentActions.CONFIGURE_ITEM,
      )
    ) {
      actions_buttons +=
        '<a data-id="' +
        item_id +
        '" data-action="' +
        TreeViewUtilityComponentActions.CONFIGURE_ITEM +
        '" ' +
        'class="human-selectable TREE_VIEW_UTILITY_ACTION" style="margin: 5px;">' +
        '<img src="assets/img/ocEdit' +
        (parent_id == '' ? '1' : '') +
        '.png"/>' +
        '</a>'
    }
    if (
      this.isAllowedNodeAction(
        nodeItem,
        TreeViewUtilityComponentActions.CHANGE_PARENT_FOR_SELECTED_ITEM,
      )
    ) {
      actions_buttons +=
        '<a data-id="' +
        item_id +
        '" data-action="' +
        TreeViewUtilityComponentActions.CHANGE_PARENT_FOR_SELECTED_ITEM +
        '" ' +
        'class="human-selectable TREE_VIEW_UTILITY_ACTION" style="margin: 5px;">' +
        '<img src="assets/img/ocEdit1.png"/>' +
        '</a>'
    }
    if (
      this.isAllowedNodeAction(
        nodeItem,
        TreeViewUtilityComponentActions.UNLINK_SELECTED_ITEM_AS_CHILD_OF_PARENT,
      )
    ) {
      actions_buttons +=
        '<a data-id="' +
        item_id +
        '" data-action="' +
        TreeViewUtilityComponentActions.UNLINK_SELECTED_ITEM_AS_CHILD_OF_PARENT +
        '" ' +
        'class="human-selectable TREE_VIEW_UTILITY_ACTION" style="margin: 5px;">' +
        '<img src="assets/img/ocEdit1.png"/>' +
        '</a>'
    }

    return actions_buttons
  }

  public allowActionFormForExtraAction(action = '') {
    return false
  }

  public confirmAction(action = '', actionForm: FormGroup): void {
    actionForm['value']['sweepDay'] = actionForm['value']['sweepFrequency'] === '53' ? actionForm['value']['sweepDayMonth']: actionForm['value']['sweepDay'];
    switch (action) {
      case TreeViewUtilityComponentActions.APPEND_CHILD_TO_SELECTED_ITEM:
        this.appendChildToSelectedItem(
          actionForm.get('_parent_id').value,
          actionForm.get('_child_id').value,
          Object.assign({}, actionForm.value),
        )
        break

      case TreeViewUtilityComponentActions.REMOVE_ALL_SELECTED_TREE_ITEMS_AS_CHILDREN:
        break

      case TreeViewUtilityComponentActions.CONFIGURE_ITEM:
        this.configureItem(
          actionForm.get('_child_id').value,
          Object.assign({}, actionForm.value),
        )
        break

      case TreeViewUtilityComponentActions.VIEW_ITEM_DETAIL:
        break

      case TreeViewUtilityComponentActions.CHANGE_PARENT_FOR_SELECTED_ITEM:
        this.changeParentForSelectedItem(
          actionForm.get('_parent_id').value,
          actionForm.get('_child_id').value,
          Object.assign({}, actionForm.value),
        )
        break

      case TreeViewUtilityComponentActions.UNLINK_SELECTED_ITEM_AS_CHILD_OF_PARENT:
        break

      default:
        break
    }
  }
}
