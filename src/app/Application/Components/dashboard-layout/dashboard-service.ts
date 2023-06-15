import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../core/security/authentication.service'
import { Mail, MailBuilder } from './mail-model'
import { Exception } from '../../Model/exception'

@Injectable()
export class DashboardService {
  private servicesUrl: string

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
    public translate: TranslateService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  getPendingActions(): Observable<any> {
    //const reqOptions = new HttpParams().append("displayLoading", "false");
    const reqOptions = new HttpParams().append('displayLoading', 'true')
    return this.http
      .get(this.servicesUrl + '/pendingActions/counters', {
        params: reqOptions,
      })
      .pipe(
        map((response: any, index: number) => {

          const output = response

          const counters = []
          //mock
          let total = 0
          if (output.counter) {
            // bill payments ------------------------------------------------------------
            if (
              this.checkIsCounter(output.counter.billPay) &&
              this.authenticationService.activateOption(
                'PendingActionBillPayments',
                ['BILLPAYMENTS_PRIVILEGE'],
                ['BillPayGroup'],
              )
            ) {
              total += output.counter.billPay
              counters.push({
                name: 'dashboard.billPayments',
                value: output.counter.billPay,
                route: '/myprofile/pending/bill-payments',
              })
            }
            // aramco payments ------------------------------------------------------------
            if (
              this.checkIsCounter(output.counter.aramco) &&
              this.authenticationService.activateOption(
                'PendingActionAramcoPayments',
                ['ARAMCOPAYMENTS_PRIVILEGE'],
                ['AramcoPaymentsGroup'],
              )
            ) {
              total += output.counter.aramco
              counters.push({
                name: 'dashboard.aramcoPayments',
                value: output.counter.aramco,
                route: '/myprofile/pending/aramco-payments',
              })
            }
            // transfers ------------------------------------------------------------
            if (
              this.authenticationService.activateOption(
                'PendingActionTransfer',
                [
                  'TRANSFER_PRIVILEGE',
                  /*'TRANSFER_PRIVILEGE_OWNACCOUNTS',*/
                  'TRANSFER_PRIVILEGE_LOCALBANK',
                  'TRANSFER_PRIVILEGE_REMITTANCES',
                ],
                ['TfGroup', 'TfRemGroup', 'TfLocalGroup' ,'TfOwnGroup'],
              )
            ) {
              if (this.checkIsCounter(output.counter.transfers)) {
                if (output.counter.transfers >= 0) {
                  counters.push({
                    name: 'dashboard.transfers',
                    value: output.counter.transfers,
                    route: '/myprofile/pending/transfers',
                  })
                }
              } else {
                const keyFinding = []
                if (
                  this.authenticationService.activateOption(
                    'PendingActionTransfer',
                    ['TRANSFER_PRIVILEGE'],
                    ['TfGroup'],
                  )
                ) {
                  keyFinding.push('withinTransfer')
                }
                if (
                    this.authenticationService.activateOption(
                        'PendingActionTransfer',
                        ['TRANSFER_PRIVILEGE'],
                        ['TfOwnGroup'],
                    )
                ) {
                  keyFinding.push('ownTransfer')
                }
                if (
                  this.authenticationService.activateOption(
                    'PendingActionTransfer',
                    ['TRANSFER_PRIVILEGE_REMITTANCES'],
                    ['TfRemGroup'],
                  )
                ) {
                  keyFinding.push('interTransfer')
                }
                if (
                  this.authenticationService.activateOption(
                    'PendingActionTransfer',
                    ['TRANSFER_PRIVILEGE_LOCALBANK'],
                    ['TfLocalGroup'],
                  )
                ) {
                  keyFinding.push('localTransfer')
                }
                let transferCounter = 0
                keyFinding.forEach((keyValue) => {
                  if (this.checkIsCounter(output.counter[keyValue])) {
                    transferCounter += output.counter[keyValue]
                  }
                })
                total += transferCounter
                if (transferCounter >= 0) {
                  counters.push({
                    name: 'dashboard.transfers',
                    value: transferCounter,
                    route: '/myprofile/pending/transfers',
                  })
                }
              }
            }
            // standing orders ------------------------------------------------------------
            if (
              this.checkIsCounter(output.counter.standingOrders) &&
              this.authenticationService.activateOption(
                'PendingActionStandingOrder',
                ['STANDORD_PRIVILEGE'],
                ['OrdGroup'],
              )
            ) {
              total += output.counter.standingOrders
              counters.push({
                name: 'dashboard.standingOrders',
                value: output.counter.standingOrders,
                route: '/myprofile/pending/standing-orders',
              })
            }
            // beneficiaries ------------------------------------------------------------
            if (
              this.checkIsCounter(output.counter.beneficiary) &&
              this.authenticationService.activateOption(
                'PendingActionBeneficiaries',
                [
                  'TRANSFER_PRIVILEGE_OWNACCOUNTS',
                  'TRANSFER_PRIVILEGE',
                  'TRANSFER_PRIVILEGE_LOCALBANK',
                  'TRANSFER_PRIVILEGE_REMITTANCES',
                ],
                ['TfOwnGroup', 'TfGroup', 'TfRemGroup', 'TfLocalGroup'],
              )
            ) {
              total += output.counter.beneficiary
              counters.push({
                name: 'dashboard.beneficiaries',
                value: output.counter.beneficiary,
                route: '/myprofile/pending/beneficiaries',
              })
            }
            // mutual fund ------------------------------------------------------------
            /*if (
                        this.checkIsCounter(output.counter.mutualFund) &&
                        this.authenticationService.activateOption(
                            'PendingActionMutualFund',
                            [''],
                            ['MutualFundGroup'])
                    ) {
                        total += output.counter.mutualFund;
                        counters.push({
                            name: ("dashboard.mutualFund"),
                            value: output.counter.mutualFund,
                            route: '/myprofile/pending/mutual-fund'
                        });
                    }*/
            // bulk payments ------------------------------------------------------------
            if (
              this.checkIsCounter(output.counter.bulkPayments) &&
              this.authenticationService.activateOption(
                'PendingActionBulkPayments',
                ['BULKPAYMENTS_PRIVILEGE'],
                ['BulkPaymentsGroup'],
              )
            ) {
              total += output.counter.bulkPayments
              counters.push({
                name: 'dashboard.bulkPayments',
                value: output.counter.bulkPayments,
                route: '/myprofile/pending/bulkpayments',
              })
            }
            // MOI payments ------------------------------------------------------------
            if (
              this.checkIsCounter(output.counter.eGovSadad) &&
              this.authenticationService.activateOption(
                'PendingActionMOI',
                ['EGOVERNMENT_PRIVILEGE'],
                ['EgovGroup'],
              )
            ) {
              total += output.counter.eGovSadad
              counters.push({
                name: 'dashboard.moiPayments',
                value: output.counter.eGovSadad,
                route: '/myprofile/pending/moi-payments',
              })
            }
            // government revenue ------------------------------------------------------------
            if (
                (this.checkIsCounter(output.counter.govRevenue) || this.checkIsCounter(output.counter.govRevenueFile)) &&
              this.authenticationService.activateOption(
                'PendingActionGovernmentRevenue',
                ['GOVERNMENTREVENUE_PRIVILEGE'],
                ['GovRevenueGroup', 'GovRevenueBulkUploadGroup'],
              )
            ) {
              total += (output.counter.govRevenue?output.counter.govRevenue:0) + (output.counter.govRevenueFile?output.counter.govRevenueFile:0)
              counters.push({
                name: 'dashboard.governmentRevenue',
                value: (output.counter.govRevenue?output.counter.govRevenue:0) + (output.counter.govRevenueFile?output.counter.govRevenueFile:0),
                route:
                  '/myprofile/pending/government-revenue-transfer-payments',
              })
            }
            // payrolls ------------------------------------------------------------
            if (
              this.checkIsCounter(output.counter.payroll) &&
              this.authenticationService.activateOption(
                'PendingActionPayrollStandard',
                ['PAYROLL_PRIVILEGE'],
                ['PayrollGroup'],
              )
            ) {
              total += output.counter.payroll
              counters.push({
                name: 'dashboard.payrolls',
                value: output.counter.payroll,
                route: '/myprofile/pending/payroll',
              })
            }
            // wps payroll ------------------------------------------------------------
            if (
              this.checkIsCounter(output.counter.wpsPayroll) &&
              this.authenticationService.activateOption(
                'PendingActionWPSPayroll',
                ['WPSPAYROLL_PRIVILEGE'],
                ['WPSPayrollGroup'],
              )
            ) {
              total += output.counter.wpsPayroll
              counters.push({
                name: 'dashboard.wpspayrolls',
                value: output.counter.wpsPayroll,
                route: '/myprofile/pending/wpspayrolls',
              })
            }
            // wms payroll ------------------------------------------------------------
            if (
              this.checkIsCounter(output.counter.wmsPayroll) &&
              this.authenticationService.activateOption(
                'PendingActionWMSPayroll',
                ['WMSPAYROLL_PRIVILEGE'],
                ['WMSPayrollGroup'],
              )
            ) {
              total += output.counter.wmsPayroll
              counters.push({
                name: 'dashboard.wmspayrolls',
                value: output.counter.wmsPayroll,
                route: '/myprofile/pending/wpspayrolls',
              })
            }
            // payroll cards ------------------------------------------------------------
            if (
              this.checkIsCounter(output.counter.payrollCards) &&
              this.authenticationService.activateOption(
                'PendingActionPayrollCards',
                ['PAYROLLCARDS_PRIVILEGE'],
                ['PayrollCardsGroup'],
              )
            ) {
              total += output.counter.payrollCards
              counters.push({
                name: 'dashboard.payrollCards',
                value: output.counter.payrollCards,
                route: '/myprofile/pending/payroll-cards',
              })
            }
            // hajj umrah cards ------------------------------------------------------------
            if (
              this.checkIsCounter(output.counter.hajjUmrahCards) &&
              this.authenticationService.activateOption(
                'PendingActionHajjUmrahCards',
                ['HAJJUMRAHCARDS_PRIVILEGE'],
                ['HajjUmrahCardsGroup'],
              )
            ) {
              total += output.counter.hajjUmrahCards
              counters.push({
                name: 'dashboard.hajjumrahcards',
                value: output.counter.hajjUmrahCards,
                route: '/myprofile/pending/Hajj-Umrah',
              })
            }
            // direct debits ------------------------------------------------------------
            if (
              this.checkIsCounter(output.counter.directDebits) &&
              this.authenticationService.activateOption(
                'PendingActionDirectDebit',
                ['DIRECTDEBITS_PRIVILEGE', 'DIRECTDEBITS_LOCALBANK_PRIVILEGE'],
                ['DirectDebitsGroup'],
              )
            ) {
              total += output.counter.directDebits
              counters.push({
                name: 'dashboard.directDebits',
                value: output.counter.directDebits,
                route: '/myprofile/pending/direct-debits',
              })
            }
            // letter guarantee ------------------------------------------------------------
            /*if (
                        this.checkIsCounter(output.counter.letterGuarantee) &&
                        this.authenticationService.activateOption(
                            'PendingActionLetterGuarantee',
                            [''],
                            ['LetterGuaranteeGroup'])
                    ) {
                        total += output.counter.letterGuarantee;
                        counters.push({
                            name: ("dashboard.letterGuarantee"),
                            value: output.counter.letterGuarantee,
                            route: '/myprofile/pending/letter-guarantee'
                        });
                    }*/
            // sadad OLP ------------------------------------------------------------
            /*if (
                        this.checkIsCounter(output.counter.olpRefund) &&
                        this.authenticationService.activateOption(
                            'PendingActionSadadOLP',
                            [''],
                            ['SadadOLPGroup'])
                    ) {
                        total += output.counter.olpRefund;
                        total += output.counter.olpDisputes;
                        counters.push({
                            name: ("dashboard.olpRefund"),
                            value: output.counter.olpRefund + output.counter.olpDisputes,
                            route: '/myprofile/pending/olpRefund'
                        });
                    }*/
            // invoice HUB ------------------------------------------------------------
            if (
              this.checkIsCounter(output.counter.saddadInvoice) &&
              this.authenticationService.activateOption(
                'PendingActionEsal',
                ['SADAD_INVOICE_HUB_PRIVILEGE'],
                ['SadadInvoiceHubGroup'],
              )
            ) {
              total += output.counter.saddadInvoice
              counters.push({
                name: 'dashboard.invoiceHUB',
                value: output.counter.saddadInvoice,
                route: '/myprofile/pending/invoiceHUB',
              })
            }
            // balance certificate ------------------------------------------------------------
            if (
              this.checkIsCounter(output.counter.balanceCertificate) &&
              this.authenticationService.activateOption(
                'PendingActionBalanceCertificate',
                [],
                ['BalanceCertificateGroup'],
              )
            ) {
              total += output.counter.balanceCertificate
              counters.push({
                name: 'dashboard.balancedCertificate',
                value: output.counter.balanceCertificate,
                route: '/myprofile/pending/balance-certificate',
              })
            }
            // chequebook management ------------------------------------------------------------
            if (
              this.authenticationService.activateOption(
                'PendingActionChequeManagement',
                ['POSITIVEPAYCHECK_PRIVILEGE'],
                [
                  'StopCheckBookGroup',
                  'PositivePayCheckGroup',
                  'RequestCheckBookGroup',
                ],
              )
            ) {
              const keyFinding = []
              if (this.checkIsCounter(output.counter.chequeManagement)) {
                keyFinding.push('chequeManagement')
              } else {
                if (this.checkIsCounter(output.counter.requestCheckBook)) {
                  keyFinding.push('requestCheckBook')
                }
                if (this.checkIsCounter(output.counter.positivePayCheck)) {
                  keyFinding.push('positivePayCheck')
                }
                if (this.checkIsCounter(output.counter.stopCheckBook)) {
                  keyFinding.push('stopCheckBook')
                }
              }

              let chequeManagement = 0
              keyFinding.forEach((keyValue) => {
                if (this.checkIsCounter(output.counter[keyValue])) {
                  chequeManagement += output.counter[keyValue]
                }
              })
              total += chequeManagement
              if (chequeManagement >= 0) {
                counters.push({
                  name: 'dashboard.chequebook',
                  value: chequeManagement,
                  route: '/myprofile/pending/chequebook',
                })
              }
              // ------------------------------------------------------------
              // prepaid cards ------------------------------------------------------
              if (
                this.checkIsCounter(output.counter.prepaidCards) &&
                this.authenticationService.activateOption(
                  'PendingActionsPrepaidCards',
                  ['PREPAID_CARDS_PRIVILEGE'],
                  ['PrepaidCardsPaymentsGroup'],
                )
              ) {
                total += output.counter.prepaidCards
                counters.push({
                  name: 'dashboard.prePaidCards',
                  value: output.counter.prepaidCards,
                  route: '/myprofile/pending/prepaidCards',
                })
              }
              // ------------------------------------------------------------
            }
            // pos statements ------------------------------------------------------------
            if (
              this.checkIsCounter(output.counter.posManagements) &&
              this.authenticationService.activateOption(
                'PendingActionPOS',
                ['POS_MANAGEMENT_PRIVILEGE'],
                ['posManagementGroup'],
              )
            ) {
              total += output.counter.posManagements
              counters.push({
                name: 'dashboard.posStatement',
                value: output.counter.posManagements,
                url: 'pos-statement',
                route: '/myprofile/pending/pos-statement',
              })
            }
            // accounts workflow ------------------------------------------------------------
            if (
              this.checkIsCounter(output.counter.workflow) &&
              this.authenticationService.activateOption(
                'PendingActionWorkFlow',
                [],
                ['CompanyAdmins'],
              )
            ) {
              total += output.counter.workflow
              counters.push({
                name: 'dashboard.workflow',
                value: output.counter.workflow,
                route: '/myprofile/pending/account-workflow',
              })
            }
            // users ------------------------------------------------------------
            if (
              this.checkIsCounter(output.counter.users) &&
              this.authenticationService.activateOption(
                'PendingActionUsersAdd',
                [],
                ['CompanyAdmins'],
              )
            ) {
              total += output.counter.users
              counters.push({
                name: 'dashboard.users',
                value: output.counter.users,
                url: 'users',
                route: '/myprofile/pending/user-management',
              })
            }
            // Commercial Cards ------------------------------------------------------------
            if (
              this.checkIsCounter(output.counter.businessCards) &&
              this.authenticationService.activateOption(
                'PendingActionBusinessCards',
                ['BUSINESS_CARDS_PRIVILEGE'],
                ['BusinessCardsPayments'],
              )
            ) {
              total += output.counter.businessCards
              counters.push({
                name: 'dashboard.commercialCards',
                value: output.counter.businessCards,
                route: '/myprofile/pending/commercialcards',
              })
            }

            // ------------------------------------------------------------
            // prepaid cards ------------------------------------------------------
            if (
              this.checkIsCounter(output.counter.prepaidCards) &&
              this.authenticationService.activateOption(
                'PendingActionsPrepaidCards',
                ['PREPAID_CARDS_PRIVILEGE'],
                ['PrepaidCardsPaymentsGroup'],
              )
            ) {
              total += output.counter.prepaidCards
              counters.push({
                name: 'dashboard.prePaidCards',
                value: output.counter.prepaidCards,
                route: '/myprofile/pending/prepaidCards',
              })
            }
             // soft token ------------------------------------------------------------
             if (
              this.checkIsCounter(output.counter.orderSoftToken) &&
              this.authenticationService.activateOption(
                'TokensManagementAdmin',
                [],
                ['CompanyAdmins'],
              )
            ) {
              total += output.counter.orderSoftToken
              counters.push({
                name: 'Request Soft Token',
                value: output.counter.orderSoftToken,
                route: '/myprofile/pending/soft-token',
              })
            }
            // pos Finance ------------------------------------------------------------
            if (
              this.checkIsCounter(output.counter.financeProduct) &&
              this.authenticationService.activateOption(
                'PendingFinanceProduct',
                ['PRODUCT_FINANCE_PRIVILEGE'],
                ['ProductFinanceGroup'],
              )
            ) {
              total += output.counter.financeProduct
              counters.push({
                name: 'financeProduct.financeProduct',
                value: output.counter.financeProduct,
                route: '/myprofile/pending/financeProduct',
              })
            }
            // ------------------------------------------------------------
          }

          return {
            counters,
            total,
          }
        }),
      )
  }

