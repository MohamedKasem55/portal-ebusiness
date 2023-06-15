import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { StaticService } from '../../../Services/static.service'
import { AbstractAppComponent } from '../../Abstract/abstract-app.component'
import { TreeViewUtilityComponent } from '../tree-view-utility.component'
import { TreeViewUtilityComponentActions } from '../tree-view-utility.service'
import { TreeViewConfiguratorUtilityService } from './tree-view-configurator-utility.service'

@Component({
  selector: 'app-tree-view-configurator-utility',
  templateUrl: './tree-view-configurator-utility.component.html',
  styleUrls: ['./tree-view-configurator-utility.component.scss'],
})
export class TreeViewConfiguratorUtilityComponent
  extends AbstractAppComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild(TreeViewUtilityComponent)
  treeViewUtilityComponent: TreeViewUtilityComponent

  action = null

  actionForm: FormGroup

  actionFormParentFieldConfig: any[] = []

  actionFormChildFieldConfig: any[] = []

  actionFormExtraFieldsConfig: any[] = []

  combosKeysExtras: any[]

  combosData: any[]

  treeItems: any[]

  @Input() service: TreeViewConfiguratorUtilityService

  @Input() custom_fields_templates: any = {}

  @Output() onItemsUpdated: EventEmitter<any> = new EventEmitter<any>()

  formsEmitAllFieldsCreated: any = []

  @Output() onAllFieldsCreated: EventEmitter<any> = new EventEmitter<any>()

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public translate: TranslateService,
  ) {
    super(translate)

    this.actionForm = this.fb.group({})
  }

  ngOnInit() {
    super.ngOnInit()

    // prepare the component

    this.combosKeysExtras = []
    this.combosData = []

    this.subscriptions.push(
      this.service.getItemsObserver().subscribe((items) => {
        this.treeItems = items
      }),
    )
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    super.ngOnDestroy()
  }

  protected createActionFormConfig(
    action = '',
    parents = [],
    children = [],
    parent_id = null,
    child_id = null,
    rootItems = [],
    elementsEnabled = true,
  ) {
    this.combosData = []

    this.actionForm = this.fb.group({})

    this.combosKeysExtras = this.service.getExtraCombosKeys()

    this.subscriptions.push(
      this.staticService
        .getAllCombosAsArrays(this.combosKeysExtras)
        .subscribe((resultC) => {
          if (resultC === null) {
            this.onError(resultC)
          } else {
            const data: any = resultC
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.combosKeysExtras.length; i++) {
              this.combosData[this.combosKeysExtras[i]] =
                data[this.combosKeysExtras[i]]
            }

            this.combosData = Object.assign(
              this.combosData,
              this.service.getExtraCombosData(),
            )

            this.service.setCombosData(this.combosData)

            this.actionFormParentFieldConfig = this.getParentActionFormConfig(
              action,
              parents,
              children,
              parent_id,
              child_id,
              rootItems,
              elementsEnabled,
            )

            this.actionFormChildFieldConfig = this.getChildActionFormConfig(
              action,
              parents,
              children,
              parent_id,
              child_id,
              rootItems,
              elementsEnabled,
            )

            this.actionFormExtraFieldsConfig =
              this.service.getExtraActionFormConfig(
                action,
                parents,
                children,
                parent_id,
                child_id,
                rootItems,
                elementsEnabled,
              )
          }
        }),
    )
  }

  protected getParentActionFormConfig(
    action = '',
    parents = [],
    children = [],
    parent_id = null,
    child_id = null,
    rootItems = [],
    elementsEnabled = true,
  ) {
    this.combosData['_parent_id_data'] = []

    parents.forEach((item) => {
      if (item) {
        this.combosData['_parent_id_data'].push({
          key: this.service.getItemId(item),
          value: this.service.getItemEditFormTitle(item),
        })
      }
    })

    return this.service.getParentActionFormConfig(
      action,
      parents,
      children,
      parent_id,
      child_id,
      rootItems,
    )
  }

  protected getChildActionFormConfig(
    action = '',
    parents = [],
    children = [],
    parent_id = null,
    child_id = null,
    rootItems = [],
    elementsEnabled = true,
  ) {
    this.combosData['_child_id_data'] = []

    children.forEach((item) => {
      this.combosData['_child_id_data'].push({
        key: this.service.getItemId(item),
        value: this.service.getItemEditFormTitle(item),
      })
    })

    return this.service.getChildActionFormConfig(
      action,
      parents,
      children,
      parent_id,
      child_id,
      rootItems,
    )
  }

  onTreeAction(data) {
    this.action = data.action

    const itemR = data.root
    let itemP = {}
    let itemsL = []

    switch (data.action) {
      case TreeViewUtilityComponentActions.APPEND_CHILD_TO_SELECTED_ITEM:
        itemP = data.item
        itemsL = this.treeItems

        this.createActionFormConfig(
          data.action,
          itemP ? [itemP] : [],
          itemsL
            .filter((item) => !this.service.isItemBelongsToTree(item))
            .filter((item) => this.service.canAppendItemAsChild(itemP, item)),
          itemP ? this.service.getItemId(itemP) : null,
          null,
          itemR,
        )
        break

      case TreeViewUtilityComponentActions.REMOVE_ALL_SELECTED_TREE_ITEMS_AS_CHILDREN:
        itemP = data.item
        itemsL = data.items
        this.service.removeAllSelectedItemAsChildren(
          itemsL,
          Object.assign({}, this.actionForm.value),
        )
        this.service.clearElement(itemP)
        this.confirmAction()
        break

      case TreeViewUtilityComponentActions.CONFIGURE_ITEM:
        itemP = data.item
        itemsL = this.treeItems
        this.createActionFormConfig(
          data.action,
          itemsL.filter(
            (item) =>
              this.service.getItemId(item) ==
              this.service.getParentItemId(itemP),
          ),
          [itemP],
          this.service.getParentItemId(itemP),
          this.service.getItemId(itemP),
          itemR,
        )
        this.actionForm.enable()
        break

      case TreeViewUtilityComponentActions.VIEW_ITEM_DETAIL:
        itemP = data.item
        itemsL = this.treeItems
        this.createActionFormConfig(
          data.action,
          itemsL.filter(
            (item) =>
              this.service.getItemId(item) ==
              this.service.getParentItemId(itemP),
          ),
          [itemP],
          this.service.getParentItemId(itemP),
          this.service.getItemId(itemP),
          itemR,
          false,
        )
        this.actionForm.disable()
        break

      case TreeViewUtilityComponentActions.CHANGE_PARENT_FOR_SELECTED_ITEM:
        itemP = data.item
        itemsL = data.items
        this.createActionFormConfig(
          data.action,
          itemsL.filter((item) =>
            this.service.canAppendItemAsChild(item, itemP),
          ),
          [itemP],
          null,
          this.service.getItemId(itemP),
          itemR,
        )
        break
      case TreeViewUtilityComponentActions.UNLINK_SELECTED_ITEM_AS_CHILD_OF_PARENT:
        itemP = data.item
        itemsL = []
        this.service.unlinkSelectedItemAsChildOfParent(
          this.service.getItemId(itemP),
          Object.assign({}, this.actionForm.value),
        )
        this.finishAction()
        break

      default:
        if (this.service.allowActionFormForExtraAction(data.action)) {
          itemP = data.item
          itemsL = this.treeItems

          this.createActionFormConfig(
            data.action,
            itemP ? [itemP] : [],
            itemsL,
            itemP ? this.service.getItemId(itemP) : null,
            null,
            itemR,
          )

          break
        } else {
          this.confirmAction()
        }
        break
    }
  }

  confirmAction() {
    this.service.confirmAction(this.action, this.actionForm)

    if (this.action != TreeViewUtilityComponentActions.VIEW_ITEM_DETAIL) {
      this.onItemsUpdated.emit(
        this.treeItems.filter((item) => this.service.isItemBelongsToTree(item)),
      )
    }

    this.finishAction()
  }

  finishAction() {
    this.action = null
    this.createActionFormConfig()
  }

  resetAction() {}

  cancelAction() {
    this.finishAction()
  }

  emitAllFieldsCreated($event, pos) {
    this.formsEmitAllFieldsCreated[pos] = true
    if (
      this.formsEmitAllFieldsCreated[0] === true &&
      this.formsEmitAllFieldsCreated[1] === true
    ) {
      this.onAllFieldsCreated.emit($event)
    }
  }
}
