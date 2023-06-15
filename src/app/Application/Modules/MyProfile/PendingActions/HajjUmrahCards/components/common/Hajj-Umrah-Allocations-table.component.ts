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
import { StaticService } from '../../../../../../Modules/Common/Services/static.service'
import { HajjUmrahService } from '../../Hajj-Umrah.service'

@Component({
  selector: 'app-Hajj-Umrah-Allocations-table',
  templateUrl: './Hajj-Umrah-Allocations-table.component.html',
})
export class HajjUmrahAllocationsTableComponent
  extends DataTableWraperComponent
  implements OnInit
{
  @ViewChild('tableAllocations') tableAllocations: any
  @Input() tableToEmpty: Subject<string>
  @Input() name: string
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
  }

  ngOnInit(): void {
    super.ngOnInit()

    if (this.tableToEmpty) {
      this.tableToEmpty.subscribe((name) => {
        if (this.name === name) {
          this.tableAllocations.selected.splice(
            0,
            this.tableAllocations.selected.length,
          )
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