  checkIsCounter(counter) {
    return typeof counter !== 'undefined' && counter >= 0
  }

  public getNewMails(): Observable<any> {
    const data = {
      folder: 'I',
      order: 'date',
      orderType: 'desc',
      page: 1,
      rows: 10,
      displayLoading: false,
    }
    return this.http
      .post<MailResponse>(this.servicesUrl + '/mailCenter/getMails', data)
      .pipe(
        map((response: MailResponse) => {
          const mails: Mail[] = []
          let unread = 0
          if (response.errorCode !== '-1') {
            const output = response.mailBoxDTO
            unread = output.unRead
            const size = output.mailList.length
            for (let _i = 0; _i < size; _i++) {
              const jsonObj = output.mailList[_i]
              const mail: Mail = new MailBuilder()
                .withMailId(jsonObj.mailPk)
                .withSubject(jsonObj.subject)
                .withContent(jsonObj.content)
                .withFrom(jsonObj.from)
                .withFromName(jsonObj.fromName)
                .withTo(jsonObj.to)
                .withToName(jsonObj.toName)
                .withStatus(jsonObj.status)
                .withDate(jsonObj.date)
                .build()
              mails.push(mail)
            }
          }
          const returnValue = {
            mails,
            unread,
          }
          return returnValue
        }),
      )
  }

  /**
   * @deprecated
   */
  public getPdf(): Observable<any> {
    return this.http.get(
      this.servicesUrl +
        '/../sme/loginDocuments/' +
        (this.translate.currentLang == 'ar'
          ? 'SME_Manual_Arabic'
          : 'SME_Manual_English') +
        '.pdf',
      { responseType: 'blob' },
    )
  }

  public updateIPSTCStatus(ipstcstatus): Observable<any> {
    return this.http
      .put(this.servicesUrl + '/postLogin/updateIPSTCStatus', ipstcstatus)
      .pipe(
        map((response: any) => response),
        catchError(this.handleError),
      )
  }

  public updateUrPayLimit(amount): Observable<any> {
    return this.http
      .post(this.servicesUrl + '/urPay/updateLimit', { amount })
      .pipe(
        map((response: any) => response),
        catchError(this.handleError),
      )
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
    return observableThrowError(errorService)
  }

}

// tslint:disable-next-line:max-classes-per-file
export class MailResponse {
  errorCode: any
  mailBoxDTO: any
}

// tslint:disable-next-line:max-classes-per-file
export class PendingResponse {
  errorCode: any
  counter: any
}
