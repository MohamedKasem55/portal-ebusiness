import {
  AfterViewChecked, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Injector,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { User } from 'app/Application/Model/user'
import { AuthenticationService } from 'app/core/security/authentication.service'
import { StorageService } from 'app/core/storage/storage.service'
import { ChartType } from 'chart.js'
import { PluginServiceGlobalRegistrationAndOptions } from 'ng2-charts'
import { Subscription } from 'rxjs'
import { HijraDateFormatPipe } from '../../../Components/common/Pipes/hijra-date-format-pipe'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { AmountCurrencyPipe } from '../../../Components/common/Pipes/amount-currency.pipe'
import { StaticService } from '../../Common/Services/static.service'
import {
  BusinessCardsDetailsRequest,
  BusinessCardsDetailsResponse,
  BusinessCardsList,
  BusinessCardsListItems,
  BusinessDetailAndList,
  TransactionDetails,
} from '../commercial-cards-models'
import { BlockCardsService } from '../BlockCards/blockCards.service'
import { CommercialCardsService } from '../commercial-cards.service'
import { ResetPINService } from '../ResetPIN/resetPIN.service'
import { Category, PagedData } from './viewQueryCards.models'
import { ViewQueryCardsService } from './viewQueryCards.service'
import { Exception } from 'app/Application/Model/exception'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { CredentialsObject, ViewCardCredentialsData } from '../../ViewCardCredentials/view-card-credentials.models'
import { ViewCardCredentialsService } from '../../Common/Services/viewCardCredentials/view-card-credentials.service'

@Component({
  selector: 'app-ViewQueryCards',
  templateUrl: './viewQueryCards.component.html',
  styleUrls: ['./viewQueryCards.component.scss'],
})
export class ViewQueryCardsComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('detailsPageTable') table: any
  @ViewChild('displayCardCredential', { static: true }) displayCardCredential: ModalDirective
  @ViewChild('mycanvas') canvas: ElementRef
  @Input() form: any
  @Output() onInit = new EventEmitter<Component>()
  @ViewChild('pin1', { read: ElementRef }) pin1: ElementRef
  @ViewChild('pin2', { read: ElementRef }) pin2: ElementRef
  @ViewChild('pin3', { read: ElementRef }) pin3: ElementRef
  @ViewChild('pin4', { read: ElementRef }) pin4: ElementRef
  // public otpViewCard = 30 //medio minuto
  public isSole: boolean = false;
  public viewCredentialGroupIsActive: boolean = false
  public params: ViewCardCredentialsData = new ViewCardCredentialsData();
  public countDown: boolean = false;
  public requestValidate: RequestValidate = new RequestValidate();
  public timer: number = 3;
  public timerInterval: any;
  public confirmResponse: any = {}
  public display: any;
  public percentageProgressBar: string
  public detailsTable: any = {}
  public sharedData: any
  public subscriptionObtainData: Subscription
  public getDetailsTableSubscription: Subscription
  public getCategoriesSearchSubscription: Subscription
  public subscriptions: Subscription[] = []
  public mensajeError: any = {}
  public tableDisplaySize = 15
  public transactionsDisplaySize = 15
  public detailsPage: PagedData<any>
  public isSearchCollapsed = true
  public detailsTab = false
  public chartsTab = false
  public transactionsTab = true
  public tableSelectedRows: any = []
  public bsConfig: any
  public showGraphicCenter = false
  public indexSelected: number
  public graphicPercentage = ''
  public totalTransactions = ''
  public fontSizeGraphicText = 35
  public paddingGraphicText = 40
  public cardSeqNum: string
  activeTab: number = 1

  public doughnutChartLabels = []
  public doughnutChartData = []
  public doughnutChartType: ChartType = 'doughnut'
  public DonutChartOptions: any = {}
  public colors = []
  public doughnutChartPlugins: PluginServiceGlobalRegistrationAndOptions[] = []
  businessCardsList: BusinessCardsListItems[]
  private currentUser: User
  selectedcard: BusinessCardsListItems
  selectedcardDetails: BusinessCardsDetailsResponse
  showTabs: boolean = false
  //Search fields
  public categories: any
  public transactionTypes: any
  searchForm: FormGroup
  scrHeight: number
  scrWidth: number

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    let legend: boolean
    this.scrHeight = window.innerHeight
    this.scrWidth = window.innerWidth
    this.graphicPercentage = ''
    this.totalTransactions = ''
    if (this.scrWidth > 415) {
      legend = true
      this.fontSizeGraphicText = 35
      this.paddingGraphicText = 40
      this.fillLegendOptions(legend)
    } else {
      legend = false
      this.fontSizeGraphicText = 8
      this.paddingGraphicText = 10
      this.fillLegendOptions(legend)
    }
  }
  constructor(
    private AmountPipe: AmountCurrencyPipe,
    private fb: FormBuilder,
    private renderer: Renderer2,
    @Inject(LOCALE_ID) private locale: string,
    public viewQueryCardsService: ViewQueryCardsService,
    public viewCardCredentialsService: ViewCardCredentialsService,
    public commercialCardsService: CommercialCardsService,
    public blockCardsService: BlockCardsService,
    private injector: Injector,
    public translate: TranslateService,
    public router: Router,
    public resetPINService: ResetPINService,
    public authenticationService: AuthenticationService,
    public storageService: StorageService,
    private staticService: StaticService,
    private cdr: ChangeDetectorRef
  ) {
    super()

    this.detailsPage = new PagedData<any>()
    this.searchForm = this.fb.group({
      dateForm: this.fb.group(
        {
          dateFrom: [''],
          dateTo: [''],
        },
        { validator: this.rangeCrossValidation('dateFrom', 'dateTo') },
      ),
      category: [''],
      transactionType: [''],
      amountForm: this.fb.group(
        {
          amountFrom: [''],
          amountTo: [''],
        },
        { validator: this.rangeCrossValidation('amountFrom', 'amountTo') },
      ),
    })
    this.bsConfig = Object.assign(
      {},
      { containerClass: 'theme-dark-blue' },
      { dateInputFormat: 'D/MM/YYYY' },
      { showWeekNumbers: false },
    )
    this.getScreenSize()
    this.form = fb.group({
      newPin: fb.group({
        newPin1: ['', Validators.required],
        newPin2: ['', Validators.required],
        newPin3: ['', Validators.required],
        newPin4: ['', Validators.required],
      }),
    })

  }

  ngOnInit() {
    super.ngOnInit()
    const userStorage = JSON.parse(this.storageService.retrieve('currentUser'))
    this.currentUser = userStorage.user
    // Get card list
    this.businessCardsList = this.commercialCardsService.getBusinessCardsList()
    if (!this.businessCardsList) {
      this.subscriptions.push(
        this.commercialCardsService.getList().subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.businessCardsList = result.businessCardsList.items
            if (this.businessCardsList.length > 0) {
              this.indexSelected = 0
              this.selectedcard = this.businessCardsList[0]
            }
            this.mensajeError = {}
            this.initializeScreen()
          }
        }),
      )
    } else {
      if (!this.indexSelected) {
        this.indexSelected = 0
      }
      this.selectedcard = this.businessCardsList[this.indexSelected]
      this.initializeScreen()
    }
    this.isSolePropietorCompany()
    this.viewCredentialGroupIsActive = this.getViewCredentialGroup()
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
  initializeScreen() {
    // Llenar dropdowns search filter
    this.getAllCombos()
    // Hacer llamada al Details
    this.getCardDetails(this.indexSelected)
    this.mensajeError = {}
    this.fillGraphicCenter()

    this.onInit.emit(this as Component)
    this.initializeTable()
    this.initializeGraphic()
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
    for (const sub of this.subscriptions) {
      sub.unsubscribe()
    }
  }
  initializeGraphic(): void {
    // const leisureTransactions = data.targetsData[this.indexSelected].leisureTransactions;
    // const purchaseTransactions = data.targetsData[this.indexSelected].purchaseTransactions;
    // const foodTransactions = data.targetsData[this.indexSelected].foodTransactions;
    const leisureTransactions = 120
    const purchaseTransactions = 150
    const foodTransactions = 180

    this.doughnutChartLabels = [
      'leisureTransactions',
      'purchaseTransactions',
      'foodTransactions',
    ]
    this.doughnutChartData = [
      leisureTransactions,
      purchaseTransactions,
      foodTransactions,
    ]
    this.colors = [
      {
        borderColor: '#FBF9F9',
        backgroundColor: [
          '#58D3F7',
          '#9fbfdf',
          '#1f47ae',
          '#81DAF5',
          '#0489B1',
          '#045FB4',
        ],
        pointBackgroundColor: '#FBF9F9',
        pointBorderColor: '#FBF9F9',
      },
    ]
  }

  goSetResetPin(cardSelected: BusinessDetailAndList) {
    this.resetPINService.setResetOperationType(ResetPINService.RESET_OP_TYPE)
    this.commercialCardsService.setBusinessCardsDetailsAndList(cardSelected)
    this.router.navigate(['/businessCards/resetpin'])
  }

  goPayments(cardSelected: BusinessDetailAndList) {
    this.commercialCardsService.setBusinessCardsDetailsAndList(cardSelected)
    this.router.navigate(['/businessCards/cardpayment'])
  }
  goBlockCard(cardSelected: BusinessDetailAndList) {
    this.blockCardsService.setBlockOperationType(
      BlockCardsService.BLOCK_OP_TYPE,
    )
    this.commercialCardsService.setBusinessCardsDetailsAndList(cardSelected)
    this.router.navigate(['/businessCards/blockcards'])
  }
  goUnblockCard(cardSelected: BusinessDetailAndList) {
    this.blockCardsService.setBlockOperationType(
      BlockCardsService.UNBLOCK_OP_TYPE,
    )
    this.commercialCardsService.setBusinessCardsDetailsAndList(cardSelected)
    this.router.navigate(['/businessCards/unblockcards'])
  }
  goBlockReplaceCard(cardSelected: BusinessDetailAndList) {
    this.blockCardsService.setBlockOperationType(
      BlockCardsService.BLOCK_REPL_OP_TYPE,
    )
    this.commercialCardsService.setBusinessCardsDetailsAndList(cardSelected)
    this.router.navigate(['/businessCards/blockReplaceCards'])
  }
  activateCard(cardSelected: BusinessDetailAndList) {
    this.commercialCardsService.setBusinessCardsDetailsAndList(cardSelected)
    this.router.navigate(['/businessCards/activatecards'])
  }
  cancelCard() {
    // console.log('CANCEL -- not defined yet ...')
  }
  initializeTable() {
    this.detailsTable.batchList = []
    this.detailsTable.size = 0
    this.detailsTable.total = 0
    // this.sharedData.tableSelected = [];
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }
    this.detailsPage.page.pageNumber = dataTableEvent.offset
    this.detailsPage.data = this.selectedcardDetails.transactionList.items
    this.detailsPage.page.size = this.selectedcardDetails.transactionList.size
    this.detailsPage.page.pageSize = this.transactionsDisplaySize
    this.detailsPage.page.totalElements =
      this.selectedcardDetails.transactionList.total
  }

  setSort(dataTableEvent) { }

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

  resetSearchForm(searchForm: FormGroup) {
    this.searchForm.reset({ category: '' })
    this.searchFormfilter()
  }

  searchFormfilter() {
    this.getCardDetails(this.indexSelected, true)
  }

  public validAmountRange(searchForm: FormGroup): boolean {
    if (
      searchForm.controls['amountTo'].value ||
      searchForm.controls['amountFrom'].value
    ) {
      if (
        searchForm.controls['amountTo'].touched &&
        searchForm.controls['amountFrom'].touched
      ) {
        if (+searchForm.value.amountTo > +searchForm.value.amountFrom) {
          return true
        } else if (
          +searchForm.value.amountTo === +searchForm.value.amountFrom
        ) {
          return false
        } else {
          return false
        }
      }
      return true
    }
    return true
  }

  validDateRange(searchForm: FormGroup): boolean {
    const dateForm: FormGroup = searchForm.controls.dateForm as FormGroup
    const dateTo = dateForm.controls['dateTo'].value
    const dateFrom = dateForm.controls['dateFrom'].value

    if (dateTo > dateFrom) {
      return true
    } else {
      return false
    }
  }
  obtainCategories(arrayTransactions: TransactionDetails[]): Category[] {
    const categoriesUnique = []
    const categoriesCombo = []
    const categories: Category[] = []
    let index = 0

    // arrayTransactions.filter(function (item) {
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
  activeCharts() {
    this.chartsTab = true
    this.detailsTab = false
    this.transactionsTab = false
  }
  activeDetails() {
    this.chartsTab = false
    this.detailsTab = true
    this.transactionsTab = false
  }

  activeTransactions() {
    this.chartsTab = false
    this.detailsTab = false
    this.transactionsTab = true
  }

  public chartClicked(event): void {
    if (event.active.length > 0) {
      if (event.active[0]._index === 0) {
        this.showGraphicCenter = true
        // this.graphicPercentage = this.sharedData.targetsData[this.indexSelected].spent25 + ' %';
        this.graphicPercentage =
          this.selectedcardDetails?.businessCardsDetails?.unbilledAmt + ' %'
        // this.totalTransactions = this.AmountPipe.transform(this.sharedData.targetsData[this.indexSelected].spent25) + ' SAR ';
        this.totalTransactions =
          this.AmountPipe.transform(
            this.selectedcardDetails?.businessCardsDetails?.unbilledAmt,
          ) + ' SAR '
      } else if (event.active[0]._index === 1) {
        this.showGraphicCenter = true
        // this.graphicPercentage = this.sharedData.targetsData[this.indexSelected].spent25 + ' %';
        // this.totalTransactions = this.AmountPipe.transform(this.sharedData.targetsData[this.indexSelected].spent25) + ' SAR ';
        this.graphicPercentage =
          this.selectedcardDetails?.businessCardsDetails?.availableCash + ' %'
        this.totalTransactions =
          this.AmountPipe.transform(
            this.selectedcardDetails?.businessCardsDetails?.unbilledAmt,
          ) + ' SAR '
      } else if (event.active[0]._index === 2) {
        this.showGraphicCenter = true
        // this.graphicPercentage = this.sharedData.targetsData[this.indexSelected].spent25 + ' %';
        // this.totalTransactions = this.AmountPipe.transform(this.sharedData.targetsData[this.indexSelected].spent25) + ' SAR ';
        this.graphicPercentage =
          this.selectedcardDetails?.businessCardsDetails?.playableAmt + ' %'
        this.totalTransactions =
          this.AmountPipe.transform(
            this.selectedcardDetails?.businessCardsDetails?.unbilledAmt,
          ) + ' SAR '
      }
    } else {
      this.showGraphicCenter = false
      this.graphicPercentage = ''
      this.totalTransactions = ''
    }
  }

  chartHovered($event) {
    // this.showGraphicCenter = true;
  }

  onPieSliceSelect($event) {
    // console.log('selectt', event)
  }

  // fillGraphicCenter(fontSizeGraphicText: number, paddingGraphicText: number): void {
  fillGraphicCenter(): void {
    const that = this

    const plugins = [
      {
        // afterDraw(chart) {
        afterDraw: (chart) => {
          const ctx = chart.ctx
          const txt = 'hello'
          //Get options from the center object in options
          const sidePadding = 60
          const sidePaddingCalculated =
            (sidePadding / 100) * (chart.options.circumference / Math.PI)

          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          const centerX = (chart.chartArea.left + chart.chartArea.right) / 2
          const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2

          //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
          const stringWidth = ctx.measureText(txt).width
          const elementWidth =
            chart.options.circumference / Math.PI - sidePaddingCalculated

          // Find out how much the font can grow in width.
          const widthRatio = elementWidth / stringWidth
          const newFontSize = Math.floor(30 * widthRatio)

          const elementHeight = chart.options.circumference / Math.PI

          // Pick a new font size so it will not be larger than the height of label.
          let fontSizeToUse = Math.min(newFontSize, elementHeight)
          ctx.fillStyle = 'black'
          ctx.fonteWeight = 'bold'
          fontSizeToUse = this.fontSizeGraphicText
          ctx.font = fontSizeToUse + 'px ' + 'Arial'
          // Draw text in center

          // ctx.fillText(this.graphicPercentage, centerX, centerY - 10);
          // ctx.fillText(this.totalTransactions, centerX, centerY + paddingGraphicText);
          if (this.showGraphicCenter) {
            ctx.fillText(this.graphicPercentage, centerX, centerY - 10)
            ctx.fillText(
              this.totalTransactions,
              centerX,
              centerY + this.paddingGraphicText,
            )
          }
        },
      },
    ]
    this.doughnutChartPlugins.push(...plugins)
  }
  fillLegendOptions(legend: boolean): void {
    this.DonutChartOptions = {
      scaleShowVerticalLines: false,
      responsive: true,
      tooltips: {
        callbacks: {
          label(tooltipItem, data) {
            let label = data.datasets[tooltipItem.datasetIndex].label || ''
            if (label) {
              label += ': '
            }
            // label += Math.round(tooltipItem.yLabel * 100) / 100;
            let amount =
              data.datasets[tooltipItem.datasetIndex].data[
                tooltipItem.index
              ].toString()
            amount = amount.split(/(?=(?:...)*$)/)
            amount = amount.join(',')
            label += amount + '.00 SAR'
            return label
          },
        },
      },
      legend: {
        display: legend,
        position: 'right',
        strokeStyle: 'rgb(0, 0, 0)',
        boxWidth: '134',
        fontSize: 6,
        labels: {
          fontColor: 'rgb(0, 0, 0)',
          strokeStyle: 'rgb(0, 0, 0)',
        },
      },
      legendCallback(_chart) {
        const text = []
        text.push('<div>')
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < _chart.data.datasets.length; i++) {
          text.push('<li><span style="background-color:#333">')
          text.push(_chart.data.datasets[i].label)
          text.push('</span></li>')
        }
        text.push('</div>')
        return text.join('')
      },
    }
  }
  getCurrencyDecimalDigitsCount(value: any) {
    const v1 = new AmountCurrencyPipe(this.injector, this.locale).transform(
      1,
      this.getCurrencyCode(value),
    )
    const n1 = (v1 + '.00').split('.')
    return n1[1] ? n1[1].length : 2
  }
  getCurrencyCode(value: any): string {
    return value ? value : '608'
  }

  private getCardDetails(cardId: number, search?: boolean) {
    this.showTabs = false
    let request: BusinessCardsDetailsRequest
    request = this.createDetailsRequest(search)
    request = {
      ...request,
      cardSeqNumber: this.businessCardsList[cardId].cardSeqNumber,
      cardNumber: this.businessCardsList[cardId].cardNumber,
    }
    // Llamar al details
    this.subscriptions.push(
      this.viewQueryCardsService.getCardDetails(request).subscribe((res) => {
        if (res.errorCode != '0') {
          this.onError(res)
          return
        } else {
          this.mensajeError = {}
          if (res?.businessCardsDetails) {
            this.selectedcardDetails = res
            this.cardSeqNum = undefined
            this.cardSeqNum = res.businessCardsDetails.cardSeqNum
            this.getTabsDetails()
          }
          this.setPage(null)
        }
      }),
    )
  }

  public isUserAdmin() {
    return this.currentUser.type === 'CA'
  }

  private createDetailsRequest(search: boolean): BusinessCardsDetailsRequest {
    let request: BusinessCardsDetailsRequest = new BusinessCardsDetailsRequest()
    request = {
      cardSeqNumber: '',
      details: search ? false : true,
      trxnCode: search
        ? this.searchForm.controls.category.value
          ? this.searchForm.controls.category.value
          : null
        : null,
      trxnType: search
        ? this.searchForm.controls.transactionType.value
          ? this.searchForm.controls.transactionType.value
          : null
        : null,
      amountFrom: search
        ? (this.searchForm.get('amountForm') as FormGroup).get('amountFrom')
          .value
          ? (this.searchForm.get('amountForm') as FormGroup).get('amountFrom')
            .value
          : null
        : null,
      amountTo: search
        ? (this.searchForm.get('amountForm') as FormGroup).get('amountTo').value
          ? (this.searchForm.get('amountForm') as FormGroup).get('amountTo')
            .value
          : null
        : null,
      authDateFrom: search
        ? (this.searchForm.get('dateForm') as FormGroup).get('dateFrom').value
          ? (this.searchForm.get('dateForm') as FormGroup).get('dateFrom').value
          : null
        : null,
      authDateTo: search
        ? (this.searchForm.get('dateForm') as FormGroup).get('dateTo').value
          ? (this.searchForm.get('dateForm') as FormGroup).get('dateTo').value
          : null
        : null,
      page: 1,
      rows: 20,
    }
    return request
  }

  private getAllCombos() {
    const combosSolicitados = [
      ViewQueryCardsService.trxnCode,
      ViewQueryCardsService.trxnType,
    ]
    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const categoriesVal =
          comboData[combosSolicitados.indexOf(ViewQueryCardsService.trxnCode)][
          'values'
          ]
        this.categories = this.extractKeyValue(categoriesVal)
        const transactionsVal =
          comboData[combosSolicitados.indexOf(ViewQueryCardsService.trxnType)][
          'values'
          ]
        this.transactionTypes = this.extractKeyValue(transactionsVal)
      })
  }

  private extractKeyValue(data) {
    const result = Object.keys(data).map((key: string) => {
      return {
        key,
        value: data[key],
      }
    })
    return result
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

  public canBlockCard(): boolean {
    return this.selectedcardDetails?.businessCardsDetails?.authStatus === 'NORM'
  }

  onSelectCard(businessCardsListItemsData: BusinessCardsListItems) {
    this.selectedcard = businessCardsListItemsData
    this.indexSelected = this.businessCardsList.indexOf(
      businessCardsListItemsData,
    )
    this.initializeScreen()
  }

  isActiveTab(tab) {
    return this.activeTab == tab
  }

  setActiveTab(tab) {
    this.activeTab = tab
    this.getTabsDetails()
  }

  getTabsDetails() {
    switch (this.activeTab) {
      case 1: //Payments
        this.commercialCardsService.setBusinessCardsDetailsAndList({
          details: this.selectedcardDetails,
          list: this.selectedcard,
        })
        break
      case 2: //ResetPin
        this.resetPINService.setResetOperationType(
          ResetPINService.RESET_OP_TYPE,
        )
        this.commercialCardsService.setBusinessCardsDetailsAndList({
          details: this.selectedcardDetails,
          list: this.selectedcard,
        })
        break
      case 3: //BlockCard
        this.blockCardsService.setBlockOperationType(
          BlockCardsService.BLOCK_OP_TYPE,
        )
        this.commercialCardsService.setBusinessCardsDetailsAndList({
          details: this.selectedcardDetails,
          list: this.selectedcard,
        })
        break
      case 4: //BlockReplaceCard
        this.blockCardsService.setBlockOperationType(
          BlockCardsService.BLOCK_REPL_OP_TYPE,
        )
        this.commercialCardsService.setBusinessCardsDetailsAndList({
          details: this.selectedcardDetails,
          list: this.selectedcard,
        })
        break
      case 5: //UnblockCard(
        this.blockCardsService.setBlockOperationType(
          BlockCardsService.UNBLOCK_OP_TYPE,
        )
        this.commercialCardsService.setBusinessCardsDetailsAndList({
          details: this.selectedcardDetails,
          list: this.selectedcard,
        })
        break
      case 6: //ActivateCard
        this.commercialCardsService.setBusinessCardsDetailsAndList({
          details: this.selectedcardDetails,
          list: this.selectedcard,
        })
        break
    }
    this.showTabs = true
  }
  goToDisplayCardCredentials() {
    this.viewCardCredentialsService.setViewCardCredentialsData(this.params);
    this.router.navigate(['/businessCards/creditcardlist/viewCardCredentials']);

  }
  showPopUp() {
    this.displayCardCredential.show();
    this.putFocusPin()
  }
  putFocusPin() {
    setTimeout(() => {
      this.focus(4);
    }, 1000);
  }
  sendMessageAndRequestOTPToValidate() {
    if(this.selectedcardDetails['businessCardsDetails']){
      this.subscriptions.push(
        this.viewCardCredentialsService.sendMessage().subscribe((result) => {
          if (this.hasError(result)) {
            this.closePopUp()
            this.onError(result)
            return
          } else {
            this.showPopUp()
            this.confirmResponse = result
          }
        }),
      )
      this.countDown = false;
      clearInterval(this.timerInterval);
      this.form.reset();
      this.focus(4);
      this.getCountdown(1);
    }
  }
  focus(pin) {
    switch (pin) {
      case 1:
        this.pin2.nativeElement.focus()
        break
      case 2:
        this.pin3.nativeElement.focus()
        break
      case 3:
        this.pin4.nativeElement.focus()
        break
      case 4:
        this.pin1.nativeElement.focus()
        break
    }
    if (this.form.valid) {
      this.validateOTP(this.form.value);
    }
  }
  closePopUp() {
    this.countDown = false;
    clearInterval(this.timerInterval);
    this.displayCardCredential.hide();
    this.form.reset()
  };

  getCountdown(minute: number) {
    this.countDown = true;
    let seconds: number = minute * 30;
    let textSec: any = "0";
    let statSec: number = 30;

    const prefix = minute < 10 ? "0" : "";
    this.timerInterval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        this.displayCardCredential.hide();
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }
  resendOTP() {
    this.countDown = false;
    console.warn('cerramosreset');
    clearInterval(this.timerInterval);
    this.getCountdown(9);
  }

  validateOTP(form: FormGroup) {
    const code = form['newPin'] ? form['newPin']['newPin1'] + form['newPin']['newPin2'] + form['newPin']['newPin3'] + form['newPin']['newPin4'] : 0;
    this.requestValidate.otp = code;
    this.closePopUp()
    this.subscriptions.push(
      this.viewCardCredentialsService
        .validateOTP(this.requestValidate, this.selectedcardDetails['businessCardsDetails']).subscribe((result) => {
          if (this.hasError(result)) {
            this.closePopUp()
            this.onError(result)
            return
          } else {
            const credentialsObject: CredentialsObject = {
              cardHolderName: result.holderName,
              expiryDate: result.expiryDate,
              accountNumber: result.iban,
              cvv: result.cvv
            }
            this.params = this.builtViewCardCredentialsData(credentialsObject)
            this.displayCardCredential.hide();
            clearInterval(this.timerInterval);
            this.goToDisplayCardCredentials()
          }
        }),
    )

  }
  builtViewCardCredentialsData(credentialsObject: CredentialsObject): ViewCardCredentialsData {
    const routes: any[] = [
      ['commercialCards.name', ['/businessCards/menu']],
      ['commercialCards.creditCardListName', ['/businessCards/creditcardlist']],
      ['commercialCards.commercialCardDetails'],
      ['viewCardsCredential.cardCredentials']]
    const routesString = JSON.stringify(routes)
    const params: ViewCardCredentialsData = {
      accountNumber: credentialsObject.accountNumber,
      cvv: credentialsObject.cvv,
      expiryDate: credentialsObject.expiryDate,
      cardHolderName: credentialsObject.cardHolderName,
      indexSelected: this.indexSelected,
      messageExpired: 'Business Cards List.',
      sourcePage: ['/businessCards/creditcardlist'],
      imageType: ViewCardCredentialsService.BusinessCards,
      routes: routesString
    }
    return params;
  }

  isSolePropietorCompany() {
    this.subscriptions.push(
      this.viewCardCredentialsService.getCompanyJuridicalState().subscribe((result) => {
        if (this.hasError(result)) {
          this.onError(result)
          return
        } else {
          const juridicalState: string = result['juridicalState'] ? result['juridicalState'] : '';
          this.isSole = ViewCardCredentialsService.SolePropiertorship.includes(juridicalState);
        }
      }),
    )
  }

  getViewCredentialGroup(): boolean {
    let groupIsActive: boolean = false;
    groupIsActive = this.authenticationService.activateOption(
      'BusinessCardsDisplay',
      ['BUSINESS_CARDS_PRIVILEGE'],
      [
        'BusinessQueryCardCredentials',
      ],
    )
    return groupIsActive;
  }
}