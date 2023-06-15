// Import component decorator
import { isPlatformBrowser } from '@angular/common'
import {
  AfterViewChecked,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { TranslateService } from '@ngx-translate/core'
import { User } from 'app/Application/Model/user'
import { BannerModel } from 'app/core/security/login-rev/models/banner.model'
import { MessageModel } from 'app/core/security/login-rev/models/message.model'
import { interval, Subscription } from 'rxjs'
//import {HomeCardsComponent} from "app/Application/Modules/Home/Component/home-cards/home-cards.component";
import { AuthenticationService } from '../../../../core/security/authentication.service'
import { StorageService } from '../../../../core/storage/storage.service'
import { CurrencyService } from '../../../Components/common/currency.service'
import { Account } from '../../../Model/account'
import { Exception } from '../../../Model/exception'
import { PagedData } from '../../../Model/paged-data'
import { Welcome } from '../../../Model/welcome'
import { AccountBalanceService } from '../../../Modules/Home/Services/account-balance-service'
import { SelectedDataService } from '../../Accounts/Services/selected-data-service'
import { QuickTransferWidget } from '../../Transfers/Component/home-quick-transfer.component'
import { HomeMainService } from '../Services/home-main.services'
import { TourService } from './../../../../core/tour/ng-tour.module'

export const HOME_PAGE_SIZE = 5
@UntilDestroy()
@Component({
  templateUrl: '../View/home-main.component.html',
  styleUrls: ['../View/home-main.component.scss'],
})
// Component class
export class HomeMainComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild(QuickTransferWidget) quickTransferWidget: QuickTransferWidget
  @ViewChild('accountBalanceTable') table: any

  accountBalancePage: PagedData<Account>
  cicNumber: string
  loading = false
  subscriptions: Subscription[] = []

  public storedSession: any
  public storedWelcome: Welcome

  public innerWidth: any
  public mobile = false
  public banner: BannerModel[]
  mensajeError: any = {}
  public messages: MessageModel[]
  home = false
  order: string
  orderType: string
  txType = 'ECAL'
  shouldCollapse = true
  currencyBalance: any = []
  public lang: string
  menuTitles: string[] = []
  showAccountsModal = false
  selectedAccounts = []
  totalAccounts: Account[]
  accounts: any[];
  totalBalance: any;
  isSoleProperty: boolean
  isAccountsInquiryEnabled = false;
  isTransferEnabled = false;
  isBFMEnabled = false;
  showBFM = false;

  constructor(
    public dataService: SelectedDataService,
    public storage: StorageService,
    public router: Router,
    public accountBalanceService: AccountBalanceService,
    public currencyService: CurrencyService,
    public authenticationService: AuthenticationService,
    public selectedDataService: SelectedDataService,
    public translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId,
    private homeMainService: HomeMainService,
    private readonly tourService: TourService,
    private modalService: NgbModal,
  ) {
    this.checkServicesAvailability();
    this.accountBalancePage = new PagedData<Account>()
    this.accountBalancePage.page.pageSize = HOME_PAGE_SIZE
    this.cicNumber = JSON.parse(storage.retrieve('currentUser'))['company'][
      'profileNumber'
    ]
    this.lang = this.translate.currentLang;
    this.fetchLanguage()
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.table) {
      tablas.push(this.table)
    }
    return tablas
  }

  ngOnInit() {
    interval(1000).pipe(untilDestroyed(this)).subscribe()
    this.home = true
    const banner = this.storage.retrieve('banner')
    this.banner = banner ? banner : []
    this.innerWidth = window.innerWidth
    this.innerWidth = window.innerWidth

    this.homeMainService.getCompanyJuridicalState().subscribe(result => {
      if(result.errorCode == '0' && result.juridicalState == "0018"){
        this.isSoleProperty = true
      }
    })

    this.setPageAccountBalance(null)
    this.subscriptions.push(
      this.router.events.subscribe((val) => {
        if (val instanceof NavigationEnd && val.url == '/dashboard') {
          //console.log(val);
          this.setPageAccountBalance(null)
        }
      }),
    )

    window.addEventListener('resize', (res: Event) => {
      this.innerWidth = window.innerWidth
      if (this.innerWidth < 800) {
        this.mobile = true
        // this.table.rowDetail.expandAllRows();
        this.shouldCollapse = false
      } else {
        this.mobile = false
        // this.table.rowDetail.collapseAllRows();
        this.shouldCollapse = true
      }
    })
    this.storedSession = JSON.parse(this.storage.retrieve('currentuser'))
    this.storedWelcome = this.storage.retrieve('welcome')

    if (!(this.storedSession.user as User).tutorialDone) {
      this.tourService.startTour(this.homeMainService.getTour())
    }
  }
  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }
  ngAfterViewChecked() {
    if (isPlatformBrowser(this.platformId) && this.innerWidth < 800) {
      if (this.accountBalancePage.data.length > 0) {
        this.mobile = true
        // this.table.rowDetail.expandAllRows();
      }
    }
  }

  ngOnDestroy() {
    /*if (this.unregisteronboarding) {
      this.unregisteronboarding()
    } */
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  setPageAccountBalance(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.accountBalanceService
      .getUserAccounts('', '', pageInfo.offset, HOME_PAGE_SIZE, 'ECAL')
      .subscribe((pagedData) => {
        this.selectedDataService.setAvailableAccounts(pagedData.data)
        this.accountBalancePage = pagedData
        this.accounts= pagedData.data;
        this.totalBalance=pagedData.totalBalance;
        this.updateCurrencyBalance()
      })
  }

  details(acc: string) {
    this.accountBalanceService
      .getResults('', '', 0, 100, 'ECAL')
      .subscribe((result) => {
        this.dataService.setAvailableAccounts(result.data)
        for (let i = 0; i < this.accountBalancePage.data.length; i++) {
          if (this.accountBalancePage.data[i].fullAccountNumber === acc) {
            this.dataService.setModelServiceCurrentAccount(
              this.accountBalancePage.data[i],
            )
            this.router.navigate(['/accounts/onlineStatements'])
          }
        }
      })
  }

  tranfers(acc: string) {
    for (let i = 0; i < this.accountBalancePage.data.length; i++) {
      if (this.accountBalancePage.data[i].fullAccountNumber === acc) {
        this.dataService.setModelServiceCurrentAccount(
          this.accountBalancePage.data[i],
        )
        this.router.navigate(['/transfers/transfers'])
      }
    }
  }

  moi(acc: string) {
    for (let i = 0; i < this.accountBalancePage.data.length; i++) {
      if (this.accountBalancePage.data[i].fullAccountNumber === acc) {
        this.dataService.setModelServiceCurrentAccount(
          this.accountBalancePage.data[i],
        )
        this.router.navigate(['/payments/moiPaymentsOptions'])
      }
    }
  }

  payroll(acc: string) {
    for (let i = 0; i < this.accountBalancePage.data.length; i++) {
      if (this.accountBalancePage.data[i].fullAccountNumber === acc) {
        this.dataService.setModelServiceCurrentAccount(
          this.accountBalancePage.data[i],
        )
        this.router.navigate(['/payroll/payroll-options'])
      }
    }
  }

  billPayment(acc: string) {
    for (let i = 0; i < this.accountBalancePage.data.length; i++) {
      if (this.accountBalancePage.data[i].fullAccountNumber === acc) {
        this.dataService.setModelServiceCurrentAccount(
          this.accountBalancePage.data[i],
        )
        this.router.navigate(['/payments/billPayments'])
      }
    }
  }

  onDetailToggle(event) {
    //console.log('Detail Toggled', event);
  }

  public doSort(dataTableEvent: any): void {
    const property =
      dataTableEvent.column.prop === 'fullAccountNumber'
        ? 'accountPk'
        : dataTableEvent.column.prop
    this.order = dataTableEvent.newValue
    this.accountBalanceService
      .getUserAccounts(
        property,
        this.order,
        0,
        this.accountBalancePage.page.pageSize,
        'ECAL',
      )
      .subscribe((pagedData) => {
        this.selectedDataService.setAvailableAccounts(pagedData.data)
        this.accountBalancePage = pagedData
        this.updateCurrencyBalance()
      })
  }

  updateCurrencyBalance() {
    const currencyBalance = []
    if (
      typeof this.accountBalancePage != 'undefined' &&
      typeof this.accountBalancePage['currencyBalance'] != 'undefined'
    ) {
      this.currencyBalance = this.accountBalancePage['currencyBalance']
      if (this.currencyBalance?.hasOwnProperty(608)) {
        currencyBalance.push({ '608': this.currencyBalance['608'] })
      }

      Object.keys(this.currencyBalance).forEach((key) => {
        if (key != '608') {
          const currencyObj = {}
          currencyObj[key] = this.currencyBalance[key]
          currencyBalance.push(currencyObj)
        }
      })

      this.currencyBalance = currencyBalance
    }
  }

  changeAccountsPage(event) {
    const property =
      this.order === 'fullAccountNumber' ? 'accountPk' : this.order
    this.loading = true
    this.accountBalancePage.page.pageNumber = event.offset + 1
    this.subscriptions.push(
      this.accountBalanceService
        .getUserAccounts(
          property,
          this.orderType,
          +event.offset,
          event.pageSize,
          this.txType,
        )
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.loading = false
            this.accountBalancePage = result
            this.accountBalancePage.page.pageNumber++
          }
        }),
    )
  }

  onUpdateAccounts(accounts: Account[]) {
    this.setPageAccountBalance(null)
  }

  createNewAccount() {
    this.router.navigate(['/accounts/openAdditionalAccount'])
  }

  isAllowed() {
    return this.authenticationService.userHasAnyGroup(['CompanyAdmins'])
  }

    private checkServicesAvailability() {
        this.isTransferEnabled =
            this.authenticationService.activateOption(
                'TransferMenu',
                [
                    'TRANSFER_PRIVILEGE_OWNACCOUNTS',
                    'TRANSFER_PRIVILEGE_LOCALBANK',
                    'TRANSFER_PRIVILEGE_LOCALBANK',
                    'TRANSFER_PRIVILEGE_REMITTANCES'
                ],
                ['TfOwnGroup', 'TfGroup', 'TfRemGroup', 'TfLocalGroup']
            )

        this.isAccountsInquiryEnabled = this.authenticationService.activateOption(
            'AccountsManagement',
            [],
            ['InquiryGroup']
        )
        this.isBFMEnabled = this.authenticationService.activateOption(
            'BusinessFinanceManagement',
            [],
            ['CompanyAdmins'])
    }

  fetchLanguage() {
    this.subscriptions.push(
        this.translate.onLangChange.subscribe(
            (lang) => {
              this.lang = lang.lang;
            }
        ));
  }
  showBFMContainer(){
    this.showBFM =!this.showBFM;
  }
}
