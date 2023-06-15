import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AbstractService } from '../../Services/Abstract/abstract.service'

export enum TreeViewUtilityComponentActions {
  APPEND_CHILD_TO_SELECTED_ITEM = 'APPEND_CHILD_TO_SELECTED_ITEM',
  REMOVE_ALL_SELECTED_TREE_ITEMS_AS_CHILDREN = 'REMOVE_ALL_SELECTED_TREE_ITEMS_AS_CHILDREN',

  CONFIGURE_ITEM = 'CONFIGURE_ITEM',
  VIEW_ITEM_DETAIL = 'VIEW_ITEM_DETAIL',

  UNLINK_SELECTED_ITEM_AS_CHILD_OF_PARENT = 'UNLINK_SELECTED_ITEM_AS_CHILD_OF_PARENT',
  CHANGE_PARENT_FOR_SELECTED_ITEM = 'CHANGE_PARENT_FOR_SELECTED_ITEM',
}

export abstract class TreeViewUtilityService extends AbstractService {
  protected items$: BehaviorSubject<any[]>

  protected constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)

    this.items$ = new BehaviorSubject([])
  }

  public getItemsObserver(): Observable<any[]> {
    return this.items$.asObservable()
  }

  public abstract createNodeItem(values)

  public abstract isItemBelongsToTree(item): boolean

  public allowShowActions(): boolean {
    return true
  }

  protected allowEmptyTreeToAddChildAction(): boolean {
    return true
  }

  protected allowRootToAddChildAction(): boolean {
    return true
  }

  protected allowRootToRemoveTreeAction() {
    return false
  }

  protected allowRootToConfigureItemAction() {
    return true
  }

  protected allowRootToChangeParentAction() {
    return false
  }

  protected allowRootToUnlinkChildAction() {
    return false
  }

  protected allowAddChildAction() {
    return true
  }

  protected allowRemoveTreeAction() {
    return true
  }

  protected allowConfigureItemAction() {
    return true
  }

  protected allowViewItemDetailAction() {
    return true
  }

  protected allowChangeParentAction() {
    return false
  }

  protected allowUnlinkChildAction() {
    return false
  }

  public isAllowedNodeAction(node: any, action = ''): boolean {
    if (!this.allowShowActions()) {
      return false
    }

    switch (action) {
      case TreeViewUtilityComponentActions.APPEND_CHILD_TO_SELECTED_ITEM:
        if (
          node['parent_id'] == null ||
          node['parent_id'] == this.getRootId()
        ) {
          return this.allowRootToAddChildAction()
        }
        if (!this.allowAddChildAction()) {
          return false
        }
        break
      case TreeViewUtilityComponentActions.REMOVE_ALL_SELECTED_TREE_ITEMS_AS_CHILDREN:
        if (
          node['parent_id'] == null ||
          node['parent_id'] == this.getRootId()
        ) {
          return this.allowRootToRemoveTreeAction()
        }
        if (!this.allowRemoveTreeAction()) {
          return false
        }
        break

      case TreeViewUtilityComponentActions.CONFIGURE_ITEM:
        if (
          node['parent_id'] == null ||
          node['parent_id'] == this.getRootId()
        ) {
          return this.allowRootToConfigureItemAction()
        }
        if (!this.allowConfigureItemAction()) {
          return false
        }
        break

      case TreeViewUtilityComponentActions.VIEW_ITEM_DETAIL:
        if (!this.allowViewItemDetailAction()) {
          return false
        }
        break

      case TreeViewUtilityComponentActions.CHANGE_PARENT_FOR_SELECTED_ITEM:
        if (
          node['parent_id'] == null ||
          node['parent_id'] == this.getRootId()
        ) {
          return this.allowRootToChangeParentAction()
        }
        if (!this.allowChangeParentAction()) {
          return false
        }
        break

      case TreeViewUtilityComponentActions.UNLINK_SELECTED_ITEM_AS_CHILD_OF_PARENT:
        if (
          node['parent_id'] == null ||
          node['parent_id'] == this.getRootId()
        ) {
          return this.allowRootToUnlinkChildAction()
        }
        if (!this.allowUnlinkChildAction()) {
          return false
        }
        break

      default:
    }

    return true
  }

  public getRootId() {
    return '__root__'
  }

  public getTreeRootNodeActionsButtons(root_id): string {
    return ''
  }

  public getTreeNodeActionsButtons(nodeItem): string {
    return ''
  }

  public abstract getItemId(item): any

  public abstract getItemNodeTitle(item): any

  public abstract getItemEditFormTitle(item): any

  public abstract getParentItemId(item): any

  public abstract compare(a, b)
}
