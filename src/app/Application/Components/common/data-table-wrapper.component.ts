import {
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  Directive,
} from '@angular/core'
import { DatatableMobileComponent } from '../../../core/responsive/datatable-mobile.component'

@Directive()
export class DataTableWraperComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('table') table: any
  @Input() modal
  @Input() items
  @Input() futureLevels
  @Input() externalPagination
  @Input() selectable
  @Input() selectedList
  @Input() tableDisplaySize
  @Input() totalSize
  @Input() selected
  @Output() setPage = new EventEmitter<any>()
  @Output() onSelect = new EventEmitter<any>()
  @Output() changeDisplaySize = new EventEmitter<any>()

  constructor() {
    super()
  }

  ngOnInit(): void {
    super.ngOnInit()
    if (!this.tableDisplaySize) {
      this.tableDisplaySize = 50
    }
    if (!this.totalSize) {
      this.totalSize = this.items.length
    }
    if (!this.selectedList) {
      this.selectedList = []
    }
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  openModal(
    row: { futureSecurityLevelsDTOList: any; securityLevelsDTOList: any },
    popup: { openModal: { (arg0: any): void; (arg0: any): void } },
  ) {
    if (this.futureLevels) {
      popup.openModal(row.futureSecurityLevelsDTOList)
    } else {
      popup.openModal(row.securityLevelsDTOList)
    }
  }

  setInnerPage(event: any) {
    if (this.externalPagination) {
      this.setPage.emit(event)
    }
  }

  onInnerSelect(event: any) {
    if (this.externalPagination) {
      this.onSelect.emit(event)
    }
  }

  onChangeSize(event: any) {
    this.tableDisplaySize = event
    if (this.externalPagination) {
      this.changeDisplaySize.emit(event)
    }
  }
}
