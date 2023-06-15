import { DOCUMENT } from '@angular/common'
import {
  Component,
  Inject,
  Injectable,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { Title } from '@angular/platform-browser'
import { ActivatedRoute, Router } from '@angular/router'
import { SwUpdate } from '@angular/service-worker'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { SimpleMQ } from 'ng2-simple-mq'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { interval, Subject } from 'rxjs'
import { skip, takeUntil } from 'rxjs/operators'
import { slideInOutAnimation } from './core/animations/slideInOutAnimation'
import { StorageService } from './core/storage/storage.service'
import { UpdatePrivilegeService } from './core/service/update-privilege.service'

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    slideInOutAnimation,
    // animation triggers go here
  ],
})
@Injectable()
@Inject(DOCUMENT)
export class AppComponent implements OnInit, OnDestroy {
  subcriptions: Subject<boolean> = new Subject<boolean>()

  @ViewChild('loadingModal', { static: true }) loadingModal: ModalDirective

  @ViewChild('errorModal', { static: true }) errorModal: ModalDirective

  errorMessage: string
  errorReference: string
  currentDate: Date
  errorLines:[]=[]

  document: any

  constructor(
    public translate: TranslateService,
    @Inject(DOCUMENT) document: any,
    public smq: SimpleMQ,
    private swUpdate: SwUpdate,
    public storage: StorageService,
    public router: Router,
    private currentRoute: ActivatedRoute,
    private titleService: Title,
    private updatePrivilegeService:UpdatePrivilegeService,
  ) {
    this.translate.addLangs(['ar', 'en'])
    this.translate.setDefaultLang('ar')
    // this.translate.use('ar');
    this.document = document
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle)
  }

  checkLenguage() {
    return this.currentRoute.queryParams.pipe(skip(1)).subscribe((params) => {
      // const paramLang = params['language'];
      const paramLang = params.returnUrl
      let lang
      if (paramLang) {
        lang = paramLang
        lang = lang.match(/en|ar/) ? lang : 'ar'
      } else if (
        !this.storage.retrieve('currentLanguage') ||
        this.storage.retrieve('currentLanguage') === null
      ) {
        lang = 'ar'
      }
      const currentLang = this.storage.retrieve('currentLanguage')

      this.storage.store('currentLanguage', lang ? lang : currentLang)
      //console.log('En app voy a usar: ',lang,' o ', currentLang, 'finalmente: ',(lang ? lang : currentLang));
      this.translate.use(lang ? lang : currentLang).subscribe(() => {
        this.verifyLang()
      })
      this.cssTranslate(lang ? lang : currentLang)
    })
  }

  ngOnInit() {
    //console.log("ngOnInit");
    const appTitle =
      localStorage.getItem('typeUrl') == 'publicsector'
        ? 'Al-Rajhi Public Sector'
        : 'Al-Rajhi Business' //TODO add translation
    this.setTitle(appTitle)
    interval(1000).pipe(untilDestroyed(this)).subscribe()
    this.translate.onLangChange
      .pipe(takeUntil(this.subcriptions))
      .subscribe((event: LangChangeEvent) => {
        //console.log('event lang en app' ,event, event.lang, 'almaceno: ',((event.lang != null && event.lang) ? event.lang : this.storage.retrieve('currentLanguage')));
        this.storage.store(
          'currentLanguage',
          event.lang != null && event.lang
            ? event.lang
            : this.storage.retrieve('currentLanguage'),
        )
        this.cssTranslate(
          event.lang != null && event.lang
            ? event.lang
            : this.storage.retrieve('currentLanguage'),
        )
      })
    this.verifyLang()
    this.checkLenguage()

    this.smq.subscribe('loader-mq', (e) => this.loaderMqReceiver(e))

    this.smq.subscribe('error-ref', (ref) => (this.errorReference = ref))
    this.smq.subscribe('error-mq', (message) => this.errorMqReceiver(message))
    this.smq.subscribe('error-mq-Lines', (e) => this.errorMqLinesReceiver(e.message,e.lines))
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        this.promptUser()
      })
    }
    this.checkForPrivChanged()
  }

  promptUser(): void {
    this.swUpdate.activateUpdate().then(() => {
      window.location.reload()
    })
  }

  ngOnDestroy() {
    this.subcriptions.next(true)
    // Now let's also unsubscribe from the subject itself:
    this.subcriptions.unsubscribe()
  }

  focusButton() {
    ;(document.getElementById('buttonClose') as HTMLElement).focus()
  }

  loaderMqReceiver(m) {
    if (m) {
      if (!this.loadingModal.isShown) {
        this.loadingModal.show()
      }
    } else {
      if (this.loadingModal.isShown) {
        this.loadingModal.hide()
        document.body.removeAttribute('class')
        document.body.removeAttribute('style')
      }
    }
  }

  errorMqReceiver(message: string) {
    const descriptionsArray = message.split('|')
    this.errorMessage = descriptionsArray[0]
    this.errorReference =
      descriptionsArray[1] !== undefined ? descriptionsArray[1] : ''
    this.currentDate = new Date()
    if (!this.errorModal.isShown) {
      this.errorModal.show()
    }
  }

  errorMqLinesReceiver(message: string, lines) {
    this.errorLines = lines
    this.errorMqReceiver(message)
  }

  cssTranslate(lang) {
    if (lang === 'en') {
      this.document
        .getElementById('principalCss')
        .setAttribute('href', 'css/main.css')
      this.document.documentElement.setAttribute('dir', 'ltr')
      this.document.documentElement.setAttribute('class', 'ltr')
    } else {
      this.document
        .getElementById('principalCss')
        .setAttribute('href', 'css/main-rtl.css')
      this.document.documentElement.setAttribute('dir', 'rtl')
      this.document.documentElement.setAttribute('class', 'rtl')
    }
  }

  verifyLang() {
    const lang = this.translate.currentLang
    const currentLang = this.storage.retrieve('currentLanguage')
    //console.log('en app verify this.translate.currentLang',this.translate.currentLang);
    if (lang == null || lang == 'undefined') {
      //console.log('pero en verify de app uso: ',(currentLang != "undefined" && currentLang != null ? currentLang : 'ar'));
      this.translate.use(
        currentLang != 'undefined' && currentLang != null ? currentLang : 'ar',
      )
      //console.log('aunque en app recargo: ',this.translate.currentLang);
      this.translate.reloadLang(this.translate.currentLang)
    } else {
      //console.log('en app verifyLang recargo: ',lang);
      this.translate.reloadLang(lang)
    }
  }

  checkForPrivChanged(){
    this.smq.subscribe('privilege-changed' , (state:boolean)=>{
      if(state){
        this.updatePrivilegeService.getUpdatedPriv()
      }
    })
  }
}
