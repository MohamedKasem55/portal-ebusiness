import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { AbstractAppComponent } from '../Abstract/abstract-app.component'
import {
  TreeViewUtilityComponentActions,
  TreeViewUtilityService,
} from './tree-view-utility.service'

@Component({
  selector: 'app-tree-view-utility',
  templateUrl: './tree-view-utility.component.html',
  styleUrls: ['./tree-view-utility.component.scss'],
})
export class TreeViewUtilityComponent
  extends AbstractAppComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked
{
  @Input() service: TreeViewUtilityService

  nodes: any[]

  markers: any[]

  chart: any = {
    title: '',
    type: '',
    data: [],
    columnNames: [],
    options: {},
    width: 0,
    height: 0,
  }

  @Output() onTreeAction = new EventEmitter<any>()

  constructor(public translate: TranslateService, private elRef: ElementRef) {
    super(translate)

    this.markers = []

    this.chart.title = ''
    this.chart.type = 'OrgChart'
    this.chart.data = []
    this.chart.columnNames = ['Name', 'Manager', 'Tooltip']
    this.chart.options = {
      allowHtml: true,
    }
    //this.chart.width = 550;
    //this.chart.height = 400;
  }

  ngOnInit() {
    super.ngOnInit()

    this.resetNodes()

    this.subscriptions.push(
      this.service.getItemsObserver().subscribe((items: any[]) => {
        const nodes = this.createTreeStructure(items)

        this.nodes = nodes

        //-----------------------------------------

        // this.createMarkers();

        //-----------------------------------------

        this.chart.data = []

        if (this.nodes.length > 1) {
          this.nodes
            .filter((elem) => !elem['is_root'])
            .forEach((nodeItem) => {
              const item = nodeItem['item']

              const item_id = this.service.getItemId(item)
              const item_name = this.service.getItemNodeTitle(item)
              let parent_id = this.service.getParentItemId(item)

              if (parent_id == this.service.getRootId() || parent_id == null) {
                parent_id = ''
              }

              let actions_buttons = ''

              let item_title =
                '<span style="white-space: nowrap;">' + item_name + '</span>'

              if (this.service.allowShowActions()) {
                if (
                  this.service.isAllowedNodeAction(
                    nodeItem,
                    TreeViewUtilityComponentActions.VIEW_ITEM_DETAIL,
                  )
                ) {
                  item_title =
                    '<a data-id="' +
                    item_id +
                    '" data-action="' +
                    TreeViewUtilityComponentActions.VIEW_ITEM_DETAIL +
                    '" ' +
                    'class="human-selectable TREE_VIEW_UTILITY_ACTION" style="margin: 5px;">' +
                    '<span style="white-space: nowrap">' +
                    item_name +
                    '</span>' +
                    '</a>'
                }

                actions_buttons = '<div style="white-space: nowrap;">'

                actions_buttons +=
                  this.service.getTreeNodeActionsButtons(nodeItem)

                actions_buttons += '</div>'
              }

              this.chart.data.push([
                {
                  v: item_id,
                  f: item_title + actions_buttons,
                },
                parent_id,
                item_name,
              ])
            })
        } else {
          const item_id = this.service.getRootId()
          const item_title = ''

          let actions_buttons = ''

          if (this.service.allowShowActions()) {
            actions_buttons = '<div>'

            actions_buttons +=
              this.service.getTreeRootNodeActionsButtons(item_id)

            actions_buttons += '</div>'

            this.chart.data.push([
              {
                v: item_id,
                f: item_title + actions_buttons,
              },
              null,
              item_title,
            ])
          }
        }
      }),
    )
  }

  ngAfterViewInit(): void {}

  ngAfterViewChecked(): void {
    this.elRef.nativeElement
      .querySelectorAll('.TREE_VIEW_UTILITY_ACTION')
      .forEach((element) => {
        if (!element.dataset.configured) {
          element.dataset.configured = true
          element.addEventListener('click', (evt) => {
            const target = evt.currentTarget
            const item_id = target.dataset.id
            const action = target.dataset.action
            if (this.service.getRootId() == item_id) {
              this.onNodeAction(this.findRootNode(), action)
            } else {
              this.nodes
                .filter((elem) => !elem['is_root'])
                .filter(
                  (elem) => this.service.getItemId(elem['item']) == item_id,
                )
                .forEach((nodeClicked) => {
                  this.onNodeAction(nodeClicked, action)
                })
            }
          })
        }
      })
  }

  ngOnDestroy(): void {
    super.ngOnDestroy()
  }

  resetNodes() {
    this.nodes = []
  }

  protected createNode(item, is_root = false) {
    const id =
      item == null || is_root
        ? this.service.getRootId()
        : '_' + this.service.getItemId(item)
    const parent_id =
      item == null && is_root ? null : this.service.getParentItemId(item)
    const title =
      item == null || is_root ? '' : this.service.getItemNodeTitle(item)

    return {
      id,
      item,
      title,
      parent_id:
        parent_id != null && parent_id != ''
          ? '_' + parent_id
          : !is_root
          ? this.service.getRootId()
          : null,
      is_root,
      children_count: 0,
      tree_level: null,
      tree_position: null,
      tree_lft: null,
      tree_rgt: null,
    }
  }

  protected addNode(item, is_root = false) {
    const node = this.createNode(item, is_root)
    this.nodes.push(node)
    return this
  }

  protected findNodeById(id) {
    const node = this.nodes
      //.filter((elem) => !elem['is_root'])
      .filter((elem) => elem['id'] == id)
    return node.length > 0 ? node[0] : null
  }

  protected findRootNode() {
    const rootNode = this.findNodeById(this.service.getRootId())
    return rootNode
  }

  protected findChildrenByParentId(parent_id) {
    parent_id = parent_id != null ? parent_id : this.service.getRootId()
    let children = this.nodes
      //.filter((elem) => !elem['is_root'])
      .filter((elem) => elem['parent_id'] == parent_id)
    // order by some criteria
    children = children.sort((elemA, elemB) =>
      this.service.compare(elemA['item'], elemB['item']),
    )
    return children
  }

  //----------------------------------------------------

  protected updatePositionForSiblingsElements(item_id) {
    const node = this.findNodeById(item_id)

    let siblings = this.findChildrenByParentId(node['parent_id'])

    siblings = siblings.sort((elemA, elemB) =>
      this.service.compare(elemA['item'], elemB['item']),
    )

    for (let i = 0; i < siblings.length; i++) {
      siblings[i]['position'] = i
    }
  }

  protected updateLevelForSuperChildrenByParentNode(rootNode) {
    let tmp = []
    let i = 0

    // add first node's children to queue
    let children = this.findChildrenByParentId(rootNode['id'])
    tmp = tmp.concat(children)
    rootNode['children_count'] = children.length

    // iterate on queue

    while (i < tmp.length) {
      const node = tmp[i]
      const parent = this.findNodeById(node['parent_id'])
      node['tree_level'] = parent['tree_level'] + 1

      // add node's children to queue

      children = this.findChildrenByParentId(node['id'])
      tmp = tmp.concat(children)
      node['children_count'] = children.length

      // prepare next iteration
      i++
    }
  }

  protected updateTreeInfoByParentNodeRecursive(node, cont = 0) {
    node['tree_lft'] = cont

    cont++

    const children = this.findChildrenByParentId(node['id'])

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < children.length; i++) {
      cont = this.updateTreeInfoByParentNodeRecursive(children[i], cont)
    }

    // this is unnecessary
    this.updatePositionForSiblingsElements(node['id'])

    node['tree_rgt'] = cont - 1

    return cont
  }

  protected updateTreeInfoForAllElements() {
    const root = this.findRootNode()

    this.updateTreeInfoByParentNodeRecursive(root)

    this.updateLevelForSuperChildrenByParentNode(root)
  }

  protected getTreeNodes() {
    const treeNodes = this.nodes
      //.filter((node) => !node['is_root'])
      .sort((elemA, elemB) => {
        // a debe ser menor que b
        if (elemA['tree_lft'] < elemB['tree_lft']) {
          return -1
        }
        // a debe ser mayor que b
        if (elemA['tree_lft'] > elemB['tree_lft']) {
          return 1
        }
        // a debe ser igual b
        return 0
      })
    return treeNodes
  }

  //------------------------------------------------

  protected createTreeStructure(items: any[]) {
    this.resetNodes()
    this.addNode(null, true) // root element
    items
      .filter((item) => this.service.isItemBelongsToTree(item))
      .forEach((item) => {
        this.addNode(item)
      })
    this.updateTreeInfoForAllElements()
    return this.getTreeNodes()
  }

  //------------------------------------------------

  protected findTreeBySuperParentId(parent_id, include_parent = true) {
    const parentNode = this.findNodeById(parent_id)

    let superChildren = this.nodes.filter(
      (node) =>
        parentNode['tree_lft'] <= node['tree_lft'] &&
        node['tree_lft'] <= parentNode['tree_rgt'],
    )

    if (!include_parent) {
      return superChildren.filter((node) => node.id != parent_id)
    }

    superChildren = superChildren.sort((elemA, elemB) => {
      // a debe ser menor que b
      if (elemA['tree_lft'] < elemB['tree_lft']) {
        return -1
      }
      // a debe ser mayor que b
      if (elemA['tree_lft'] > elemB['tree_lft']) {
        return 1
      }
      // a debe ser igual b
      return 0
    })

    return superChildren
  }

  protected findTreeExceptWithSuperParentId(parent_id) {
    const parentNode = this.findNodeById(parent_id)

    let noSuperChildren = this.nodes.filter(
      (node) =>
        node['tree_lft'] > parentNode['tree_rgt'] ||
        node['tree_lft'] < parentNode['tree_lft'],
    )

    noSuperChildren = noSuperChildren.sort((elemA, elemB) => {
      // a debe ser menor que b
      if (elemA['tree_lft'] < elemB['tree_lft']) {
        return -1
      }
      // a debe ser mayor que b
      if (elemA['tree_lft'] > elemB['tree_lft']) {
        return 1
      }
      // a debe ser igual b
      return 0
    })

    return noSuperChildren
  }

  onNodeAction(node: any, action: TreeViewUtilityComponentActions) {
    const rootNodes = this.findChildrenByParentId(null)
    const rootItems = []
    rootNodes.forEach((nodeCh) => {
      rootItems.push(nodeCh['item'])
    })

    const eventData = {
      action,
      item: !node['is_root'] ? node['item'] : null,
      items: [],
      root: rootItems,
    }

    switch (action) {
      case TreeViewUtilityComponentActions.VIEW_ITEM_DETAIL:
        break
      case TreeViewUtilityComponentActions.APPEND_CHILD_TO_SELECTED_ITEM:
        const nodes1 = this.findChildrenByParentId(
          !node['is_root'] ? node['id'] : null,
        )
        nodes1.forEach((tnode) => {
          eventData.items.push(tnode['item'])
        })
        break
      case TreeViewUtilityComponentActions.CHANGE_PARENT_FOR_SELECTED_ITEM:
        const nodes2 = this.findTreeExceptWithSuperParentId(node['id'])
        nodes2.forEach((tnode) => {
          eventData.items.push(tnode['item'])
        })
        break
      case TreeViewUtilityComponentActions.UNLINK_SELECTED_ITEM_AS_CHILD_OF_PARENT:
        break
      case TreeViewUtilityComponentActions.REMOVE_ALL_SELECTED_TREE_ITEMS_AS_CHILDREN:
        const nodes4 = this.findTreeBySuperParentId(node['id'])
        nodes4.forEach((tnode) => {
          eventData.items.push(tnode['item'])
        })
        break
      case TreeViewUtilityComponentActions.CONFIGURE_ITEM:
        break
      default:
    }

    this.onTreeAction.emit(eventData)
  }

  /*
    createMarkers() {

        const markers = [];

        for (let i = 0; i < this.nodes.length + 1; i++) {
            markers[i] = [];
            for (let j = 0; j < this.nodes.length + 1; j++) {
                markers[i][j] = '0';
            }
        }

        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const node_level = node['tree_level'];
            const node_lft = node['tree_lft'];
            markers[node_lft][node_level] = '1';
            markers[node_lft][node_level - 1] = '1';
            let find = false;

            for (let j = node_lft - 1; j >= 0 && !find; j--) {
                if (markers[j][node_level - 1] != '1') {
                    markers[j][node_level - 1] = '1';
                } else {
                    find = true;
                }
            }
        }

        this.markers = markers;
    }

    getLevelIteratorArray(node) {
        const node_level = node['tree_level'];
        return node_level >= 2 ? Array(node_level - 1) : [];
    }
     */
}
