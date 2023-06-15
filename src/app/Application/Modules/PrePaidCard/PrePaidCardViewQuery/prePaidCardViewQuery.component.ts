import { PrepaidCardItem } from './../PrePaidCardList/prePaidCardListModel'
import { PrePaidCardService } from '../prePaidCard.service'
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  EventEmitter,
  Output,
  ElementRef,
  Injector,
  Inject,
  LOCALE_ID,
} from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import {
  FormControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import {
  SearchData,
  PagedData,
  TransactionDetails,
  Combo,
  TargetsData,
  ListWithSelect,
  Category,
} from '../prePaidCardModels'
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap'
import { ChartType } from 'chart.js'
import { PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts'
import { AmountCurrencyPipe } from '../../../Components/common/Pipes/amount-currency.pipe'
import { AuthenticationService } from 'app/core/security/authentication.service'
import { PrePaidCardDetailService } from './prePaidCardDetail.service'
import {
  PrepaidCardDetailResponse,
  PrepaidCardDetailRequest,
} from './prePaidCardDetailModel'
import { User } from 'app/Application/Model/user'
import { StorageService } from 'app/core/storage/storage.service'
import { PrePaidCardResetPINService } from '../PrePaidCardReset/prePaidCardResetPin.service'
import { PrePaidCardBlockService } from '../PrePaidCardBlock/prePaidCardBlock.service'
import { PrePaidCardPaymentService } from '../PrePaidCardPayment/prePaidCardPayment.service'
import { StaticService } from '../../Common/Services/static.service'
import { Exception } from 'app/Application/Model/exception'

/* tslint:disable:max-classes-per-file */
@Component({
  selector: 'app-PrePaidCardViewQuery',
  templateUrl: './prePaidCardViewQuery.component.html',
  styleUrls: ['./prePaidCardViewQuery.component.scss'],
})
export class PrePaidCardViewQueryComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('detailsPageTable') table: any
  @ViewChild('mycanvas') canvas: ElementRef
  @ViewChild('myCarousel') myCarousel: NgbCarousel
  @Input() form: any
  @Output() onInit = new EventEmitter<Component>()
  public percentageProgressBar: string
  public detailsTable: any = {}
  public search: SearchData
  public sharedData: any
  public data: ListWithSelect = { id: 0, targetsData: [] }
  public detailsCard: TargetsData
  public subscriptionObtainData: Subscription
  public getDetailsTableSubscription: Subscription
  public getCategoriesSearchSubscription: Subscription
  public mensajeError: any = {}
  public tableDisplaySize = 20
  public detailsPage: PagedData<any>
  public isSearchCollapsed = true
  public detailsTab = false
  public chartsTab = true
  public tableSelectedRows: any = []
  public bsConfig: any
  public dataEvent: string
  public slides: ListWithSelect[] = []
  public showGraphicCenter = false
  public indexSelected: number
  public graphicPercentage = ''
  public totalTransactions = ''
  public fontSizeGraphicText = 35
  public paddingGraphicText = 40
  public datanew = ''
  public slidesNum: number
  public slidesActive: number
  public dataLoadedStart = true
  public routes: any[]
  public doughnutChartLabels = []
  public doughnutChartData = []
  public doughnutChartType: ChartType = 'doughnut'
  public DonutChartOptions: any = {}
  public colors = []
  public cardNumber: string
  public doughnutChartPlugins: PluginServiceGlobalRegistrationAndOptions[] = []
  //added
  private selectedPrepaidCard: PrepaidCardItem
  private prepaidCardList: PrepaidCardItem[]
  private selectedCardId: number
  private prepaidCardDetailList: PrepaidCardDetailResponse[] = []
  public detailsListIterable = [{}]
  public selectedCardSeq = ''
  public transactionsTab = true
  public statementsTab = false
  currentUser: User
  //Search fields
  public categories: Combo[]
  public comboCategories = []
  searchForm: FormGroup
  scrHeight: number
  scrWidth: number
  order: string
  orderType: string
  constructor(
    private AmountPipe: AmountCurrencyPipe,
    private fb: FormBuilder,
    @Inject(LOCALE_ID) private locale: string,
    private injector: Injector,
    public translate: TranslateService,
    public router: Router,
    public prePaidCardPaymentService: PrePaidCardPaymentService,
    public prePaidCardResetPINService: PrePaidCardResetPINService,
    public prePaidCardBlockService: PrePaidCardBlockService,
    public prePaidCardService: PrePaidCardService,
    public authenticationService: AuthenticationService,
    private prePaidCardDetailService: PrePaidCardDetailService,
    private storageService: StorageService,
    private staticService: StaticService,
  ) {
    super()
    this.detailsPage = new PagedData<any>()
    this.detailsPage.page.pageSize = 20
    this.initSearchForm()
    this.initBsConfig()
  }

  ngOnInit() {
    super.ngOnInit()
    this.currentUser = this.getCurrentUser()
    // Get selected card of the list
    this.selectedPrepaidCard = this.prePaidCardService.getPrepaidCardSelected();
    if (!this.selectedPrepaidCard) {
      const passedCard = history.state.selectedPrepaidCard;
      if (passedCard) {
        this.selectedCardId = history.state.selectedPrepaidCardIndex;
        this.selectedPrepaidCard = passedCard;
        this.prePaidCardService.setPrepaidCardList(history.state.prepaidList);
      }
    }
    if (!this.selectedPrepaidCard) {
      this.router.navigate(['/prepaid-card/prepaidcardlist'])
    } else {
      this.initializeTable()
      // Get prepaid cards list
      this.prepaidCardList = this.prePaidCardService.getPrepaidCardList()
      if (this.prepaidCardList) {
        this.selectedCardId = this.prepaidCardList.indexOf(
            this.selectedPrepaidCard,
        )
        // Llamada al prepaid card details
        this.getCardDetails(this.selectedCardId)
        this.indexSelected = this.selectedCardId
        // Llamada al static de categories
        this.subscriptions.push(
            this.staticService
                .getAllCombos(['prepaidCardsCategories'])
                .subscribe((res) => {
                  this.mapComboKeys(res)
                }),
        )
      }
      //obtain Prepaid Card Selected
      this.selectedPrepaidCard = this.prepaidCardList[this.selectedCardId]
      this.slidesNum = this.prepaidCardList.length
      this.onInit.emit(this as Component)
    }
  }

  private mapComboKeys(comboRes): void {
    const keys = Object.keys(comboRes[0].values)
    for (const i in keys) {
      if (keys[i]) {
        this.comboCategories.push({
          key: keys[i],
          value: comboRes[0].values[keys[i]],
        })
      }
    }
  }

  private initSearchForm(): void {
    this.searchForm = this.fb.group({
      dateForm: this.fb.group(
        {
          dateFrom: new FormControl(''),
          dateTo: [''],
        },
        { validator: this.rangeCrossValidation('dateFrom', 'dateTo') },
      ),
      category: [''],
      amountForm: this.fb.group(
        {
          amountFrom: [''],
          amountTo: [''],
        },
        { validator: this.rangeCrossValidation('amountFrom', 'amountTo') },
      ),
    })
  }

  private initBsConfig(): void {
    this.bsConfig = Object.assign(
      {},
      { containerClass: 'theme-dark-blue' },
      { dateInputFormat: 'D/MM/YYYY' },
      { showWeekNumbers: false },
    )
  }

  getRoutes(): any {
    this.routes = [
      ['prePaidCard.name', ['/businessCards/menu']],
      ['prePaidCard.prePaidCardList', ['/businessCards/menu']],
      ['prePaidCard.prepaidCardID - {{ this.sharedData.id }}'],
    ]
    return this.routes
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  onSlide(event) {
    const currentSlide = event.current
    const id = +currentSlide.split('_')[1]
    if (!this.prepaidCardDetailList[id]) {
      this.getCardDetails(id)
    } else {
      this.updateIdValues(id)
      this.prePaidCardService.resetDetailStatements()
      this.detailsPage = {
        page: {
          size: this.prepaidCardDetailList[this.selectedCardId].transactionsList
            ?.size,
          totalElements:
            this.prepaidCardDetailList[this.selectedCardId].transactionsList
              ?.total,
          totalPages:
            this.prepaidCardDetailList[this.selectedCardId].transactionsList
              ?.total / this.detailsPage.page.pageSize,
          pageNumber: 1,
          pageSize: this.detailsPage.page.pageSize,
        },
        data: this.prepaidCardDetailList[this.selectedCardId].transactionsList
          ?.items,
      }
    }
    if (event.source === 'arrowLeft') {
      const prueba = this.myCarousel.activeId.split('_')
      if (+prueba[1] === 0) {
        this.slidesActive = this.slidesNum - 1
      } else {
        this.slidesActive = +prueba[1] - 1
      }
    } else if (event.source === 'arrowRight') {
      const prueba = this.myCarousel.activeId.split('_')
      if (+prueba[1] === this.slidesNum - 1) {
        this.slidesActive = 0
      } else {
        this.slidesActive = +prueba[1] + 1
      }
    } else {
      const prueba = event.current.split('_')
      this.slidesActive = +prueba[1]
    }
    this.indexSelected = this.slidesActive
    this.resetTabs()
  }

  goPinManagement() {
    this.prePaidCardResetPINService.setResetOperationType(
      PrePaidCardResetPINService.RESET_OP_TYPE,
    )
    this.prePaidCardService.setPrepaidCardSelected(this.selectedPrepaidCard)
    this.router.navigate(['/prepaid-card/prepaidcardresetpin'])
  }

  cancelCard() {
    return
  }

  initializeTable() {
    this.detailsTable.batchList = []
    this.detailsTable.size = 0
    this.detailsTable.total = 0
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    this.detailsPage.page.pageNumber = dataTableEvent.offset
    const request = {
      cardSeqNumber: this.selectedCardSeq,
      page: this.detailsPage.page.pageNumber + 1,
      rows: this.detailsPage.page.pageSize,
    }

    this.subscriptions.push(
      this.prePaidCardDetailService
        .getCardDetails(request)
        .subscribe((result) => {
          if (
            result.hasOwnProperty('error') &&
            (<any>result).error instanceof Exception
          ) {
            return
          } else {
            this.detailsPage = {
              page: {
                size: result.transactionsList?.size,
                totalElements: result.transactionsList?.total,
                totalPages:
                  result.transactionsList?.total /
                  this.detailsPage.page.pageSize,
                pageNumber: this.detailsPage.page.pageNumber,
                pageSize: this.detailsPage.page.pageSize,
              },
              data: result.transactionsList?.items,
            }
          }
        }),
    )
  }
  getIdFunction() {
    return this.getId.bind(this)
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  getId(row) {
    return row['id']
  }

  onSelect({ selected }) {
    this.tableSelectedRows = []
    this.tableSelectedRows.splice(0, selected.length)
    this.tableSelectedRows.push(...selected)
    this.sharedData.selectedRows = this.tableSelectedRows
    return this.tableSelectedRows
  }

  obtainCategories(arrayTransactions: TransactionDetails[]): Category[] {
    const categoriesUnique = []
    const categoriesCombo = []
    const categories: Category[] = []
    let index = 0
    arrayTransactions.filter((item) => {
      const i = categoriesUnique.findIndex((x) => x.category == item.category)
      if (i <= -1) {
        categoriesUnique.push(item)
      }
      return null
    })
    for (const i in categoriesUnique) {
      if (categoriesUnique.hasOwnProperty(i)) {
        categoriesCombo.push(categoriesUnique[i].category)
        index++
      }
    }
    for (let i = 0; i < index; i++) {
      const data = new Category()
      data.key = i
      data.value = categoriesCombo[i]
      categories.push(data)
    }
    return categories
  }

  activeTransactions() {
    this.transactionsTab = true
    this.statementsTab = false
  }
  activeStatements() {
    this.transactionsTab = false
    this.statementsTab = true
  }
  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.errorCode
    this.mensajeError['description'] = res.errorDescription
  }

  public chartClicked(event): void {
    if (event.active.length > 0) {
      if (event.active[0]._index === 0) {
        this.showGraphicCenter = true
        this.graphicPercentage =
          this.sharedData.targetsData[this.indexSelected].spent25 + ' %'
        this.totalTransactions =
          this.AmountPipe.transform(
            this.sharedData.targetsData[this.indexSelected].spent25,
          ) + ' SAR '
      } else if (event.active[0]._index === 1) {
        this.showGraphicCenter = true
        this.graphicPercentage =
          this.sharedData.targetsData[this.indexSelected].spent25 + ' %'
        this.totalTransactions =
          this.AmountPipe.transform(
            this.sharedData.targetsData[this.indexSelected].spent25,
          ) + ' SAR '
      } else if (event.active[0]._index === 2) {
        this.showGraphicCenter = true
        this.graphicPercentage =
          this.sharedData.targetsData[this.indexSelected].spent25 + ' %'
        this.totalTransactions =
          this.AmountPipe.transform(
            this.sharedData.targetsData[this.indexSelected].spent25,
          ) + ' SAR '
      }
    } else {
      this.showGraphicCenter = false
      this.graphicPercentage = ''
      this.totalTransactions = ''
    }
  }

  previous() {
    const currentSlide = this.myCarousel.activeId.split('_')
    this.slidesActive = +currentSlide[1] - 1
    if (this.slidesNum && this.slidesActive >= 0) {
      this.myCarousel.select('slideId_' + this.slidesActive)
    } else {
      this.router.navigate([''])
    }
    this.indexSelected = this.slidesActive
  }

  next() {
    const currentSlide = this.myCarousel.activeId.split('_')
    this.slidesActive = +currentSlide[1] + 1
    if (this.slidesNum && this.slidesActive < this.slidesNum) {
      this.myCarousel.select('slideId_' + this.slidesActive)
    }
    this.indexSelected = this.slidesActive
  }

  nextDisabled(): boolean {
    let nextDisabled = true
    this.slidesActive = this.indexSelected
    if (
      this.prepaidCardList &&
      this.prepaidCardList.length > 1 &&
      this.selectedCardId != this.prepaidCardList.length - 1
    ) {
      nextDisabled = false
    }
    return nextDisabled
  }

  prevDisabled(): boolean {
    let prevDisabled = false
    if ((this.slidesNum && this.slidesActive === 0) || !this.slidesActive) {
      prevDisabled = true
    }
    return prevDisabled
  }

  private getCardDetails(id: number, searchInfo?: PrepaidCardDetailRequest) {
    this.updateIdValues(id)
    let request = new PrepaidCardDetailRequest()
    if (!searchInfo) {
      request = {
        cardSeqNumber: this.selectedCardSeq,
        amountFrom: null,
        amountTo: null,
        dateFrom: null,
        dateTo: null,
        category: null,
        page: 1,
        rows: this.detailsPage.page.pageSize,
      }
    } else {
      request = searchInfo
    }
    this.subscriptions.push(
      this.prePaidCardDetailService.getCardDetails(request).subscribe((res) => {
        if (res.errorCode != '0') {
          this.onError(res)
          // TODO: Change when WS works
          this.prepaidCardDetailList[this.selectedCardId] = res
          // this.prepaidCardDetailList[this.selectedCardId] = this.prePaidCardDetailService.mockDetailsResponse();
          this.detailsListIterable = this.createIterableComplexObject()
          this.goToSlide()
          this.prePaidCardService.resetDetailStatements()
          return
        } else {
          // TODO
          this.prepaidCardDetailList[this.selectedCardId] = res
          // // this.prepaidCardDetailList[this.selectedCardId] = this.prePaidCardDetailService.mockDetailsResponse();
          this.detailsListIterable = this.createIterableComplexObject()
          this.goToSlide()
          this.slidesNum = Object.keys(this.detailsListIterable).length
          this.prePaidCardService.resetDetailStatements()
          this.detailsPage = {
            page: {
              size: this.prepaidCardDetailList[this.selectedCardId]
                .transactionsList?.size,
              totalElements:
                this.prepaidCardDetailList[this.selectedCardId].transactionsList
                  ?.total,
              totalPages:
                this.prepaidCardDetailList[this.selectedCardId].transactionsList
                  ?.total / this.detailsPage.page.pageSize,
              pageNumber: 0,
              pageSize: this.detailsPage.page.pageSize,
            },
            data: this.prepaidCardDetailList[this.selectedCardId]
              .transactionsList?.items,
          }
        }
      }),
    )
  }

  private updateIdValues(id: number): void {
    this.selectedCardSeq = this.prepaidCardList[id].cardSeqNumber
    this.selectedCardId = id
    this.cardNumber = this.prepaidCardList[id].cardNumber
    this.selectedPrepaidCard = this.prepaidCardList[id]
  }

  private goToSlide(): void {
    this.myCarousel.activeId = 'slideId_' + this.selectedCardId
  }

  private createIterableComplexObject() {
    const composedDetailsList = [{}]
    this.prepaidCardList.forEach((e, i) => {
      composedDetailsList[i] = {
        details: this.prepaidCardDetailList[i],
        list: e,
      }
    })
    return composedDetailsList
  }

  private getCurrentUser(): User {
    const infoUser = JSON.parse(this.storageService.retrieve('currentUser'))
    return infoUser.user
  }

  private resetTabs() {
    this.transactionsTab = true
    this.statementsTab = false
  }

  private rangeCrossValidation(from: string, to: string): ValidatorFn {
    return (c: AbstractControl) => {
      if (
        c.get(from).value &&
        c.get(to).value &&
        c.get(from).value > c.get(to).value
      ) {
        return { errorRange: true }
      }
      return null
    }
  }

  public resetSearchForm(): void {
    this.searchForm.reset()
    this.onSearchForm()
  }

  public onSearchForm(): void {
    const amountForm: FormGroup = this.searchForm.get('amountForm') as FormGroup
    const dateForm: FormGroup = this.searchForm.get('dateForm') as FormGroup
    const requestSearchDetails: PrepaidCardDetailRequest = {
      amountFrom: amountForm.get('amountFrom').value,
      amountTo: amountForm.get('amountTo').value,
      dateFrom: dateForm.get('dateFrom').value,
      dateTo: dateForm.get('dateTo').value,
      category: this.searchForm.get('category').value,
      cardSeqNumber: this.selectedCardSeq,
    }
    this.getCardDetails(this.selectedCardId, requestSearchDetails)
  }
  showArrowsOption() {
    return this.prepaidCardList && this.prepaidCardList.length > 1
      ? true
      : false
  }
}
