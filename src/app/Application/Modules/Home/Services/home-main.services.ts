import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { AuthenticationService } from 'app/core/security/authentication.service'
import { Observable } from 'rxjs'
import {catchError, map} from 'rxjs/operators'
import { Tour } from '../../../../core/tour/ng-tour.module'
// import { Exception } from "../Model/exception";
import { Exception } from '../../../Model/exception'

@Injectable()
export class HomeMainService {
  servicesUrl: string
  currentUser

  constructor(
    private authenticationService: AuthenticationService,
    private translateService: TranslateService,
    public config: ConfigResourceService,
    private http: HttpClient,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public getTour() {
    let vRight = 'right'
    let vLeft = 'left'
    let tRight = 'right-top'
    let tLeft = 'left-top'

    let arrowLeft = 'left'
    let arrowRight = 'right'

    if (this.translateService.currentLang === 'ar') {
      vRight = 'left'
      vLeft = 'right'
      tRight = 'left-top'
      tLeft = 'right-top'

      arrowLeft = 'right'
      arrowRight = 'left'
    }

    const tour: Tour = {
      steps: [
        {
          stepName: 'stepWelcomePage',
          route: 'step-welcome-page',
          title: 'dashboard.tour.stepWelcomePageTitle',
          description: 'dashboard.tour.stepWelcomePageDescription',
          options: {
            smoothScroll: true,
            placement: 'down',
            withoutCounter: true,
            fixed: true,
            backdrop: true,
            themeColor: 'rgb(60, 60, 60)',
            scrollTo: true,
            autofocus: true,
            withoutPrev: true,
            continueIfTargetAbsent: true,
            arrowPosition: arrowLeft,
          },
        },
        {
          stepName: 'stepDashboard',
          directiveStepName: 'stepMenuOptions', // Set directiveStepName to search target inside it with targetChildQuerySelector
          targetChildQuerySelector: 'a > span.icon.-dashboard',
          route: 'step-dashboard',
          title: 'dashboard.tour.stepDashboardTitle',
          description: 'dashboard.tour.stepDashboardDescription',
          options: {
            smoothScroll: true,
            placement: vRight,
            withoutCounter: true,
            backdrop: true,
            themeColor: 'rgb(60, 60, 60)',
            scrollTo: true,
            autofocus: true,
            withoutPrev: true,
            fixed: true,
            continueIfTargetAbsent: true,
            arrowPosition: 'top',
            placementLeftOrRight_VerticalOffset: 20,
          },
        },
        {
          stepName: 'stepSearch',
          directiveStepName: 'stepMenuOptions', // Set directiveStepName to search target inside it with targetChildQuerySelector
          targetChildQuerySelector: 'span > a.icon.-search',
          route: 'step-search',
          title: 'dashboard.tour.stepSearchTitle',
          description: 'dashboard.tour.stepSearchDescription',
          options: {
            placement: vRight,
            smoothScroll: true,
            withoutCounter: true,
            fixed: true,
            backdrop: true,
            scrollTo: true,
            autofocus: true,
            withoutPrev: true,
            continueIfTargetAbsent: true,
            arrowPosition: 'center',
            placementLeftOrRight_VerticalOffset: -20,
          },
        },
        {
          stepName: 'stepMenuOptions',
          directiveStepName: 'stepMenuOptions', // Set directiveStepName to search target inside it with targetChildQuerySelector
          targetChildQuerySelector: 'div > nav.sme-navigation__menu',
          querySelectorElementToClick: 'div > a.sme-header-left-menu-options',
          executeClick: true,
          route: 'step-menu-options',
          title: 'dashboard.tour.stepMenuOptionsTitle',
          description: 'dashboard.tour.stepMenuOptionsDescription',
          options: {
            smoothScroll: true,
            placement: vRight,
            withoutCounter: true,
            backdrop: true,
            themeColor: 'rgb(60, 60, 60)',
            scrollTo: true,
            autofocus: true,
            withoutPrev: true,
            fixed: true,
            continueIfTargetAbsent: true,
            arrowPosition: 'top',
            placementLeftOrRight_HorizontalOffset: 20,
          },
        },
        {
          stepName: 'stepPendingActions',
          route: 'step-pending-actions',
          title: 'dashboard.tour.stepPendingActionsTitle',
          description: 'dashboard.tour.stepPendingActionsDescription',
          options: {
            smoothScroll: true,
            placement: 'down',
            withoutCounter: true,
            fixed: true,
            backdrop: true,
            themeColor: 'rgb(60, 60, 60)',
            scrollTo: true,
            autofocus: true,
            withoutPrev: true,
            continueIfTargetAbsent: true,
            arrowPosition: 'center',
            placementTopOrDown_HorizontalOffset: -180,
          },
        },
        {
          stepName: 'stepRightBarOptions',
          directiveStepName: 'stepRightBarOptions', // Set directiveStepName to search target inside it with targetChildQuerySelector
          targetChildQuerySelector: 'div > nav.sme-navigation__menu',
          querySelectorElementToClick: 'li > a#sme-header--user',
          route: 'step-right-bar-options',
          executeClick: true,
          title: 'dashboard.tour.stepRightBarOptionsTitle',
          description: 'dashboard.tour.stepRightBarOptionsDescription',
          options: {
            smoothScroll: true,
            placement: vLeft,
            withoutCounter: true,
            fixed: true,
            backdrop: true,
            themeColor: 'rgb(60, 60, 60)',
            scrollTo: true,
            autofocus: true,
            withoutPrev: true,
            continueIfTargetAbsent: true,
            arrowPosition: 'top',
          },
        },
        {
          stepName: 'stepAccount',
          route: 'step-account',
          title: 'dashboard.tour.stepAccountTitle',
          description: 'dashboard.tour.stepAccountDescription',
          options: {
            placement: 'top',
            smoothScroll: true,
            withoutCounter: true,
            fixed: false,
            backdrop: true,
            themeColor: 'rgb(60, 60, 60)',
            scrollTo: true,
            autofocus: true,
            withoutPrev: true,
            continueIfTargetAbsent: true,
            arrowPosition: arrowLeft,
          },
        },
        {
          stepName: 'stepQuickTransfer',
          route: 'step-quick-transfer',
          title: 'dashboard.tour.stepQuickTransferTitle',
          description: 'dashboard.tour.stepQuickTransferDescription',
          options: {
            smoothScroll: true,
            placement: 'top',
            withoutCounter: true,
            fixed: false,
            backdrop: true,
            themeColor: 'rgb(60, 60, 60)',
            scrollTo: true,
            autofocus: true,
            withoutPrev: true,
            continueIfTargetAbsent: true,
            arrowPosition: arrowLeft,
          },
        },
      ],
      tourOptions: {
        withoutCounter: true,
        backdrop: true,
        placement: vRight,
        themeColor: 'rgb(60, 60, 60)',
        className: 'sme-tour',
        smoothScroll: true,
        scrollTo: true,
        autofocus: true,
        withoutPrev: true,
        fixed: true,
        continueIfTargetAbsent: true,
        closeOnClickOutside: false,
      },
      ctrlBtns: {
        done: {
          'en-US': 'Done',
          'ar-SA': 'فعله',
        },
        prev: {
          'en-US': 'Prev',
          'ar-SA': 'السابق',
        },
        next: {
          'en-US': 'Next',
          'ar-SA': 'التالى',
        },
        of: {
          'en-EN': 'of',
          'ar-SA': 'من',
        },
      },
    }
    return tour
  }

  getCompanyJuridicalState() {
    return this.http
        .get(this.servicesUrl + '/companyDetails/juridicalState')
        .pipe(
            map((response: any) => {
              const output = response
              if (response.errorCode !== '0') {
                return new Exception(
                    output.errorCode,
                    output.errorDescription,
                )
              } else {
                return output
              }
            }),
            catchError(this.handleError),
        )
  }

  //Obtain Banner
  public getBanner(): Observable<any> {
    //  :Observable<CardCredit> {
    const data = {}
    return this.http.get(this.servicesUrl + '/campaingService/internal').pipe(
      map((response: any) => {
        let result: any
        const body = response
        if (response.errorCode != 0) {
          result = {
            error: true,
            errorCode: response.errorCode,
            errorDescription: response.errorDescription,
          }
        } else {
          result = body
        }
        return result
      }),
    )
  }

  errorLanguage(error) {
    if (error) {
      if (
        this.translateService.currentLang === 'ar' &&
        error.errorResponse &&
        error.errorResponse.arabicMessage
      ) {
        return error.errorResponse.arabicMessage
      }
      return error.errorDescription
    }
  }

  public handleError(error: HttpResponse<any> | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string
    if (error instanceof HttpResponse) {
      const err = error['error'] || JSON.stringify(error)
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`
    } else {
      errMsg = error.message ? error.message : error.toString()
    }
    console.error(errMsg)
    const errorService: Exception = new Exception('handle', errMsg)
    return Observable.throw(errorService)
  }
}
