import { LocationStrategy } from '@angular/common'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { ActivatedRoute, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { StorageService } from '../../../core/storage/storage.service'
import { Exception } from '../../Model/exception'
import { TermsConditionsService } from './terms-conditions.service'

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
})
export class TermsConditionsComponent implements OnInit, OnDestroy {
  privilege: string
  next_route: string
  isLogin: boolean
  docURL: any
  subscriptions: Subscription[] = []
  blobURL: any

  constructor(
    public translate: TranslateService,
    private locationStrategy: LocationStrategy,
    private router: Router,
    private route: ActivatedRoute,
    private service: TermsConditionsService,
    public storageService: StorageService,
    private santizer: DomSanitizer,
  ) {
    history.pushState(null, null, location.href)
    this.locationStrategy.onPopState((event) => {
      if (event.state) {
        history.go(1)
      }
    })
  }

  ngOnInit() {
    this.subscriptions.push(
      this.route.queryParams.subscribe((params) => {
        this.next_route = params['url']
        this.privilege = params['privilege']
        this.isLogin = params['isLogin']
        this.subscriptions.push(
          this.service.init(this.privilege).subscribe((res) => {
            this.docURL = this.printPdf(res)
          }),
        )
      }),
    )
  }

  ngOnDestroy() {
    if (this.blobURL) {
      URL.revokeObjectURL(this.blobURL)
    }
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  sign() {
    this.subscriptions.push(
      this.service.sign(this.privilege).subscribe((res) => {
        if (res instanceof Exception) {
          this.onError(res)
          return
        } else {
          this.router.navigate([this.next_route])
        }
      }),
    )
  }

  cancel() {
    if (this.isLogin) {
      this.logout()
    } else {
      this.router.navigate(['/'])
    }
  }

  onError(error) {
    //console.log(error);
  }

  logout() {
    this.storageService.clearAll()
    this.router.navigate(['login'])
  }

  printPdf(blob: Blob) {
    this.blobURL = URL.createObjectURL(blob)
    const url = window.location.href
    const docURL =
      url.replace('#' + this.router.url, '') +
      'viewer/viewer.html?file=' +
      this.blobURL

    return this.santizer.bypassSecurityTrustResourceUrl(docURL)
  }

  showIframe() {
    return /msie\s|trident\/|edge\//i.test(window.navigator.userAgent)
  }
}
