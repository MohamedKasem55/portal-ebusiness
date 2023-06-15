import { HomeMainService } from './../../Modules/Home/Services/home-main.services'
import { DOCUMENT, Location } from '@angular/common'
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  HostListener,
  Inject,
  Injectable,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { Router } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { DashboardMenuComponent } from 'arb-menu'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { interval, Subscription, timer as TimerObservable } from 'rxjs'
import { take } from 'rxjs/operators'
import { ConfigResourceService } from '../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../core/security/authentication.service'
import { StorageService } from '../../../core/storage/storage.service'
import { PendingActionsNotificaterService } from '../../Modules/Common/Components/PendingActions/pending-actions-notificater.service'
import { DashboardMenuService } from './dashboard-menu-service'
import { DashboardService } from './dashboard-service'
import { Mail } from './mail-model'
import { Exception } from '../../Model/exception'
import { VATCompany } from '../vat-company/vat-company.component'
import {FreeSmsAlertComponent} from "../free-sms-alert/free-sms-alert.component";
import {RequestToPayComponent} from "../request-to-pay/request-to-pay.component";
import { SimpleMQ } from 'ng2-simple-mq'
@UntilDestroy()
@Component({
  selector: 'dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
  providers: [HomeMainService],
})
@Injectable()
@Inject(DOCUMENT)
export class DashboardLayoutComponent
  implements OnInit, OnDestroy, AfterContentInit, AfterViewInit {
  @ViewChild('logoutConfirm', { static: true }) logoutConfirm: ModalDirective
  @ViewChild('sessionIdleConfirm', { static: true })
  sessionIdleConfirm: ModalDirective
  @ViewChild('backConfirm', { static: true }) backConfirm: ModalDirective
  @ViewChild('menuLeft', { static: true }) menuLeft: DashboardMenuComponent
  @ViewChild('menuRight', { static: true }) menuRight: DashboardMenuComponent
  @ViewChild('IPSTCStatusModal', { static: true })
  iPSTCStatusModal: ModalDirective
  @ViewChild('firstLoginMigrationCA')
  public firstLoginMigrationCA: ModalDirective
  @ViewChild('VATCompany') vatCompany: VATCompany
  @ViewChild('SMSAlert') SMSAlert: FreeSmsAlertComponent
  currentUser = ''
  @ViewChild('RequestToPay') requestToPay: RequestToPayComponent


  public user = {}

  subscriptionSession: Subscription
  subscriptionsLanguage: Subscription

  loading: boolean
  error: string
  userImage: any
  subscriptionHeader: Subscription
  logoutTimer: any
  logoutTimerCounter: any
  checkConnectionTimer: any = null

  mails: Mail[] = []
  banner: any
  unReadMails = 0
  bannerSubscription: Subscription
  pendingActions: any
  pendingCounterCheck: Subscription
  mensajeError: any = {}
  translate: TranslateService
  nationalAddress: string
  firstLoad = true
  dataMenuLeft: any
  dataMenuRight: any

  date: any
  IdleInterval: any

  showVat: boolean = false

  constructor(
    public injector: Injector,
    public authenticationService: AuthenticationService,
    private _location: Location,
    public config: ConfigResourceService,
    private pendingActionNotification: PendingActionsNotificaterService,
    private _storage: StorageService,
    private homeMainService: HomeMainService,
    public routerAlert: Router,
    @Inject(DOCUMENT) private document,
    private msq: SimpleMQ,
  ) {
    this.firstLoad = true
    this.loading = false
    this.error = null

    this.pendingActions = {}
    this.pendingActions.counters = {}
  }

  ngOnInit() {
    // IDLE Check
    this.startIdleInterval()

    interval(1000).pipe(untilDestroyed(this)).subscribe()
    //console.log ('aqio');
    window.addEventListener(
      'popstate',
      (event) => {
        history.pushState(null, null, document.URL)
        this.backConfirm.show()
      },
      false,
    )
    this.translate = this.injector.get(TranslateService)
    const storageService = this.injector.get(StorageService)
    const lang = storageService.retrieve('currentLanguage')
    if (!this.translate.currentLang && lang != null) {
      this.translate.use(storageService.retrieve('currentLanguage'))
    } else if (!this.translate.currentLang) {
      this.translate.use(this.translate.getDefaultLang())
    }
    this.translate.reloadLang(this.translate.currentLang)

    const timer = TimerObservable(0, 300000)
    this.subscriptionSession = timer.subscribe((t) => {
      const current = JSON.parse(storageService.retrieve('currentUser'))

      if (current.user.firstLogin === '') {
        current.user.firstLogin = true
      }
      const firstLogin = current.user.firstLogin
      const migrated = current.user.migrated
      const userType = current.user.type
      if (firstLogin && migrated && userType === 'CA') {
        this.firstLoginMigrationCA.show()
      }
      // we add the boolean false to the store for the first login
      current.user.firstLogin = false
      this._storage.store('currentUser', JSON.stringify(current))


      let expirationTime = 1
      if (current != null) {
        this.currentUser = current.user.userName
        this.user = current.user

        this.userImage = current.user.userImage
          ? current.user.userImage
          : 'img/default-avatar.svg'
        //console.log( this.userImage);
        expirationTime = current.expirationTimestamp * 1
      }
    })

    const timerMail = TimerObservable(0, 300000)
    this.subscriptionHeader = timerMail.subscribe((t) => {
      this.loadMails()
      // this.loadPendingActions();
    })

    this.pendingCounterCheck = this.pendingActionNotification
      .getRefreshObserver()
      .subscribe({
        next: (data) => this.loadPendingActions(),
      })

    this.subscriptionsLanguage = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.refreshData()
      },
    )

    const dashboardMenuService = this.injector.get(DashboardMenuService)
    this.dataMenuRight = dashboardMenuService.getMenuRight()
    this.dataMenuLeft = dashboardMenuService.getMenuLeft()
    this.updateMenu()
    this.bannerSubscription = this.homeMainService
      .getBanner()
      .subscribe((result) => {
        if (result instanceof Exception) {
          this.onError(result)
          this.banner = []
          return
        } else {
          this.banner = result.banner
          storageService.store('banner', this.banner)
          this.mensajeError = {}
        }
        this.bannerSubscription.unsubscribe()
      })

    let context = this
    setTimeout(() => {
      let ipstcstatus = this.getIPSTCStatus()
      if (
        this.authenticationService.userHasAnyGroup(['CompanyAdmins']) &&
        ipstcstatus != 'ACCEPTED'
      )
        context.showIPSModal()
    }, 2000)

    // Display Modals
    setTimeout(() => {
      const disclaimerList: [] = this._storage.retrieve('disclaimerList')
      if(!disclaimerList){
        return
      }
      disclaimerList.forEach((item: any) => {
        if (item.type === 'vatTries' && item.show === true) {
          this.vatCompany.showModal(item)
        }
        // SMS Alert Modal
        if (item.type === 'FREE_SMS_ALERT' && item.show === true) {
          this.SMSAlert.showModal()
        }
        //RTP
        if (item.type === 'RTP_ALERT' && item.show === true) {
          this.requestToPay.show()
        }
      })
    }, 2000)
  }

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  ngOnDestroy() {
    this.subscriptionSession.unsubscribe()
    this.subscriptionHeader.unsubscribe()
    this.pendingCounterCheck.unsubscribe()
    this.subscriptionsLanguage.unsubscribe()
  }

  ngAfterContentInit() {
    this.firstLoad = false
  }

  ngAfterViewInit() {
    // this.firstLoad = false;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    const authenticationService = this.injector.get(AuthenticationService)
    //DEBUG
    authenticationService.logout()
  }

  // CA
  public closePopupCA() {
    this.firstLoginMigrationCA.hide()
  }

  public goToAlerts() {
    this.firstLoginMigrationCA.hide()
    this.routerAlert.navigate(['/companyadmin/alerts'])
  }

  isNavigationOpen() {
    return document.body.classList.contains('sme-navigation-open')
  }

  openNavigation() {
    document.body.classList.add('sme-navigation-open')
  }

  closeNavigation() {
    this.closeSubMenus()
    document.body.classList.remove('sme-navigation-open')
  }

  closeSubMenus() {
    const openMenus = document.querySelectorAll(
      'a.sme-navigation__menu-toggler:not(.collapsed)',
    )
    for (let _i = 0; _i < openMenus.length; _i++) {
      const menu = openMenus[_i]
      menu.classList.add('collapsed')
      document
        .querySelector('#' + menu.getAttribute('aria-controls'))
        .classList.remove('in')
    }
  }

  haveToShowNational() {
    const storageService = this.injector.get(StorageService)
    const welcome = storageService.retrieve('welcome')
    return welcome.nationalAdress == 'N'
  }

  isDualCompany() {
    const storageService = this.injector.get(StorageService)
    const company = storageService.retrieve('company')
    return company.dualAuthorization
  }

  getIPSTCStatus() {
    const storageService = this.injector.get(StorageService)
    const company = storageService.retrieve('company')
    return company.ipstcstatus
  }

  /**
   * @todo Implment proper logic, now server returns a null
   * expiry date.
   */
  public haveToShowExpiry(): boolean {
    const storageService = this.injector.get(StorageService)
    const welcome = storageService.retrieve('welcome')
    if (welcome && welcome.crExpiryDate) {
      return true
    }
    return true
  }

  isSubMenuOpen(subMenu) {
    return !subMenu.classList.contains('collapsed')
  }

  openSubMenu(subMenu) {
    this.closeSubMenus()
    subMenu.classList.remove('collapsed')
    document
      .querySelector('#' + subMenu.getAttribute('aria-controls'))
      .classList.add('in')
  }

  closeSubMenu(subMenu) {
    subMenu.classList.add('collapsed')
    document
      .querySelector('#' + subMenu.getAttribute('aria-controls'))
      .classList.remove('in')
  }

  toggleMenuLeft(event) {
    event.preventDefault()
    if (this.menuLeft.isNavigationOpen()) {
      this.menuLeft.closeNavigation()
    } else {
      this.menuLeft.isSearchCollapsed = true
      this.menuLeft.openNavigation()
    }
    this.menuRight.closeNavigation()
    this.dispatchWindowResizeEvent()
  }

  toggleMenuRight(event) {
    event.preventDefault()
    if (this.menuRight.isNavigationOpen()) {
      this.menuRight.closeNavigation()
    } else {
      this.menuRight.isSearchCollapsed = true
      this.menuRight.openNavigation()
    }
    this.menuLeft.closeNavigation()
    this.dispatchWindowResizeEvent()
  }

  dispatchWindowResizeEvent() {
    //console.log("toggled");
    setTimeout(() => {
      if (typeof Event === 'function') {
        // modern browsers, except IE
        window.dispatchEvent(new Event('resize'))
      } else {
        // for IE and other old browsers
        // causes deprecation warning on modern browsers
        const resizeEvent = window.document.createEvent('UIEvents')
        resizeEvent.initEvent('resize', true, false)
        window.dispatchEvent(resizeEvent)
      }
      //console.log("resized");
    }, 300)
  }

  showLogoutConfirm() {
    this.logoutConfirm.show()
  }

  closeLogoutConfirm() {
    this.logoutConfirm.hide()
  }

  showSessionIdleConfirm() {
    this.sessionIdleConfirm.show()
  }

  closeSessionIdleConfirm() {
    this.sessionIdleConfirm.hide()
  }

  closeBackConfirm() {
    this.backConfirm.hide()
  }

  logout() {
    const authenticationService_ = this.injector.get(AuthenticationService)
    authenticationService_.logout().subscribe((result) => {
      const storageService = this.injector.get(StorageService)
      const router = this.injector.get(Router)
      storageService.clearAll()
      router.navigate(['login']).then(() => {
        window.location.reload()
      })
    })
  }

  loadMails() {
    const dashboardService = this.injector.get(DashboardService)
    dashboardService
      .getNewMails()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          this.mails = result.mails
          this.unReadMails = result.unread
        }
      })
  }

  loadPendingActions() {
    let subscription: Subscription
    const dashboardService = this.injector.get(DashboardService)
    subscription = dashboardService.getPendingActions().subscribe((result) => {
      subscription.unsubscribe()
      this.pendingActions = result
    })
  }

  renewSession() {
    const authenticationService_ = this.injector.get(AuthenticationService)
    const router = this.injector.get(Router)
    this.error = null
    this.loading = true
    let subscription: Subscription
    subscription = authenticationService_.renewToken().subscribe((result) => {
      subscription.unsubscribe()
      this.loading = false
      if (result.error) {
        this.error = result.errorDescription
        router.navigateByUrl('/login')
      } else {
        this.closeSessionIdleConfirm()
      }
    })
  }

  changeEnglish() {
    this.translate.use('en').subscribe((result) => {
      const storageService = this.injector.get(StorageService)
      storageService.store('currentLanguage', 'en')
      const _router = this.injector.get(Router)
      _router.navigateByUrl(_router.url)
    })
  }

  changeArabic() {
    this.translate.use('ar').subscribe((result) => {
      const storageService = this.injector.get(StorageService)
      storageService.store('currentLanguage', 'ar')
      const _router = this.injector.get(Router)
      _router.navigateByUrl(_router.url)
    })
  }

  openLink(link: string) {
    window.open(link)
  }

  openHelp(event) {
    // const router = this.injector.get(Router);
    // const dashboardService = this.injector.get(DashboardService);
    // dashboardService.getPdf().subscribe((blob: any) => {
    //   const urlBlob = URL.createObjectURL(blob);
    //   const url = window.location.href;
    //   const docURL =
    //     url.replace("#" + router.url, "") +
    //     "viewer/viewer.html?file=" +
    //     urlBlob;
    //
    //   const x = window.open(docURL);
    // });

    event.preventDefault()
    const pdfName =
      this.translate.currentLang == 'ar'
        ? 'SME_Manual_Arabic'
        : 'SME_Manual_English'
    const port =
      this.document.location.port != '' ? ':' + this.document.location.port : ''
    const url =
      this.document.location.protocol +
      '//' +
      this.document.location.hostname +
      port +
      '/'

    const url_to_open = url + '/../ecorp/loginDocuments/' + pdfName + '.pdf'
    window.open(url_to_open, '_blank')
  }

  navigateToMailDetail(index: number) {
    const router = this.injector.get(Router)
    const storageService = this.injector.get(StorageService)
    if (this.mails && this.mails.length && this.mails[index] != undefined) {
      storageService.store('selectedMail', JSON.stringify(this.mails[index]))
      router.navigate(['/myprofile/mails/detail'])
    }
  }

  refreshData() {
    this.loadPendingActions()
  }

  isSafariOrIE() {
    const isIEOrEdge = /msie\s|trident\/|edge\//i.test(
      window.navigator.userAgent,
    )
    //TODO Safari

    if (isIEOrEdge == true) {
      return true
    }

    return false
  }

  showIPSModal() {
    this.iPSTCStatusModal.show()
  }

  closeIPSModal() {
    this.iPSTCStatusModal.hide()
  }

  IPSagree() {
    this.closeIPSModal()
    const dashboardService = this.injector.get(DashboardService)
    dashboardService
      .updateIPSTCStatus({ ipstcstatus: 'ACCEPTED' })
      .subscribe((result) => {
        const storageService = this.injector.get(StorageService)
        const company = storageService.retrieve('company')
        company.ipstcstatus = 'ACCEPTED'
        storageService.store('company', company)
      })
  }

  IPSreject() {
    this.closeIPSModal()
    const dashboardService = this.injector.get(DashboardService)
    dashboardService
      .updateIPSTCStatus({ ipstcstatus: 'REJECTED' })
      .subscribe((result) => {
      })
  }

  ipSLater() {
    this.closeIPSModal()
  }

  showTC() {
    let fileName = 'IPS-Terms_and_Conditions.pdf'

    let url_to_open =
      `${this.config.getDocumentUrl()}/` + fileName
    window.open(url_to_open, '_blank')
  }

  startIdleInterval() {
    this.IdleInterval = setInterval(() => {
      const lastActionTime: Date = this._storage.retrieve('lastCall')
      const currentTime: Date = new Date()

      if (
        Math.abs((currentTime.getTime() - lastActionTime?.getTime()) / 1000) >=
        720
      ) {
        this.showSessionIdleConfirm()
      }

      if (
        Math.abs((currentTime.getTime() - lastActionTime?.getTime()) / 1000) >
        780
      ) {
        this.closeSessionIdleConfirm()
        clearInterval(this.IdleInterval)
        this.logout()
      }
    }, 30000)
  }

  updateMenu(): void {
    this.msq.subscribe('privilege-update', (state: boolean) => {
      if (state) {
        const dashboardMenuService = this.injector.get(DashboardMenuService)
        this.dataMenuRight = dashboardMenuService.getMenuRight()
        this.dataMenuLeft = dashboardMenuService.getMenuLeft()
      }
    })
  }
}
