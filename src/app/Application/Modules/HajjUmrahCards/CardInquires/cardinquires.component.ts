import { DatePipe } from '@angular/common'
import {
  Component,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../core/storage/storage.service'
import { PagedData } from '../../../Model/paged-data'
// import { StaticService } from '../../../Services/static.service';
import { StaticService } from '../static.service'
import { CardinquiresService } from './cardinquires.service'

@Component({
  selector: 'app-cardinquires',
  templateUrl: './cardinquires.component.html',
  styleUrls: ['./cardinquires.component.scss'],
})
export class CardinquiresComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('table') table: any

  listFilesPage: PagedData<any>

  combosSolicitados: string[] = ['hajjCardsStatusFilter']

  bsConfig: any

  cardNumber
  visa
  status
  tableSelected = []
  show = 'list'
  allStatus = []
  allStatusCode = {}

  fileDetails
  searchList = new PagedData()
  viewProcessedFilesPage: PagedData<any>
  request
  requestData = []
  institution
  statementValue
  searchForm: FormGroup
  statementForm: FormGroup

  subscriptions: Subscription[] = []

  constructor(
    public translate: TranslateService,
    private formBuilder: FormBuilder,
    public cardinquiresservice: CardinquiresService,
    public staticService: StaticService,
    public storageService: StorageService,
    public datePipe: DatePipe,
    public injector: Injector,
  ) {
    super()
    this.listFilesPage = new PagedData<any>()
    this.institution = JSON.parse(this.storageService.retrieve('currentUser'))[
      'company'
    ]['institution']

    this.searchForm = this.formBuilder.group({
      searchCategory: [],
      cardNumber: [],
      visa: [],
      status: [],
    })

    this.statementForm = this.formBuilder.group({
      dateFrom: [],
      dateTo: [],
    })

    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
  }

  ngOnInit() {
    super.ngOnInit()

    this.searchForm.controls.searchCategory.setValue('')
    this.show = 'list'
    this.request = {
      page: 1,
      rows: 20,
    }

    this.subscriptions.push(
      this.staticService
        .getAllCombos(this.combosSolicitados)
        .subscribe((result) => {
          const dataC = result
          const valores =
            dataC[this.combosSolicitados.indexOf('hajjCardsStatusFilter')][
              'values'
            ]
          Object.keys(valores).map((key, index) => {
            this.allStatus.push({ key, value: valores[key] })
            this.allStatusCode[key] = valores[key]
          })
          this.getList()
        }),
    )

    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event) => {
        this.staticService
          .getAllCombos(this.combosSolicitados)
          .subscribe((result) => {
            const dataC = result
            const valores =
              dataC[this.combosSolicitados.indexOf('hajjCardsStatusFilter')][
                'values'
              ]
            Object.keys(valores).map((key, index) => {
              this.allStatus.push({ key, value: valores[key] })
              this.allStatusCode[key] = valores[key]
            })
          })
        this.getList()
      }),
    )

    this.subscriptions.push(
      this.searchForm.controls.searchCategory.valueChanges.subscribe(
        (event) => {
          if (
            this.searchForm.controls.searchCategory.value ===
            'cardReferenceNumber'
          ) {
            this.searchForm.controls.visa.reset()
            this.searchForm.controls.visa.disable()
            this.searchForm.controls.status.reset()
            this.searchForm.controls.status.disable()
            this.searchForm.controls.cardNumber.enable()
          } else if (
            this.searchForm.controls.searchCategory.value === 'nationalId'
          ) {
            this.searchForm.controls.cardNumber.reset()
            this.searchForm.controls.cardNumber.disable()
            this.searchForm.controls.status.reset()
            this.searchForm.controls.status.disable()
            this.searchForm.controls.visa.enable()
          } else if (
            this.searchForm.controls.searchCategory.value === 'status'
          ) {
            this.searchForm.controls.cardNumber.reset()
            this.searchForm.controls.cardNumber.disable()
            this.searchForm.controls.visa.reset()
            this.searchForm.controls.visa.disable()
            this.searchForm.controls.status.enable()
          } else {
            this.searchForm.controls.cardNumber.reset()
            this.searchForm.controls.cardNumber.disable()
            this.searchForm.controls.visa.reset()
            this.searchForm.controls.visa.disable()
            this.searchForm.controls.status.reset()
            this.searchForm.controls.status.disable()
          }
        },
      ),
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  clearValue() {
    this.searchForm.controls.searchCategory.setValue('')
    this.requestData = []
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.table) {
      tablas.push(this.table)
    }
    return tablas
  }

  getList() {
    let request: any

    switch (this.searchForm.controls.searchCategory.value) {
      case 'cardReferenceNumber':
        request = {
          cardnumber: this.searchForm.controls.cardNumber.value,
          nationalId: null,
          page: this.request.page,
          rows: this.request.rows,
          selectedIncentiveCards: this.searchForm.controls.searchCategory.value,
          status: null,
          order: null,
          orderType: null,
          searchFlag: true,
        }
        break
      case 'nationalId':
        request = {
          cardnumber: null,
          nationalId: this.searchForm.controls.visa.value,
          page: this.request.page,
          rows: this.request.rows,
          selectedIncentiveCards: this.searchForm.controls.searchCategory.value,
          status: null,
          order: null,
          orderType: null,
          searchFlag: true,
        }
        break
      case 'status':
        request = {
          cardnumber: null,
          nationalId: null,
          page: this.request.page,
          rows: this.request.rows,
          selectedIncentiveCards: this.searchForm.controls.searchCategory.value,
          status: this.searchForm.controls.status.value,
          order: null,
          orderType: null,
          searchFlag: true,
        }
        break
      default:
        request = {
          cardnumber: null,
          nationalId: null,
          page: this.request.page,
          rows: this.request.rows,
          selectedIncentiveCards: 'status',
          status: 'A',
          order: null,
          orderType: null,
          searchFlag: true,
        }
        break
    }

    this.cardinquiresservice.listData(request).subscribe(
      (data) => {
        this.searchList = data
        this.searchList.data.forEach((item) => {
          item['statusPrint'] = this.allStatusCode[item['status']]
            ? this.allStatusCode[item['status']]
            : item['status']
        })
      },
      (err) => {
        //console.log(err);
      },
    )
  }

  search() {
    this.request.page = 1
    this.request.rows = this.searchList.page.pageSize
    this.getList()
  }

  reset() {
    this.searchForm.controls.searchCategory.reset()
    this.searchForm.controls.cardNumber.reset()
    this.searchForm.controls.status.reset()
    this.searchForm.controls.visa.reset()
    this.request.page = 1
    this.request.rows = 20
    this.getList()
  }

  convert(str) {
    if (str) {
      const date = new Date(str),
        mnth = ('0' + (date.getMonth() + 1)).slice(-2),
        day = ('0' + date.getDate()).slice(-2)
      return [date.getFullYear(), mnth, day].join('-')
    } else {
      return ''
    }
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }
    this.request.page = dataTableEvent.offset + 1
    this.request.rows = this.searchList.page.pageSize
    this.getList()
  }

  filterStatement() {
    this.showDetail(this.requestData)
  }

  resetStatement() {
    // reset filters
    this.statementForm.controls.dateFrom.reset()
    this.statementForm.controls.dateTo.reset()
    this.showDetail(this.requestData)
  }

  showDetail(row) {
    const dateFrom = this.statementForm.get('dateFrom').value
    const dateTo = this.statementForm.get('dateTo').value

    const body = {
      dateFrom: dateFrom
        ? this.datePipe.transform(dateFrom, 'yyyy-MM-dd')
        : null,
      dateTo: dateTo ? this.datePipe.transform(dateTo, 'yyyy-MM-dd') : null,
      selected: row,
    }

    this.cardinquiresservice.getFileDetail(body).subscribe(
      (data) => {
        this.fileDetails = data
        this.statementValue = data.statement
        this.requestData = row
      },
      (err) => {
        //console.log(err);
      },
    )
    this.show = 'detail'
  }

  backToList() {
    this.show = 'list'
    this.statementForm.controls.dateFrom.reset()
    this.statementForm.controls.dateTo.reset()
    this.clearValue()
  }
}
