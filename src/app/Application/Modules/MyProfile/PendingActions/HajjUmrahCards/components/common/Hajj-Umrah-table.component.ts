import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Subject } from 'rxjs'
import { StorageService } from '../../../../../../../core/storage/storage.service'
import { DataTableWraperComponent } from '../../../../../../Components/common/data-table-wrapper.component'
import { Page } from '../../../../../../Model/page'
import { PagedData } from '../../../../../../Model/paged-data'
import { StaticService } from '../../../../../../Modules/Common/Services/static.service'
import { HajjUmrahService } from '../../Hajj-Umrah.service'

@Component({
  selector: 'app-Hajj-Umrah-table',
  templateUrl: './Hajj-Umrah-table.component.html',
})
export class HajjUmrahTableComponent
  extends DataTableWraperComponent
  implements OnInit
{
  @ViewChild('table') table: any
  @ViewChild('tableExtraData') tableExtraData: any
  @Input() tableToEmpty: Subject<string>
  @Input() name: string
  @Input() items: any
  @Output() onRowSelected: EventEmitter<string> = new EventEmitter()

  filter: FormGroup
  combosSolicitados: string[] = ['hajjCardsStatusFilter']
  hajjCardsOptions = []
  bsConfig: any
  selected = []
  show = 'list'
  isSearchCollapsed = true
  isCollapsed = true
  searchList
  request
  searchForm: FormGroup

  viewCardOperationExtraInfo: PagedData<any>
  rowDetail: any
  expanded: false

  constructor(
    public translate: TranslateService,
    public hajjUmrahService: HajjUmrahService,
    public storageService: StorageService,
    public staticService: StaticService,
    public fb: FormBuilder,
  ) {
    super()
    this.isSearchCollapsed = true
    this.searchForm = this.fb.group({
      searchCategory: this.fb.control(null, []),
      cardNumber: this.fb.control(null, []),
      visa: this.fb.control(null, []),
      passportNumber: this.fb.control(null, []),
      operation: this.fb.control(null, []),
    })
    this.viewCardOperationExtraInfo = new PagedData<any>()
  }

  ngOnInit(): void {
    super.ngOnInit()

    if (this.tableToEmpty) {
      this.tableToEmpty.subscribe((name) => {
        if (this.name === name) {
          this.table.selected.splice(0, this.table.selected.length)
        }
      })
    }

    this.isSearchCollapsed = true
    // this.listOfStatus();
    this.operationType()
    // this.search();
    this.show = 'list'
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
    this.isSearchCollapsed = true
    this.isCollapsed = true
    this.searchForm.get('searchCategory').valueChanges.subscribe((value) => {
      this.searchForm.get('cardNumber').disable()
      this.searchForm.get('visa').disable()
      this.searchForm.get('passportNumber').disable()
      this.searchForm.get('operation').disable()

      switch (this.searchForm.get('searchCategory').value) {
        case 'cardReferenceNumber':
          this.searchForm.get('cardNumber').enable()
          this.searchForm.get('visa').setValue(null)
          this.searchForm.get('passportNumber').setValue(null)
          this.searchForm.get('operation').setValue(null)
          break
        case 'nationalId':
          this.searchForm.get('cardNumber').setValue(null)
          this.searchForm.get('visa').enable()
          this.searchForm.get('passportNumber').setValue(null)
          this.searchForm.get('operation').setValue(null)
          break
        case 'passportNumber':
          this.searchForm.get('cardNumber').setValue(null)
          this.searchForm.get('visa').setValue(null)
          this.searchForm.get('passportNumber').enable()
          this.searchForm.get('operation').setValue(null)
          break
        case 'status':
          this.searchForm.get('cardNumber').setValue(null)
          this.searchForm.get('visa').setValue(null)
          this.searchForm.get('passportNumber').setValue(null)
          this.searchForm.get('operation').enable()
          break
        default:
          this.searchForm.get('cardNumber').setValue(null)
          this.searchForm.get('visa').setValue(null)
          this.searchForm.get('passportNumber').setValue(null)
          this.searchForm.get('operation').setValue(null)
          break
      }
    })
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.table) {
      tablas.push(this.table)
    }
    if (this.table) {
      tablas.push(this.table)
    }
    if (this.tableExtraData) {
      tablas.push(this.tableExtraData)
    }
    return tablas
  }

  toggleExpandRow(row) {
    this.table.rowDetail.collapseAllRows()
    this.viewCardOperationExtraInfo.data = [row]
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 20
    this.viewCardOperationExtraInfo.page = page

    if (this.rowDetail != row) {
      this.table.rowDetail.toggleExpandRow(row)
      this.rowDetail = row
    } else {
      this.rowDetail = null
    }
  }

  toggleExpandRowMobile(row) {
    this.viewCardOperationExtraInfo.data = [row]
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 20
    this.viewCardOperationExtraInfo.page = page

    if (this.rowDetail != row) {
      this.rowDetail = row
    } else {
      this.rowDetail = null
    }
  }

  showExtraData(row) {
    return (
      row.operation === 'UD' ||
      row.operation === 'PR' ||
      row.operation === 'LD' ||
      row.operation === 'SC'
    )
  }

  getId(row) {
    return row['batchPk']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  operationType() {
    const combosSolicitados = ['hajjCardsOptions']
    this.staticService
      .getAllCombosAsArrays(combosSolicitados, true)
      .subscribe((comboData) => {
        const data: Object = comboData

        this.hajjCardsOptions = data['hajjCardsOptions']
      })
  }

  reset() {
    this.searchForm.get('searchCategory').setValue(null)
    this.searchForm.get('cardNumber').setValue(null)
    this.searchForm.get('visa').setValue(null)
    this.searchForm.get('passportNumber').setValue(null)
    this.searchForm.get('operation').setValue(null)
  }

  search() {
    let request: any = null

    switch (this.searchForm.get('searchCategory').value) {
      case 'cardReferenceNumber':
        request = {
          cardNumber: this.searchForm.get('cardNumber').value,
          operationNumber: 0,
          nationalId: null,
          order: null,
          orderType: null,
          page: 1,
          passportNumber: null,
          rows: 20,
          visaNumber: null,
          selectedIncentiveCards: this.searchForm.get('searchCategory').value,
          status: null,
        }
        break
      case 'nationalId':
        request = {
          cardNumber: null,
          operationNumber: 0,
          nationalId: this.searchForm.get('visa').value,
          order: null,
          orderType: null,
          page: 1,
          passportNumber: null,
          rows: 20,
          visaNumber: null,
          selectedIncentiveCards: this.searchForm.get('searchCategory').value,
          status: null,
        }
        break
      case 'status':
        request = {
          cardNumber: null,
          operationNumber: 0,
          nationalId: null,
          order: null,
          orderType: null,
          page: 1,
          passportNumber: null,
          rows: 20,
          visaNumber: null,
          selectedIncentiveCards: this.searchForm.get('searchCategory').value,
          status: this.searchForm.get('operation').value,
        }
        break
      case 'passportNumber':
        request = {
          cardNumber: null,
          operationNumber: 0,
          nationalId: null,
          order: null,
          orderType: null,
          page: 1,
          passportNumber: this.searchForm.get('passportNumber').value,
          rows: 20,
          visaNumber: null,
          selectedIncentiveCards: this.searchForm.get('searchCategory').value,
          status: null,
        }
        break
      default:
        break
    }
    if (request) {
      this.hajjUmrahService.getPending(request).subscribe(
        (data) => {
          this.searchList = data
          //
        },
        (err) => {
          //console.log(err);
        },
      )
    }
  }

  selectOperation() {
    //this.hajjCardsOperations = this.operation;
    //console.log(this.operation);
    this.hajjUmrahService.setopertionType(
      this.searchForm.get('operation').value,
    )
  }

  emitChange() {
    this.onRowSelected.emit(this.name)
  }
}
