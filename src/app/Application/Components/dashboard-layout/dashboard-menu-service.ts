import { Injectable, Injector } from '@angular/core'
import { AuthenticationService } from '../../../core/security/authentication.service'
import { ConfigResourceService } from '../../../core/config/config.resource.local'
import { TranslateService } from '@ngx-translate/core'
import { StorageService } from 'app/core/storage/storage.service'

@Injectable()
export class DashboardMenuService {


  constructor(public authenticationService: AuthenticationService, public translate: TranslateService,
    public config: ConfigResourceService,
    public injector: Injector) {

  }

  isDualCompany() {
    const storageService = this.injector.get(StorageService)
    const company = storageService.retrieve('company')
    return company.dualAuthorization
  }

  getMenuRight() {
    const data = {
      up: [
        {
          name: 'menu.right_side.preferences.menu',
          icon: 'icon -preferences',
          privilege: true,
          submenu: [
            {
              name: 'menu.right_side.preferences.change_password',
              privilege: true,
              route: ['/preferences/changePassword'],
            },
            {
              name: 'menu.right_side.preferences.entitlements',
              privilege: true,
              route: ['/preferences/user-profile'],
            },
            {
              name: 'menu.right_side.preferences.update_user_details',
              privilege: true,
              route: ['/preferences/updateUserDetails'],
            },
            {
              name: 'menu.right_side.preferences.organization_details',
              privilege: true,
              route: ['/preferences/organizationDetails'],
            },
            {
              name: 'menu.company_admin.manage.account_nickname',
              privilege: this.authenticationService.activateOption(
                'AccountsNickName',
                [],
                ['AccountNicknameGroup'],
              ),
              route: ['/accounts/preferences'],
            },
            {
              name: 'menu.company_admin.rmInformation.relationshipManager',
              privilege: this.authenticationService.activateOption(
                  'RMInformation',
                  [],
                  ['corporate'],
              ),
              route: ['/companyadmin/rm-information'],
            }
          ],
        },
        {
          name: 'menu.right_side.activity_logs.menu',
          icon: 'icon -activity-log',
          privilege: this.authenticationService.activateOption(
            'ActivityLogs',
            [],
            ['corporate'],
          ),
          submenu: [
            {
              name: 'menu.right_side.activity_logs.activity_logs',
              icon: 'icon -activity-log',
              privilege: this.authenticationService.activateOption(
                'ActivityLogs',
                [],
                ['corporate'],
              ),
              route: ['/myprofile/activityLogs'],
            },
          ],
        },
        {
          name: 'menu.right_side.tools.menu',
          icon: 'icon -tools',
          privilege: this.authenticationService.activateOption(
            'TransferFxRates',
            [],
            [],
          ),
          submenu: [
            {
              name: 'menu.transfers.transfers.fx_rates',
              icon: 'icon -tools',
              privilege: this.authenticationService.activateOption(
                'TransferFxRates',
                [],
                [],
              ),
              route: ['/transfers/fx-rates'],
            },
          ],
        },
        {
          name: 'menu.right_side.alert_setup.menu',
          icon: 'icon -alert-setup',
          privilege: this.authenticationService.activateOption(
            'AlertsMenu',
            ['ALERTS_PRIVILEGE'],
            ['AlertsUserGroup'],
          ),
          submenu: [
            {
              name: 'menu.right_side.alert_setup.alerts',
              privilege: this.authenticationService.activateOption(
                'AlertsMenu',
                ['ALERTS_PRIVILEGE'],
                ['AlertsUserGroup'],
              ),
              route: ['/myprofile/alerts'],
            },
          ],
        },
        {
          name: 'public.help',
          icon: 'icon -help',
          privilege: true,
          submenu: [
            {
              name: 'dashboard.tooltip',
              privilege: true,
              route: ['/help/tooltip'],
            },
            {
              name: 'dashboard.askAlRajhi',
              privilege: true,
              route: ['/help/askAlRajhi'],
            },
            {
              name: 'dashboard.faqs',
              privilege: true,
              extLink: [this.config.getDocumentUrl() + '/AlRajhi_Business_FAQ_V2.4_' + this.translate.currentLang + '.pdf'],
            },

            {
              name: 'public.help',
              privilege: true,
              link: ['help/helpindex'],
            },
          ],
        },

      ],
      down: [],
    }

    return data
  }

  getMenuLeft() {
    const data = {
      up: [
        {
          name: 'menu.dashboard',
          icon: 'icon -dashboard',
          privilege: true,
          active: true,
          route: ['/'],
        },
        {
          name: 'menu.account_management.menu',
          icon: 'icon -user-accounts',
          privilege: this.authenticationService.activateOption(
            'AccountsManagement',
            [],
            [
              'BalanceCertificateGroup',
              'RequestCheckBookGroup',
              'InquiryGroup',
              'PosStatementGroup',
            ],
          ),
          submenu: [
            {
              name: 'menu.account_management.current_accounts.menu',
              privilege: this.authenticationService.activateOption(
                'AccountsMenu',
                [],
                ['InquiryGroup'],
              ),
              submenu: [
                {
                  name: 'menu.account_management.current_accounts.statement',
                  privilege: this.authenticationService.activateOption(
                    'AccountsStatement',
                    [],
                    ['InquiryGroup'],
                  ),
                  route: ['/accounts/currentAccounts'],
                },
                {
                  name: 'menu.account_management.current_accounts.requested_statement',
                  privilege: this.authenticationService.activateOption(
                    'RequestedStatement',
                    [],
                    ['InquiryGroup'],
                  ),
                  route: ['/accounts/requestStatement'],
                },
                {
                  name: 'menu.account_management.current_accounts.monthly_statement',
                  privilege: this.authenticationService.activateOption(
                    'MonthlyStatement',
                    [],
                    ['InquiryGroup'],
                  ),
                  route: ['/accounts/monthly-statements'],
                },
                {
                  name: 'menu.account_management.current_accounts.swift_mt940_statement',
                  privilege: this.authenticationService.activateOption(
                    'SwiftMt940Statement',
                    [],
                    ['DailyMT940Group', 'MonthlyMT940Group'],
                  ),
                  route: ['/accounts/mtStatement'],
                },
                {
                  name: 'menu.account_management.current_accounts.vat_invoice',
                  privilege: this.authenticationService.activateOption(
                    'TaxInvoice',
                    [],
                    ['VatMonthlyReportGroup'],
                  ),
                  route: ['/accounts/vatInvocie'],
                },
              ],
            },
            {
              name: 'menu.account_management.liquidity_management.menu',
              privilege: this.authenticationService.activateOption(
                'CashManagementMenu',
                ['CASH_MANAGEMENT_PRIVILEGE'],
                ['CMReportGroup', 'CMPoolingGroup', 'CMSweepingGroup'],
              ),
              submenu: [
                {
                  name: 'menu.account_management.liquidity_management.sweeping',
                  privilege: this.authenticationService.activateOption(
                    'CashManagementSweeping',
                    ['CASH_MANAGEMENT_PRIVILEGE'],
                    ['CMSweepingGroup'],
                  ),
                  route: ['/cashManagement/sweeping'],
                },
                {
                  name: 'menu.account_management.liquidity_management.pooling',
                  privilege: this.authenticationService.activateOption(
                    'CashManagementPooling',
                    ['CASH_MANAGEMENT_PRIVILEGE'],
                    ['CMPoolingGroup'],
                  ),
                  route: ['/cashManagement/pooling'],
                },
                {
                  name: 'menu.account_management.liquidity_management.reports',
                  privilege: this.authenticationService.activateOption(
                    'CashManagementReports',
                    ['CASH_MANAGEMENT_PRIVILEGE'],
                    ['CMReportGroup'],
                  ),
                  route: ['/cashManagement/reports'],
                },
              ],
            },
            {
              name: 'menu.account_management.customer_documents.menu',
              privilege: this.authenticationService.activateOption(
                  'DigitalDocuments',
                  [],
                  ['CompanyAdmins'],
              ),
              submenu: [
                {
                  name: 'menu.account_management.customer_documents.request_new',
                  privilege: this.authenticationService.activateOption(
                      'RequestNewDocument',
                      [],
                      ['CompanyAdmins'],
                  ),
                  route: ['/accounts/customerDocuments/requestNewDocument'],
                },
                {
                  name: 'menu.account_management.customer_documents.view_status',
                  privilege: this.authenticationService.activateOption(
                      'ViewDocumentsStatus',
                      [],
                      ['CompanyAdmins'],
                  ),
                  route: ['/accounts/customerDocuments/viewDocumentsStatus'],
                },
              ],
            },
            {
              name: 'menu.account_management.balance_certificate.menu',
              privilege: this.authenticationService.activateOption(
                'BalanceCertificateMenu',
                [],
                ['BalanceCertificateGroup'],
              ),
              submenu: [
                {
                  name: 'menu.account_management.balance_certificate.list_of_certificates',
                  privilege: this.authenticationService.activateOption(
                    'BalanceCertificateList',
                    [],
                    ['BalanceCertificateGroup'],
                  ),
                  route: ['/accounts/balanceCertificate'],
                },
                {
                  name: 'menu.account_management.balance_certificate.request_status',
                  privilege: this.authenticationService.activateOption(
                    'BalanceCertificateRequestStatus',
                    [],
                    ['BalanceCertificateGroup'],
                  ),
                  route: ['/accounts/balanceCertificate/request-status'],
                },
              ],
            },
          ],
        },
        {
          name: 'menu.gold-wallet.menu',
          icon: 'icon -gold-wallet-icon',
          hint: 'menu.new',

          privilege: this.authenticationService.activateOption('GoldWallet', [], []),
          submenu: [
            {
              name: 'gold-wallet.dashboard',
              route: ['/gold-wallet'],
              privilege: this.authenticationService.activateOption(
                  'GoldWallet',
                  [],
                  [],
              )
            }]
        },
        {
          name: 'menu.cards.menu',
          icon: 'icon -business-cards',
          privilege: this.authenticationService.activateOption(
            'CardsManagement',
            [],
            [
              'BusinessCardsDisplay',
              'BusinessCardsPayments',
              'BusinessCardsActivate',
              'BusinessCardsManagementPIN',
              'BusinessCardsBlock',
              'BusinessCardsBlockReplace',
              'CompanyAdmins',
              'PrepaidCardsDisplayGroup',
              'PrepaidCardsRequestActivateGroup',
              'PrepaidCardsPaymentsGroup',
            ],
          ),
          submenu: [
            {
              name: 'menu.commercial_cards.menu',
              icon: 'icon -business-cards',
              privilege: this.authenticationService.activateOption(
                'BusinessCardsMenu',
                ['BUSINESS_CARDS_PRIVILEGE'],
                [
                  'BusinessCardsDisplay',
                  'BusinessCardsPayments',
                  'BusinessCardsActivate',
                  'BusinessCardsManagementPIN',
                  'BusinessCardsBlock',
                  'BusinessCardsBlockReplace',
                ],
              ),
              submenu: [
                {
                  name: 'menu.commercial_cards.creditCardListName',
                  privilege: this.authenticationService.activateOption(
                    'BusinessCardsDisplay',
                    ['BUSINESS_CARDS_PRIVILEGE'],
                    ['BusinessCardsDisplay'],
                  ),
                  route: ['/businessCards/creditcardlist'],
                },
                {
                  name: 'menu.commercial_cards.request_status',
                  privilege: this.authenticationService.activateOption(
                    'BusinessCardsRequestStatus',
                    ['BUSINESS_CARDS_PRIVILEGE'],
                    ['BusinessCardsDisplay', 'BusinessCardsPayments'],
                  ),
                  route: ['/businessCards/requeststatus'],
                },
              ],
            },
            {
              name: 'menu.account_management.mada_business_cards.menu',
              privilege: this.authenticationService.activateOption(
                'DebitCardsMenu',
                [],
                ['CompanyAdmins'],
              ),
              submenu: [
                {
                  name: 'menu.account_management.mada_business_cards.list_of_cards',
                  privilege: this.authenticationService.activateOption(
                    'DebitCardsList',
                    [],
                    ['CompanyAdmins'],
                  ),
                  route: ['/debit-cards/list'],
                },
                {
                  name: 'menu.account_management.mada_business_cards.apply_card',
                  privilege: this.authenticationService.activateOption(
                      'DebitCardsRequest',
                      [],
                      ['CompanyAdmins'],
                  ),
                  route: ['/debit-cards/apply'],
                },
              ],
            },
            {
              name: 'menu.account_management.credit_cards.menu',
              privilege: this.authenticationService.activateOption(
                'CreditCardsMenu',
                [],
                ['CcGroup'],
              ),
              submenu: [
                {
                  name: 'menu.account_management.credit_cards.list_of_cards',
                  privilege: this.authenticationService.activateOption(
                    'CreditCardsList',
                    [],
                    ['CcGroup'],
                  ),
                  route: ['/credit-cards'],
                },
                {
                  name: 'menu.account_management.credit_cards.activate_card',
                  privilege: this.authenticationService.activateOption(
                    'CreditCardsActivate',
                    [],
                    ['CcGroup'],
                  ),
                  route: ['/credit-cards/activate'],
                },
              ],
            },
            {
              name: 'menu.prePaid_cards.menu',
              icon: 'icon -credit-cards',
              hint: 'menu.new',
              privilege: this.authenticationService.activateOption(
                'PrepaidCardsMenu',
                ['PREPAID_CARDS_PRIVILEGE'],
                [
                  'PrepaidCardsDisplayGroup',
                  'PrepaidCardsRequestActivateGroup',
                  'PrepaidCardsPaymentsGroup',
                ],
              ),
              submenu: [
                {
                  name: 'menu.prePaid_cards.prePaidCardsList',
                  privilege: this.authenticationService.activateOption(
                    'PrepaidCardsMenu',
                    ['PREPAID_CARDS_PRIVILEGE'],
                    ['PrepaidCardsDisplayGroup'],
                  ),
                  route: ['/prepaid-card/prepaidcardlist'],
                },
                {
                  name: 'menu.prePaid_cards.prePaidCardsRequest',
                  privilege: this.authenticationService.activateOption(
                    'PrepaidCardsRequest',
                    ['PREPAID_CARDS_PRIVILEGE'],
                    ['CompanyAdmins'],
                  ),
                  route: ['/prepaid-card/prepaidcardrequest'],
                },
                {
                  name: 'menu.prePaid_cards.request_status',
                  privilege: this.authenticationService.activateOption(
                    'PrepaidCardsStatus',
                    ['PREPAID_CARDS_PRIVILEGE'],
                    ['PrepaidCardsPaymentsGroup'],
                  ),
                  route: ['/prepaid-card/requeststatus'],
                },
              ],
            },
            {
              name: 'mrcc.name',
              icon: 'icon -credit-cards',
              hint: 'menu.new',
              privilege: this.authenticationService.activateOption(
                'MRCCAcquisition',
                ['MRCC_PRIVILEGE'],
                ['CompanyAdmins'],
              ),
              route: ['/mrcc/newRequest'],
            },
          ],
        },
        {
          name: 'menu.business-hub.menu',
          icon: 'icon -credit-cards',
          hint: 'menu.new',
          privilege: this.authenticationService.activateOption(
            'BusinessHub',
            [],
            ['CompanyAdmins'],
          ),
          submenu: [
            {
              name: 'menu.business-hub.zid.menu',
              icon: 'icon -credit-cards',
              privilege: this.authenticationService.activateOption(
                'BusinessHubInvoicingDashboard',
                [],
                [],
              ),
              route: ['/business-hub/zid/dashboard'],
            },
            {
              name: 'menu.business-hub.Qoyod.menu',
              icon: 'icon -credit-cards',
              privilege: this.authenticationService.activateOption(
                'BusinessHubEcommerceDashboard',
                [],
                [],
              ),
              route: ['/business-hub/qoyod/dashboard'],
            },
          ],
        },
        {
          name: 'menu.transfers.menu',
          icon: 'icon -transfers',
          privilege: this.authenticationService.activateOption(
            'TransfersManagement',
            [],
            [],
          ),
          submenu: [
            {
              name: 'menu.transfers.transfers.menu',
              privilege: this.authenticationService.activateOption(
                'TransferMenu',
                [
                  'TRANSFER_PRIVILEGE_OWNACCOUNTS',
                  'TRANSFER_PRIVILEGE_LOCALBANK',
                  'TRANSFER_PRIVILEGE_LOCALBANK',
                  'TRANSFER_PRIVILEGE_REMITTANCES',
                ],
                ['TfOwnGroup', 'TfGroup', 'TfRemGroup', 'TfLocalGroup'],
              ),
              submenu: [
                {
                  name: 'menu.transfers.transfers.own_accounts',
                  privilege: this.authenticationService.activateOption(
                    'TransferOwn',
                    ['TRANSFER_PRIVILEGE_OWNACCOUNTS'],
                    ['TfOwnGroup'],
                  ),
                  route: ['/transfers/operation/owerTransfer'],
                },
                {
                  name: 'menu.transfers.transfers.rajhi_transfer',
                  privilege: this.authenticationService.activateOption(
                    'TransferAlRajhi',
                    ['TRANSFER_PRIVILEGE'],
                    ['TfGroup'],
                  ),
                  route: ['/transfers/operation/rajhiTransfer'],
                },
                {
                  name: 'menu.transfers.transfers.local_transfer',
                  privilege: this.authenticationService.activateOption(
                    'TransferLocal',
                    ['TRANSFER_PRIVILEGE_LOCALBANK'],
                    ['TfLocalGroup'],
                  ),
                  route: ['/transfers/operation/localTransfer'],
                },
                {
                  name: 'menu.transfers.transfers.international_transfer',
                  privilege: this.authenticationService.activateOption(
                    'TransferInternational',
                    ['TRANSFER_PRIVILEGE_REMITTANCES'],
                    ['TfRemGroup'],
                  ),
                  route: ['/transfers/operation/internationalTransfer'],
                },
                {
                  name: 'charity.charityTransfer',
                  privilege: this.authenticationService.activateOption(
                      'TransferLocal',
                      [],
                      [],
                  ),
                  route: ['/transfers/charity/community-services'],
                },
                {
                  name: 'uRPay.name',
                  hint: 'menu.new',
                  privilege: this.authenticationService.activateOption(
                    'URPayService',
                    ['TRANSFER_PRIVILEGE_LOCALBANK'],
                    ['CompanyAdmins','URPayGroup'],
                  ),
                  route: ['/transfers/uRPay'],
                },
                {
                  name: 'rtp.rtp',
                  hint: 'menu.new',
                  privilege: this.authenticationService.activateOption(
                      'RTPService',
                      ['TRANSFER_PRIVILEGE_LOCALBANK'],
                      ['rtpGroup','CompanyAdmins'],
                  ),
                  route: ['/transfers/rtPay'],
                },
                {
                  name: 'menu.transfers.transfers.processed_Transactions',
                  privilege: this.authenticationService.activateOption(
                    'TransferProcessedTransaction',
                    [
                      'TRANSFER_PRIVILEGE_OWNACCOUNTS',
                      'TRANSFER_PRIVILEGE_LOCALBANK',
                      'TRANSFER_PRIVILEGE_LOCALBANK',
                      'TRANSFER_PRIVILEGE_REMITTANCES',
                    ],
                    ['TfOwnGroup', 'TfGroup', 'TfRemGroup', 'TfLocalGroup'],
                  ),
                  route: ['/transfers/processedTransactions'],
                },

                {
                  name: 'menu.transfers.transfers.request_status',
                  privilege: this.authenticationService.activateOption(
                    'TransferRequestStatus',
                    [
                      'TRANSFER_PRIVILEGE_OWNACCOUNTS',
                      'TRANSFER_PRIVILEGE_LOCALBANK',
                      'TRANSFER_PRIVILEGE_LOCALBANK',
                      'TRANSFER_PRIVILEGE_REMITTANCES',
                    ],
                    ['TfOwnGroup', 'TfGroup', 'TfRemGroup', 'TfLocalGroup'],
                  ),
                  route: ['/transfers/requestStatus'],
                },
              ],
            },
            {
              name: 'menu.transfers.beneficiaries.menu',
              privilege: this.authenticationService.activateOption(
                'BeneficiariesMenu',
                [
                  'TRANSFER_PRIVILEGE_OWNACCOUNTS',
                  'TRANSFER_PRIVILEGE_LOCALBANK',
                  'TRANSFER_PRIVILEGE_LOCALBANK',
                  'TRANSFER_PRIVILEGE_REMITTANCES',
                ],
                ['TfRemGroup', 'TfLocalGroup', 'TfGroup'],
              ),
              submenu: [
                {
                  name: 'menu.transfers.beneficiaries.list_of_beneficiaries',
                  privilege: this.authenticationService.activateOption(
                    'BeneficiaryList',
                    [
                      'TRANSFER_PRIVILEGE_OWNACCOUNTS',
                      'TRANSFER_PRIVILEGE_LOCALBANK',
                      'TRANSFER_PRIVILEGE_LOCALBANK',
                      'TRANSFER_PRIVILEGE_REMITTANCES',
                    ],
                    ['TfRemGroup', 'TfLocalGroup', 'TfGroup'],
                  ),
                  route: ['/beneficiaries/beneficiaryList'],
                },
                {
                  name: 'menu.transfers.beneficiaries.add_beneficiary',
                  privilege: this.authenticationService.activateOption(
                    'BeneficiaryAdd',
                    [
                      'TRANSFER_PRIVILEGE_OWNACCOUNTS',
                      'TRANSFER_PRIVILEGE_LOCALBANK',
                      'TRANSFER_PRIVILEGE_LOCALBANK',
                      'TRANSFER_PRIVILEGE_REMITTANCES',
                    ],
                    ['TfRemGroup', 'TfLocalGroup', 'TfGroup'],
                  ),
                  route: ['/beneficiaries/AddBeneficiaries'],
                },
                {
                  name: 'menu.transfers.beneficiaries.request_status',
                  privilege: this.authenticationService.activateOption(
                    'BeneficiaryRequestStatus',
                    [
                      'TRANSFER_PRIVILEGE_OWNACCOUNTS',
                      'TRANSFER_PRIVILEGE_LOCALBANK',
                      'TRANSFER_PRIVILEGE_LOCALBANK',
                      'TRANSFER_PRIVILEGE_REMITTANCES',
                    ],
                    ['TfRemGroup', 'TfLocalGroup', 'TfGroup'],
                  ),
                  route: ['/beneficiaries/requestStatus'],
                },
              ],
            },
            {
              name: 'menu.transfers.bulk_payment.menu',
              privilege: this.authenticationService.activateOption(
                'BulkPaymentsMenu',
                [],
                [],
              ),
              submenu: [
                {
                  name: 'menu.transfers.bulk_payment.request_new',
                  privilege: this.authenticationService.activateOptionWithoutService( ['BULKPAYMENTS_PRIVILEGE'], []) ?
                      false : this.authenticationService.activateOption(
                          'BulkPaymentsSelfOnboarding',
                          [],
                      ['CompanyAdmins'],
                  ),
                  route: ['/bulk-payment/selfOnboard'],
                },
                {
                  name: 'menu.transfers.bulk_payment.upload_file',
                  privilege: this.authenticationService.activateOption(
                    'BulkUploadFile',
                    ['BULKPAYMENTS_PRIVILEGE'],
                    ['BulkPaymentsGroup'],
                  ),
                  route: ['/bulk-payment/uploadFile'],
                },
                {
                  name: 'menu.transfers.bulk_payment.processed_file',
                  privilege: this.authenticationService.activateOption(
                    'BulkProcessedFiles',
                    ['BULKPAYMENTS_PRIVILEGE'],
                    ['BulkPaymentsGroup'],
                  ),
                  route: ['/bulk-payment/processedFile'],
                },
                {
                  name: 'menu.transfers.bulk_payment.request_status',
                  privilege: this.authenticationService.activateOption(
                    'BulkPaymentsRequestStatus',
                    ['BULKPAYMENTS_PRIVILEGE'],
                    ['BulkPaymentsGroup'],
                  ),
                  route: ['/bulk-payment/reqStatus'],
                },
                {
                  name: 'menu.transfers.bulk_payment.download_template',
                  privilege: this.authenticationService.activateOption(
                    'BulkDownloadTemplates',
                    ['BULKPAYMENTS_PRIVILEGE'],
                    ['BulkPaymentsGroup'],
                  ),
                  route: ['/bulk-payment/downloadTemp'],
                },
              ],
            },
            {
              name: 'menu.transfers.standing_orders.menu',
              privilege: this.authenticationService.activateOption(
                'StandingOrderMenu',
                ['STANDORD_PRIVILEGE'],
                ['OrdGroup'],
              ),

              submenu: [
                {
                  name: 'menu.transfers.standing_orders.list_of_orders',
                  privilege: this.authenticationService.activateOption(
                    'StandingOrderList',
                    ['STANDORD_PRIVILEGE'],
                    ['OrdGroup'],
                  ),
                  route: ['/payments/stadingOrders'],
                },
                {
                  name: 'menu.transfers.standing_orders.request_status',
                  privilege: this.authenticationService.activateOption(
                    'StandingOrderRequestStatus',
                    ['STANDORD_PRIVILEGE'],
                    ['OrdGroup'],
                  ),
                  route: ['/payments/stadingOrders/requestStatus'],
                },
              ],
            },
            {
              name: 'menu.company_admin.saudi-payments.account-verify.accountVerify',
              privilege: this.authenticationService.activateOption(
                  'AccountVerification',
                  [],
                  ['CompanyAdmins'],
              ),
              submenu: [
                {
                  name: 'menu.company_admin.saudi-payments.account-verify.accountVerifyList',
                  privilege: this.authenticationService.activateOption(
                      'AccountVerification',
                      [],
                      ['CompanyAdmins'],
                  ),
                  route: ['/companyadmin/saudi-payments/account-verification/list'],
                },
                {
                  name: 'menu.company_admin.saudi-payments.account-verify.accountVerifyNew',
                  privilege: this.authenticationService.activateOption(
                      'AccountVerification',
                      [],
                      ['CompanyAdmins'],
                  ),
                  route: ['/companyadmin/saudi-payments/account-verification/new'],
                }
              ]
            },
          ],
        },
        {
          name: 'menu.payments.menu',
          icon: 'icon -salary-payments',
          privilege: this.authenticationService.activateOption(
            'PaymentsManagement',
            [
              'ARAMCOPAYMENTS_PRIVILEGE',
              'GOVERNMENTREVENUE_PRIVILEGE',
              'HAJJUMRAHCARDS_PRIVILEGE',
            ],
            [
              'AramcoPaymentsGroup',
              'GovRevenueGroup',
              'GovRevenueBulkUploadGroup',
              'GovRevenueGroupAdmin',
              'HajjUmrahCardsGroup',
            ],
          ),
          submenu: [
            {
              name: 'menu.payments.aramco.menu',
              privilege: this.authenticationService.activateOption(
                'AramcoPaymentMenu',
                ['ARAMCOPAYMENTS_PRIVILEGE'],
                ['AramcoPaymentsGroup'],
              ),
              submenu: [
                {
                  name: 'menu.payments.aramco.payment',
                  privilege: this.authenticationService.activateOption(
                    'AramcoPayment',
                    ['ARAMCOPAYMENTS_PRIVILEGE'],
                    ['AramcoPaymentsGroup'],
                  ),
                  route: ['/aramcoPayments/beneficiaries/payment'],
                },
                {
                  name: 'menu.payments.aramco.request_status',
                  privilege: this.authenticationService.activateOption(
                    'AramcoPaymentRequestStatus',
                    ['ARAMCOPAYMENTS_PRIVILEGE'],
                    ['AramcoPaymentsGroup'],
                  ),
                  route: ['/aramcoPayments/request-status'],
                },
              ],
            },
            {
              name: 'menu.payments.dividends.menu',
              privilege: this.authenticationService.activateOption(
                'DividendDistributionMenu',
                ['DIVIDEND_DISTRIBUTION_PRIVILEGE'],
                ['DividendDistribGroup'],
              ),
              submenu: [
                {
                  name: 'menu.payments.dividends.inquiry',
                  privilege: this.authenticationService.activateOption(
                    'DividendDistributionInquiry',
                    ['DIVIDEND_DISTRIBUTION_PRIVILEGE'],
                    ['DividendDistribGroup'],
                  ),
                  route: ['/dividend-distribution/inquiry'],
                },
                {
                  name: 'menu.payments.dividends.reports',
                  privilege: this.authenticationService.activateOption(
                    'DividendDistributionReports',
                    ['DIVIDEND_DISTRIBUTION_PRIVILEGE'],
                    ['DividendDistribGroup'],
                  ),
                  route: ['/dividend-distribution/reports'],
                },
              ],
            },
            {
              name: 'menu.payments.government_revenue.menu',
              privilege: this.authenticationService.activateOption(
                'GovernmentRevenueMenu',
                ['GOVERNMENTREVENUE_PRIVILEGE'],
                ['GovRevenueGroup', 'GovRevenueBulkUploadGroup', 'GovRevenueGroupAdmin'],
              ),
              submenu: [
                {
                  name: 'menu.payments.government_revenue.payment',
                  privilege: this.authenticationService.activateOption(
                    'GovernmentRevenueNewPayment',
                    ['GOVERNMENTREVENUE_PRIVILEGE'],
                    ['GovRevenueGroup'],
                  ),
                  route: ['/government-revenue/new-payment'],
                },
                {
                  name: 'menu.payments.government_revenue.processed_operations',
                  privilege: this.authenticationService.activateOption(
                    'GovernmentRevenuePreviousPayment',
                    ['GOVERNMENTREVENUE_PRIVILEGE'],
                    ['GovRevenueGroup', 'GovRevenueBulkUploadGroup'],
                  ),
                  route: ['/government-revenue/processed-operation'],
                },
                {
                  name: 'menu.payments.government_revenue.request_status',
                  privilege: this.authenticationService.activateOption(
                    'GovernmentRevenueRequestStatus',
                    ['GOVERNMENTREVENUE_PRIVILEGE'],
                    ['GovRevenueGroup', 'GovRevenueBulkUploadGroup'],
                  ),
                  route: ['/government-revenue/request-status'],
                },
                {
                  name: 'menu.payments.government_revenue.upload_file',
                  privilege: this.authenticationService.activateOption(
                    'GovernmentRevenueFileUpload',
                    ['GOVERNMENTREVENUE_PRIVILEGE'],
                    ['GovRevenueBulkUploadGroup'],
                  ),
                  route: ['/government-revenue/upload-file'],
                },
              ],
            },
            {
              name: 'menu.payments.hajjumrahcards.menu',
              privilege: this.authenticationService.activateOption(
                'HajjUmrahMenu',
                ['HAJJUMRAHCARDS_PRIVILEGE'],
                ['HajjUmrahCardsGroup'],
              ),
              submenu: [
                {
                  name: 'menu.payments.hajjumrahcards.list_of_cards',
                  privilege: this.authenticationService.activateOption(
                    'HajjUmrahCardList',
                    ['HAJJUMRAHCARDS_PRIVILEGE'],
                    ['HajjUmrahCardsGroup'],
                  ),
                  route: ['/hajjandumrahcards/cardinquires'],
                },
                {
                  name: 'menu.payments.hajjumrahcards.allocate_card',
                  privilege: this.authenticationService.activateOption(
                    'HajjUmrahAllocationCards',
                    ['HAJJUMRAHCARDS_PRIVILEGE'],
                    ['HajjUmrahCardsGroup'],
                  ),
                  route: ['/hajjandumrahcards/cardallocationrequest'],
                },
                {
                  name: 'menu.payments.hajjumrahcards.operations',
                  privilege: this.authenticationService.activateOption(
                    'HajjUmrahCardOperations',
                    ['HAJJUMRAHCARDS_PRIVILEGE'],
                    ['HajjUmrahCardsGroup'],
                  ),
                  route: ['/hajjandumrahcards/cardoperation'],
                },
                {
                  name: 'menu.payments.hajjumrahcards.reports',
                  privilege: this.authenticationService.activateOption(
                    'HajjUmrahCardsReports',
                    ['HAJJUMRAHCARDS_PRIVILEGE'],
                    ['HajjUmrahCardsGroup'],
                  ),
                  route: ['/hajjandumrahcards/reports'],
                },
                {
                  name: 'menu.payments.hajjumrahcards.request_status',
                  privilege: this.authenticationService.activateOption(
                    'HajjUmrahRequestStatus',
                    ['HAJJUMRAHCARDS_PRIVILEGE'],
                    ['HajjUmrahCardsGroup'],
                  ),
                  route: ['/hajjandumrahcards/reqStatus'],
                },
              ],
            },
          ],
        },
        {
          name: 'menu.sadad.menu',
          icon: 'icon -ksa-sadad',
          privilege: this.authenticationService.activateOption(
            'SadadManagement',
            [
              'BILLPAYMENTS_PRIVILEGE',
              'SADAD_INVOICE_HUB_PRIVILEGE',
              'EGOVERNMENT_PRIVILEGE',
            ],
            [
              'BillPayGroup',
              'BillPayAdders',
              'SadadInvoiceHubGroup',
              'EgovGroup',
            ],
          ),
          submenu: [
            {
              name: 'menu.sadad.government_payment.menu',
              privilege: this.authenticationService.activateOption(
                'MOIPaymentMenu',
                ['EGOVERNMENT_PRIVILEGE'],
                ['EgovGroup'],
              ),
              submenu: [
                {
                  name: 'menu.sadad.government_payment.payments',
                  privilege: this.authenticationService.activateOption(
                    'MOIPayment',
                    ['EGOVERNMENT_PRIVILEGE'],
                    ['EgovGroup'],
                  ),
                  route: ['/payments/moi/payments'],
                },
                {
                  name: 'menu.sadad.government_payment.bulk-payments',
                  privilege: this.authenticationService.activateOption(
                      'MOIBulkPayment',
                      ['EGOVERNMENT_PRIVILEGE'],
                      ['EgovGroup'],
                  ),
                  route: ['/payments/moi/bulk-payments'],
                },
                {
                  name: 'menu.sadad.government_payment.refunds',
                  privilege: this.authenticationService.activateOption(
                    'MOIRefunds',
                    ['EGOVERNMENT_PRIVILEGE'],
                    ['EgovGroup'],
                  ),
                  route: ['/payments/moi/refunds'],
                },
                {
                  name: 'menu.sadad.government_payment.feedback_files',
                  privilege: this.authenticationService.activateOption(
                    'MOIFeedBackFiles',
                    ['EGOVERNMENT_PRIVILEGE'],
                    ['EgovGroup'],
                  ),
                  route: ['/payments/moi/feedback-files'],
                },
                {
                  name: 'menu.transfers.transfers.processed_Transactions',
                  privilege: this.authenticationService.activateOption(
                    'MOIPaymentMenu',
                    ['EGOVERNMENT_PRIVILEGE'],
                    ['EgovGroup'],
                  ),
                  route: ['/payments/moi/processedTransactions'],
                },
                {
                  name: 'menu.sadad.government_payment.request_status',
                  privilege: this.authenticationService.activateOption(
                    'MOIRequestStatus',
                    ['EGOVERNMENT_PRIVILEGE'],
                    ['EgovGroup'],
                  ),
                  route: ['/payments/moi/request-status'],
                },
              ],
            },
            {
              name: 'menu.sadad.bill_payments.menu',
              privilege: this.authenticationService.activateOption(
                'BillPaymentsMenu',
                ['BILLPAYMENTS_PRIVILEGE'],
                ['BillPayGroup', 'BillPayAdders'],
              ),
              submenu: [
                {
                  name: 'menu.sadad.bill_payments.bill_management',
                  privilege: this.authenticationService.activateOption(
                    'BillManagement',
                    ['BILLPAYMENTS_PRIVILEGE'],
                    ['BillPayGroup'],
                  ),
                  route: ['/payments/billPayments'],
                },
                {
                  name: 'menu.payments.oneTimePayment.single',
                  privilege: this.authenticationService.activateOption(
                      'OneTimePayment',
                      ['BILLPAYMENTS_PRIVILEGE'],
                      ['BillPayAdders'],
                  ),
                  route: ['/payments/oneTimePayment/single'],
                },
                {
                  name: 'menu.payments.oneTimePayment.multiple',
                  privilege: this.authenticationService.activateOption(
                      'OneTimePayment',
                      ['BILLPAYMENTS_PRIVILEGE'],
                      ['BillPayAdders'],
                  ),
                  route: ['/payments/oneTimePayment/bulk'],
                },
                {
                  name: 'menu.sadad.bill_payments.add_bill',
                  privilege: this.authenticationService.activateOption(
                      'BillAdd',
                      ['BILLPAYMENTS_PRIVILEGE'],
                      ['BillPayAdders'],
                  ),
                  route: ['/payments/billPayments/addBill'],
                },
                {
                  name: 'menu.sadad.bill_payments.feedback_files',
                  privilege: this.authenticationService.activateOption(
                    'BillFeedBackFiles',
                    ['BILLPAYMENTS_PRIVILEGE'],
                    ['BillPayGroup'],
                  ),
                  route: ['/payments/billPayments/feedbackfiles'],
                },
                {
                  name: 'menu.sadad.bill_payments.dashboard',
                  privilege: this.authenticationService.activateOption(
                    'BillDashboard',
                    ['BILLPAYMENTS_PRIVILEGE'],
                    ['BillPayGroup'],
                  ),
                  route: ['/payments/billPayments/statistics'],
                },
                {
                  name: 'menu.sadad.bill_payments.processed_Transactions',
                  privilege: this.authenticationService.activateOption(
                    'BillDashboard',
                    ['BILLPAYMENTS_PRIVILEGE'],
                    ['BillPayGroup'],
                  ),
                  route: ['/payments/billPayments/processedTransactions'],
                },
                {
                  name: 'menu.sadad.bill_payments.request_status',
                  privilege: this.authenticationService.activateOption(
                    'BillRequestStatus',
                    ['BILLPAYMENTS_PRIVILEGE'],
                    ['BillPayGroup'],
                  ),
                  route: ['/payments/billPayments/request'],
                },
              ],
            },
            {
              name: 'menu.sadad.esal.menu',
              privilege: this.authenticationService.activateOption(
                'EsalMenu',
                ['SADAD_INVOICE_HUB_PRIVILEGE'],
                ['SadadInvoiceHubGroup'],
              ),
              submenu: [
                {
                  name: 'menu.sadad.esal.pay_invoice',
                  privilege: this.authenticationService.activateOption(
                    'EsalPayInvoice',
                    ['SADAD_INVOICE_HUB_PRIVILEGE'],
                    ['SadadInvoiceHubGroup'],
                  ),
                  route: ['/invoiceHUB/single-payment'],
                },
                {
                  name: 'menu.sadad.esal.pay_multiple_invoice',
                  privilege: this.authenticationService.activateOption(
                    'EsalPayMultiple',
                    ['SADAD_INVOICE_HUB_PRIVILEGE'],
                    ['SadadInvoiceHubGroup'],
                  ),
                  route: ['/invoiceHUB/multi-payment'],
                },
                {
                  name: 'menu.sadad.esal.invoice_history',
                  privilege: this.authenticationService.activateOption(
                    'EsalInvoiceHistory',
                    ['SADAD_INVOICE_HUB_PRIVILEGE'],
                    ['SadadInvoiceHubGroup'],
                  ),
                  route: ['/invoiceHUB/invoice-history'],
                },
                {
                  name: 'menu.sadad.esal.dashboard',
                  privilege: this.authenticationService.activateOption(
                    'EsalDashboard',
                    ['SADAD_INVOICE_HUB_PRIVILEGE'],
                    ['SadadInvoiceHubGroup'],
                  ),
                  route: ['/invoiceHUB/monthlyStatistics'],
                },
                {
                  name: 'menu.sadad.esal.feedback_files',
                  privilege: this.authenticationService.activateOption(
                    'EsalFeedBackFiles',
                    ['SADAD_INVOICE_HUB_PRIVILEGE'],
                    ['SadadInvoiceHubGroup'],
                  ),
                  route: ['/invoiceHUB/feedback-files'],
                },
                {
                  name: 'menu.sadad.esal.processed_Transactions',
                  privilege: this.authenticationService.activateOption(
                    'EsalMenu',
                    ['SADAD_INVOICE_HUB_PRIVILEGE'],
                    ['SadadInvoiceHubGroup'],
                  ),
                  route: ['/invoiceHUB/processedTransactions'],
                },
                {
                  name: 'menu.sadad.esal.request_status',
                  privilege: this.authenticationService.activateOption(
                    'EsalRequestStatus',
                    ['SADAD_INVOICE_HUB_PRIVILEGE'],
                    ['SadadInvoiceHubGroup'],
                  ),
                  route: ['/invoiceHUB/request-status'],
                },
              ],
            },
            {
              name: 'menu.sadad.sadad_account.menu',
              privilege: this.authenticationService.activateOption(
                'SadadOLPMenu',
                [],
                ['SadadOLPGroup'],
              ),
              submenu: [
                {
                  name: 'menu.sadad.sadad_account.transactions',
                  privilege: this.authenticationService.activateOption(
                    'SadadTransactions',
                    [],
                    ['SadadOLPGroup'],
                  ),
                  route: ['/sadadOLP/olp-transactions'],
                },
                {
                  name: 'menu.sadad.sadad_account.refunds',
                  privilege: this.authenticationService.activateOption(
                    'SadadRefunds',
                    [],
                    ['SadadOLPGroup'],
                  ),
                  route: ['/sadadOLP/olp-refunds'],
                },
                {
                  name: 'menu.sadad.sadad_account.dispute',
                  privilege: this.authenticationService.activateOption(
                    'SadadDisputes',
                    [],
                    ['SadadOLPGroup'],
                  ),
                  route: ['/sadadOLP/olp-disputes'],
                },
                {
                  name: 'menu.sadad.sadad_account.notifications',
                  privilege: this.authenticationService.activateOption(
                    'SadadNotifications',
                    [],
                    ['SadadOLPGroup'],
                  ),
                  route: ['/sadadOLP/olp-notifications'],
                },
                {
                  name: 'menu.sadad.sadad_account.initiate_test_request',
                  privilege: this.authenticationService.activateOption(
                    'SadadTesting',
                    [],
                    ['SadadOLPGroup'],
                  ),
                  route: ['/sadadOLP/olp-initiate-testing'],
                },
                {
                  name: 'menu.sadad.sadad_account.view_request_status',
                  privilege: this.authenticationService.activateOption(
                    'SadadViewRequestStatus',
                    [],
                    ['SadadOLPGroup'],
                  ),
                  route: ['/sadadOLP/olp-listview-testing'],
                },
                {
                  name: 'menu.sadad.sadad_account.tools_and_documentation',
                  privilege: this.authenticationService.activateOption(
                    'SadadToolsDocumentation',
                    [],
                    ['SadadOLPGroup'],
                  ),
                  route: ['/sadadOLP/ManagementToolsDocumentation'],
                },
              ],
            },
          ],
        },
        {
          name: 'menu.payroll.menu',
          icon: 'icon -new-payroll',
          privilege: this.authenticationService.activateOption(
            'PayrollManagement',
            [
              'PAYROLL_PRIVILEGE',
              'WPSPAYROLL_PRIVILEGE',
              'WMSPAYROLL_PRIVILEGE',
              'PAYROLLCARDS_PRIVILEGE',
            ],
            [
              'PayrollGroup',
              'WPSPayrollGroup',
              'WMSPayrollGroup',
              'PayrollCardsGroup',
            ],
          ),
          submenu: [
            {
              name: 'menu.payroll.payroll_wps.menu',
              privilege: this.authenticationService.activateOption(
                'WPSPayrollMenu',
                ['WPSPAYROLL_PRIVILEGE'],
                ['WPSPayrollGroup'],
              ),
              submenu: [
                {
                  name: 'menu.payroll.payroll_wps.employees_management',
                  privilege: this.authenticationService.activateOption(
                    'WPSPayrollManageEmployees',
                    ['WPSPAYROLL_PRIVILEGE'],
                    ['WPSPayrollGroup'],
                  ),
                  route: ['/wpspayroll/wpspayroll-management/manage-employees'],
                },
                {
                  name: 'menu.payroll.payroll_wps.generate_payroll_file',
                  privilege: this.authenticationService.activateOption(
                    'WPSPayrollSalaryPayments',
                    ['WPSPAYROLL_PRIVILEGE'],
                    ['WPSPayrollGroup'],
                  ),
                  route: ['/wpspayroll/wpspayroll-management/salary-payments'],
                },
                {
                  name: 'menu.payroll.payroll_wps.upload_payroll_file',
                  privilege: this.authenticationService.activateOption(
                    'WPSPayrollUploadFile',
                    ['WPSPAYROLL_PRIVILEGE'],
                    ['WPSPayrollGroup'],
                  ),
                  route: [
                    '/wpspayroll/wpspayroll-management/salary-payment-upload-file',
                  ],
                },
                {
                  name: 'menu.payroll.payroll_wps.processed_files',
                  privilege: this.authenticationService.activateOption(
                    'WPSPayrollViewProcessedFiles',
                    ['WPSPAYROLL_PRIVILEGE'],
                    ['WPSPayrollGroup'],
                  ),
                  route: [
                    '/wpspayroll/wpspayroll-management/view-processed-files',
                  ],
                },
                {
                  name: 'menu.payroll.payroll_wps.mol_file_download',
                  privilege: this.authenticationService.activateOption(
                    'WPSPayrollDownloadMOLFile',
                    ['WPSPAYROLL_PRIVILEGE'],
                    ['WPSPayrollGroup'],
                  ),
                  route: ['/wpspayroll/wpspayroll-management/download-mol'],
                },
                {
                  name: 'menu.payroll.payroll_wps.dashboard',
                  privilege: this.authenticationService.activateOption(
                    'WPSPayrollDashboard',
                    ['WPSPAYROLL_PRIVILEGE'],
                    ['WPSPayrollGroup'],
                  ),
                  route: ['/wpspayroll/wpspayroll-management/dashboard'],
                },
                {
                  name: 'menu.payroll.payroll_wps.template_download',
                  privilege: this.authenticationService.activateOption(
                    'WPSPayrollDownloadTemplates',
                    ['WPSPAYROLL_PRIVILEGE'],
                    ['WPSPayrollGroup'],
                  ),
                  route: [
                    '/wpspayroll/wpspayroll-management/download-templates',
                  ],
                },
                {
                  name: 'menu.payroll.payroll_wps.request_status',
                  privilege: this.authenticationService.activateOption(
                    'WPSPayrollRequestStatus',
                    ['WPSPAYROLL_PRIVILEGE'],
                    ['WPSPayrollGroup'],
                  ),
                  route: ['/wpspayroll/wpspayroll-management/request-status'],
                },
              ],
            },
            {
              name: 'menu.payroll.payroll_cards.menu',
              privilege: this.authenticationService.activateOption(
                'PayrollCardsMenu',
                ['PAYROLLCARDS_PRIVILEGE'],
                ['PayrollCardsGroup'],
              ),
              submenu: [
                {
                  name: 'menu.payroll.payroll_cards.list_of_cards',
                  privilege: this.authenticationService.activateOption(
                    'PayrollCardsManage',
                    ['PAYROLLCARDS_PRIVILEGE'],
                    ['PayrollCardsGroup'],
                  ),
                  route: ['/payroll/payroll-cards/card-inquiries'],
                },
                {
                  name: 'menu.payroll.payroll_cards.payments',
                  privilege: this.authenticationService.activateOption(
                    'PayrollCardsPayments',
                    ['PAYROLLCARDS_PRIVILEGE'],
                    ['PayrollCardsGroup'],
                  ),
                  route: ['/payroll/payroll-cards/card-payments'],
                },
                {
                  name: 'menu.payroll.payroll_cards.operations',
                  privilege: this.authenticationService.activateOption(
                    'PayrollCardsOperations',
                    ['PAYROLLCARDS_PRIVILEGE'],
                    ['PayrollCardsGroup'],
                  ),
                  route: ['/payroll/payroll-cards/card-operations'],
                },
                {
                  name: 'menu.payroll.payroll_cards.request_cards',
                  privilege: this.authenticationService.activateOption(
                    'PayrollCardsRequestCards',
                    ['PAYROLLCARDS_PRIVILEGE'],
                    ['PayrollCardsGroup'],
                  ),
                  route: [
                    '/payroll/payroll-cards/card-inquiries/request-new-card-online',
                  ],
                },
                {
                  name: 'menu.payroll.payroll_cards.upload_file',
                  privilege: this.authenticationService.activateOption(
                    'PayrollCardsUpload',
                    ['PAYROLLCARDS_PRIVILEGE'],
                    ['PayrollCardsGroup'],
                  ),
                  route: ['/payroll/payroll-cards/upload-file'],
                },
                {
                  name: 'menu.payroll.payroll_cards.sent_files',
                  privilege: this.authenticationService.activateOption(
                    'PayrollCardsView',
                    ['PAYROLLCARDS_PRIVILEGE'],
                    ['PayrollCardsGroup'],
                  ),
                  route: ['/payroll/payroll-cards/view-sent-files'],
                },
                {
                  name: 'menu.payroll.payroll_cards.feedback_files',
                  privilege: this.authenticationService.activateOption(
                    'PayrollCardsFeedBackFiles',
                    ['PAYROLLCARDS_PRIVILEGE'],
                    ['PayrollCardsGroup'],
                  ),
                  route: ['/payroll/payroll-cards/feedback-files'],
                },
                {
                  name: 'menu.payroll.payroll_cards.reports',
                  privilege: this.authenticationService.activateOption(
                    'PayrollCardsCardListReports',
                    ['PAYROLLCARDS_PRIVILEGE'],
                    ['PayrollCardsGroup'],
                  ),
                  route: ['/payroll/payroll-cards/card-list-reports'],
                },
                {
                  name: 'menu.payroll.payroll_cards.template_download',
                  privilege: this.authenticationService.activateOption(
                    'PayrollCardsDownloadTemplates',
                    ['PAYROLLCARDS_PRIVILEGE'],
                    ['PayrollCardsGroup'],
                  ),
                  route: ['/payroll/payroll-cards/download-templates'],
                },
                {
                  name: 'menu.payroll.payroll_cards.request_status',
                  privilege: this.authenticationService.activateOption(
                    'PayrollCardsRequestStatus',
                    ['PAYROLLCARDS_PRIVILEGE'],
                    ['PayrollCardsGroup'],
                  ),
                  route: ['/payroll/payroll-cards/request-status'],
                },
              ],
            },
            {
              name: 'menu.payroll.payroll.menu',
              privilege: this.authenticationService.activateOption(
                'Payroll',
                ['PAYROLL_PRIVILEGE'],
                ['PayrollGroup'],
              ),
              route: ['/payroll'],
            },
            {
              name: 'menu.payroll.payroll.menu',
              privilege: this.authenticationService.activateOption(
                'PayrollMenu',
                ['PAYROLL_PRIVILEGE'],
                ['PayrollGroup'],
              ),
              submenu: [
                {
                  name: 'menu.payroll.payroll.employees_management',
                  privilege: this.authenticationService.activateOption(
                    'PayrollManageEmployees',
                    ['PAYROLL_PRIVILEGE'],
                    ['PayrollGroup'],
                  ),
                  route: ['/payroll/payroll-management/manage-employees'],
                },
                {
                  name: 'menu.payroll.payroll.generate_payroll_file',
                  privilege: this.authenticationService.activateOption(
                    'PayrollSalaryPayments',
                    ['PAYROLL_PRIVILEGE'],
                    ['PayrollGroup'],
                  ),
                  route: ['/payroll/payroll-management/salary-payments'],
                },
                {
                  name: 'menu.payroll.payroll.upload_payroll_file',
                  privilege: this.authenticationService.activateOption(
                    'PayrollUploadFile',
                    ['PAYROLL_PRIVILEGE'],
                    ['PayrollGroup'],
                  ),
                  route: [
                    '/payroll/payroll-management/salary-payment-upload-file',
                  ],
                },
                {
                  name: 'menu.payroll.payroll.processed_files',
                  privilege: this.authenticationService.activateOption(
                    'PayrollViewProcessedFiles',
                    ['PAYROLL_PRIVILEGE'],
                    ['PayrollGroup'],
                  ),
                  route: ['/payroll/payroll-management/view-processed-files'],
                },
                {
                  name: 'menu.payroll.payroll.dashboard',
                  privilege: this.authenticationService.activateOption(
                    'PayrollDashboard',
                    ['PAYROLL_PRIVILEGE'],
                    ['PayrollGroup'],
                  ),
                  route: ['/payroll/payroll-management/dashboard'],
                },
                {
                  name: 'menu.payroll.payroll.template_download',
                  privilege: this.authenticationService.activateOption(
                    'PayrollDownloadTemplates',
                    ['PAYROLL_PRIVILEGE'],
                    ['PayrollGroup'],
                  ),
                  route: ['/payroll/payroll-management/download-templates'],
                },
                {
                  name: 'menu.payroll.payroll.request_status',
                  privilege: this.authenticationService.activateOption(
                    'PayrollRequestStatus',
                    ['PAYROLL_PRIVILEGE'],
                    ['PayrollGroup'],
                  ),
                  route: ['/payroll/payroll-management/request-status'],
                },
              ],
            },
            {
              name: 'menu.payroll.payroll_wms.menu',
              privilege: this.authenticationService.activateOption(
                'WMSPayrollMenu',
                ['WMSPAYROLL_PRIVILEGE'],
                ['WMSPayrollGroup'],
              ),
              submenu: [
                {
                  name: 'menu.payroll.payroll_wms.upload_file',
                  privilege: this.authenticationService.activateOption(
                    'WMSPayrollSalaryPayments',
                    ['WMSPAYROLL_PRIVILEGE'],
                    ['WMSPayrollGroup'],
                  ),
                  route: [
                    '/wmspayroll/wmspayroll-management/salary-payment-upload-file',
                  ],
                },
                {
                  name: 'menu.payroll.payroll_wms.processed_files',
                  privilege: this.authenticationService.activateOption(
                    'WMSPayrollViewProcessedFiles',
                    ['WMSPAYROLL_PRIVILEGE'],
                    ['WMSPayrollGroup'],
                  ),
                  route: [
                    '/wmspayroll/wmspayroll-management/view-processed-files',
                  ],
                },
                {
                  name: 'menu.payroll.payroll_wms.dashboard',
                  privilege: this.authenticationService.activateOption(
                    'WMSPayrollDashboard',
                    ['WMSPAYROLL_PRIVILEGE'],
                    ['WMSPayrollGroup'],
                  ),
                  route: ['/wmspayroll/wmspayroll-management/dashboard'],
                },
                {
                  name: 'menu.payroll.payroll_wms.request_status',
                  privilege: this.authenticationService.activateOption(
                    'WMSPayrollRequestStatus',
                    ['WMSPAYROLL_PRIVILEGE'],
                    ['WMSPayrollGroup'],
                  ),
                  route: ['/wmspayroll/wmspayroll-management/request-status'],
                },
              ],
            },
          ],
        },
        {
          name: 'menu.point_of_sales.menu',
          icon: 'icon -collections-management',
          privilege: this.authenticationService.activateOption(
              'CollectionsManagement',
              [

              ],
              [
                'DirectDebitsGroup',
                'PosStatementGroup',
                'VirtualAccountsGroup',
                'LockboxGroupStatement',
                'LockboxTerminalList',
                'CustomizeReportGroup',
                'CompanyAdmins'
              ],
          ),
          submenu: [
            {
              name: 'posStatement.newRequest',
              privilege: this.authenticationService.activateOption(
                  'PosRequestMenu',
                  ['POS_MANAGEMENT_PRIVILEGE'],
                  ['posManagementGroup'],
              ),
              route: ['/posstatement/pos-request'],
            },
            {
              name: 'emcrey.merchant-portal',
              privilege: this.authenticationService.activateOption(
                  'MerchantPortal',
                  ['POS_MANAGEMENT_PRIVILEGE'],
                  [],
              ),
              route: ['/merchant-portal'],
            },
            {
              name: 'menu.collections_management.pos_ecommerce.menu',
              privilege: this.authenticationService.activateOption(
                  'PosStatementMenu',
                  [
                    'POSSTATEMENT_PRIVILEGE',
                    'CUSTOMIZE_REPORT_PRIVILEGE',
                  ],
                  [
                    'PosStatementGroup',
                    'CustomizeReportGroup',
                  ],
              ),
              submenu: [
                {
                  name: 'menu.collections_management.pos_ecommerce.list_of_terminals',
                  privilege: this.authenticationService.activateOption(
                      'PosStatementList',
                      ['POSSTATEMENT_PRIVILEGE'],
                      ['PosStatementGroup'],
                  ),
                  route: ['/posstatement/pos-terminal'],
                },
                {
                  name: 'menu.collections_management.pos_ecommerce.terminal_statement',
                  privilege: this.authenticationService.activateOption(
                      'PosStatementTerminalStatement',
                      ['POSSTATEMENT_PRIVILEGE'],
                      ['PosStatementGroup'],
                  ),
                  route: ['/accounts/posStatement'],
                },
                {
                  name: 'menu.collections_management.pos_ecommerce.customizeReport',
                  privilege: this.authenticationService.activateOption(
                      'PosStatementMenu',
                      ['CUSTOMIZE_REPORT_PRIVILEGE'],
                      ['CustomizeReportGroup'],
                  ),
                  route: ['/customizeReport'],
                },
              ],
            },
            {
              name: 'menu.collections_management.pos_mantenience.menu',
              privilege: this.authenticationService.activateOption(
                  'PosStatementMenu',
                  ['POS_MANAGEMENT_PRIVILEGE'],
                  ['posManagementGroup'],
              ),
              submenu: [
                // {
                //   name: 'posStatement.newRequest',
                //   privilege: this.authenticationService.activateOption(
                //     'PosRequestMenu',
                //     ['POS_MANAGEMENT_PRIVILEGE'],
                //     ['posManagementGroup'],
                //   ),
                //   route: ['/posstatement/pos-request'],
                // },
                {
                  name: 'menu.collections_management.pos_mantenience.pos-manage-request',
                  privilege: this.authenticationService.activateOption(
                      'PosStatementList',
                      ['POS_MANAGEMENT_PRIVILEGE'],
                      ['posManagementGroup'],
                  ),
                  route: ['/posstatement/pos-manage-request'],
                },
                {
                  name: 'menu.collections_management.pos_mantenience.pos-maintenance-request',
                  privilege: this.authenticationService.activateOption(
                      'PosStatementTerminalStatement',
                      ['POS_MANAGEMENT_PRIVILEGE'],
                      ['posManagementGroup'],
                  ),
                  route: ['/posstatement/pos-maintenance-request'],
                },
                {
                  name: 'menu.collections_management.pos_mantenience.claims',
                  privilege: this.authenticationService.activateOption(
                      'ClaimsMenu',
                      ['POS_MANAGEMENT_PRIVILEGE'],
                      ['posManagementGroup'],
                  ),
                  route: ['/posstatement/claims'],
                },
                {
                  name: 'menu.collections_management.pos_mantenience.request-status',
                  privilege: this.authenticationService.activateOption(
                      'PosStatementTerminalStatement',
                      ['POS_MANAGEMENT_PRIVILEGE'],
                      ['posManagementGroup'],
                  ),
                  route: ['/posstatement/request-status'],
                },
                {
                  name: 'menu.collections_management.pos_mantenience.crm-status',
                  privilege: this.authenticationService.activateOption(
                      'PosStatementTerminalStatement',
                      ['POS_MANAGEMENT_PRIVILEGE'],
                      ['posManagementGroup'],
                  ),
                  route: ['/posstatement/crm-status'],
                },
                {
                  name: 'menu.collections_management.pos_mantenience.dashboard',
                  privilege: this.authenticationService.activateOption(
                      'POSDashboard',
                      ['POS_MANAGEMENT_PRIVILEGE'],
                      ['posManagementGroup'],
                  ),
                  route: ['/posstatement/dashboard'],
                },
              ],
            }

          ]
        },
        {
          name: 'menu.collections_management.menu',
          icon: 'icon -collections-management',
          privilege: this.authenticationService.activateOption(
            'CollectionsManagement',
            [
              'DIRECTDEBITS_PRIVILEGE',
              'POSSTATEMENT_PRIVILEGE',
              'VIRTUAL_ACCOUNTS_PRIVILEGE',
              'LOCKBOX_PRIVILEGE',
              'POS_MANAGEMENT_PRIVILEGE',
              'CUSTOMIZE_REPORT_PRIVILEGE',
            ],
            [
              'DirectDebitsGroup',
              'PosStatementGroup',
              'VirtualAccountsGroup',
              'LockboxGroupStatement',
              'LockboxTerminalList',
              'CustomizeReportGroup',
            ],

          ),
          submenu: [
            {
              name: 'menu.collections_management.direct_debits.menu',
              privilege: this.authenticationService.activateOption(
                'DirectDebitMenu',
                ['DIRECTDEBITS_PRIVILEGE'],
                ['DirectDebitsGroup'],
              ),
              submenu: [
                {
                  name: 'menu.collections_management.direct_debits.payers_management',
                  privilege: this.authenticationService.activateOption(
                    'DirectDebitManagePayer',
                    ['DIRECTDEBITS_PRIVILEGE'],
                    ['DirectDebitsGroup'],
                  ),
                  route: ['/direct-debits/manage-payer'],
                },
                {
                  name: 'menu.collections_management.direct_debits.generate_claims',
                  privilege: this.authenticationService.activateOption(
                    'DirectDebitGenerateClaimFile',
                    ['DIRECTDEBITS_PRIVILEGE'],
                    ['DirectDebitsGroup'],
                  ),
                  route: ['/direct-debits/manage-direct-debits'],
                },
                {
                  name: 'menu.collections_management.direct_debits.upload_claim_file',
                  privilege: this.authenticationService.activateOption(
                    'DirectDebitUploadClaimFile',
                    ['DIRECTDEBITS_PRIVILEGE'],
                    ['DirectDebitsGroup'],
                  ),
                  route: ['/direct-debits/direct-debit-upload-file'],
                },
                {
                  name: 'menu.collections_management.direct_debits.processed_files',
                  privilege: this.authenticationService.activateOption(
                    'DirectDebitProcessFile',
                    ['DIRECTDEBITS_PRIVILEGE'],
                    ['DirectDebitsGroup'],
                  ),
                  route: ['/direct-debits/view-processed-files'],
                },
                {
                  name: 'menu.collections_management.direct_debits.dashboard',
                  privilege: this.authenticationService.activateOption(
                    'DirectDebitDashboard',
                    ['DIRECTDEBITS_PRIVILEGE'],
                    ['DirectDebitsGroup'],
                  ),
                  route: ['/direct-debits/dashboard'],
                },
                {
                  name: 'menu.collections_management.direct_debits.request_status',
                  privilege: this.authenticationService.activateOption(
                    'DirectDebitRequestStatus',
                    ['DIRECTDEBITS_PRIVILEGE'],
                    ['DirectDebitsGroup'],
                  ),
                  route: ['/direct-debits/request-status'],
                },
              ],
            },
            {
              name: 'menu.collections_management.virtual_account_management',
              icon: 'icon -va',
              privilege: this.authenticationService.activateOption(
                'VirtualAccountsMenu',
                ['VIRTUAL_ACCOUNTS_PRIVILEGE'],
                ['VirtualAccountsGroup'],
              ),
              route: ['/virtual-account'],
            },
            {
              name: 'menu.collections_management.cash_deposit_machine.menu',
              icon: 'icon -payments',
              privilege: this.authenticationService.activateOption(
                'LockBoxMenu',
                ['LOCKBOX_PRIVILEGE'],
                ['LockboxGroupAdmin'],
              ),
              submenu: [
                {
                  name: 'menu.collections_management.cash_deposit_machine.cdm_accounts',
                  privilege: this.authenticationService.activateOption(
                    'LockBoxCDMAccounts',
                    ['LOCKBOX_PRIVILEGE'],
                    ['LockboxGroupAdmin'],
                  ),
                  route: ['/lockbox/cdm-accounts'],
                },
                {
                  name: 'menu.collections_management.cash_deposit_machine.cdm_users',
                  privilege: this.authenticationService.activateOption(
                    'LockBoxUsers',
                    ['LOCKBOX_PRIVILEGE'],
                    ['LockboxGroupAdmin'],
                  ),
                  route: ['/lockbox/cdm-users'],
                },
                {
                  name: 'menu.collections_management.cash_deposit_machine.statement',
                  privilege:
                    this.authenticationService.activateOption(
                      'LockBoxStatement',
                      ['LOCKBOX_PRIVILEGE'],
                      ['LockboxGroupStatement'],
                    ) &&
                    this.authenticationService.activateOption(
                      'LockBoxStatement',
                      ['LOCKBOX_PRIVILEGE'],
                      ['LockboxTerminalList'],
                    ),
                  route: ['/lockbox/cdm-statements'],
                },
                {
                  name: 'menu.collections_management.cash_deposit_machine.list_of_terminals',
                  privilege: this.authenticationService.activateOption(
                    'LockBoxTerminals',
                    ['LOCKBOX_PRIVILEGE'],
                    ['LockboxGroupAdmin'],
                  ),
                  route: ['/lockbox/cdm-terminals'],
                },
              ],
            },
          ],
        },
        {
          name: 'menu.cheques.menu',
          icon: 'icon -cheque-management',
          privilege: this.authenticationService.activateOption(
            'ChequeManagement',
            [],
            [
              'RequestCheckBookGroup',
              'StopCheckBookGroup',
              'PositivePayCheckGroup',
            ],
          ),
          submenu: [
            {
              name: 'menu.cheques.cheques.menu',
              privilege: this.authenticationService.activateOption(
                'ChequeMenu',
                [],
                ['RequestCheckBookGroup', 'StopCheckBookGroup'],
              ),
              submenu: [
                {
                  name: 'menu.cheques.cheques.cheque_inquiry',
                  privilege: this.authenticationService.activateOption(
                    'ChequeInquiry',
                    [],
                    ['RequestCheckBookGroup'],
                  ),
                  route: ['/accounts/chequebook/view-request'],
                },
                {
                  name: 'menu.cheques.cheques.stop_cheque',
                  privilege: this.authenticationService.activateOption(
                    'ChequeStop',
                    [],
                    ['StopCheckBookGroup'],
                  ),
                  route: ['/accounts/chequebook/stop-chequebook'],
                },
              ],
            },
            {
              name: 'menu.cheques.chequebooks.menu',
              privilege: this.authenticationService.activateOption(
                'ChequebookMenu',
                [],
                ['RequestCheckBookGroup'],
              ),
              submenu: [
                {
                  name: 'menu.cheques.chequebooks.request_chequebooks',
                  privilege: this.authenticationService.activateOption(
                    'ChequeBookRequest',
                    [],
                    ['RequestCheckBookGroup'],
                  ),
                  route: ['/accounts/chequeBookStep1'],
                },
                {
                  name: 'menu.cheques.chequebooks.request_status',
                  privilege: this.authenticationService.activateOption(
                    'ChequeBookRequestStatus',
                    [],
                    ['RequestCheckBookGroup'],
                  ),
                  route: ['/accounts/chequebook/request-status'],
                },
              ],
            },
            {
              name: 'menu.cheques.positive_pay.menu',
              privilege: this.authenticationService.activateOption(
                'ChequePositivePayMenu',
                ['POSITIVEPAYCHECK_PRIVILEGE'],
                ['PositivePayCheckGroup'],
              ),
              submenu: [
                {
                  name: 'menu.cheques.positive_pay.cheque_inquiry',
                  privilege: this.authenticationService.activateOption(
                    'PositivePayInquiry',
                    ['POSITIVEPAYCHECK_PRIVILEGE'],
                    ['PositivePayCheckGroup'],
                  ),
                  route: [
                    '/accounts/chequebook/positive-payment/search-cheque-number',
                  ],
                },
                {
                  name: 'menu.cheques.positive_pay.add_cheque',
                  privilege: this.authenticationService.activateOption(
                    'PositivePayAdd',
                    ['POSITIVEPAYCHECK_PRIVILEGE'],
                    ['PositivePayCheckGroup'],
                  ),
                  route: [
                    '/accounts/chequebook/positive-payment/add-positive-payment',
                  ],
                },
                {
                  name: 'menu.cheques.positive_pay.processed_operations',
                  privilege: this.authenticationService.activateOption(
                    'PositivePayPorcessed',
                    ['POSITIVEPAYCHECK_PRIVILEGE'],
                    ['PositivePayCheckGroup'],
                  ),
                  route: [
                    '/accounts/chequebook/positive-payment/historical-data',
                  ],
                },
                {
                  name: 'menu.cheques.positive_pay.request_status',
                  privilege: this.authenticationService.activateOption(
                    'PositivePayRequestStatus',
                    ['POSITIVEPAYCHECK_PRIVILEGE'],
                    ['PositivePayCheckGroup'],
                  ),
                  route: [
                    '/accounts/chequebook/positive-payment/request-status',
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'menu.cashManagement.menu',
          icon: 'icon -cash-management-icon',
          privilege: this.authenticationService.activateOption(
              'CashManagementProducts',
              [],
              [],
          ),
          route: ['/cash-management-products-in']
        },
        {
          name: 'financeProduct.menu',
          icon: 'icon -finance-icon',
          privilege: this.authenticationService.activateOption(
            'FinanceProduct',
            [],
            ['CompanyAdmins'],
          ),
          submenu: [
            {
              name: 'financeProduct.newRequest.newRequest',
              privilege: this.authenticationService.userHasAnyGroup([
                'CompanyAdmins',
              ]),
              route: ['/financeProduct/newRequest'],
            },
            {
              name: 'financeProduct.currentFinance',
              privilege: this.authenticationService.userHasAnyGroup([
                'CompanyAdmins',
              ]),
              route: ['/financeProduct/details'],
            },
          ],
        },
        {
          name: 'menu.app_and_agreement.menu',
          icon: 'icon -cheque',
          privilege: this.authenticationService.activateOption(
            'EtradeMenu',
            [],
            [],
          ),
          submenu: [
            {
              name: 'menu.app_and_agreement.lg-application',
              privilege: this.authenticationService.activateOption(
                'LGTemplate',
                [],
                [],
              ),
              route: ['/app_and_agreement/lg-application'],
            },
            {
              name: 'menu.app_and_agreement.payroll-agreement',
              privilege: this.authenticationService.activateOption(
                'LGTemplate',
                [],
                [],
              ),
              route: ['/app_and_agreement/payroll-agreement'],
            },
            {
              name: 'app_and_agreement.cash24',
              privilege: true,
              route: ['/app_and_agreement/app-agreement/cash24'],
            },
            {
              name: 'app_and_agreement.ecommerce-agreement',
              privilege: true,
              route: ['/app_and_agreement/app-agreement/ecommerce'],
            },
          ],
        },
        {
          name: 'menu.etrade.menu',
          icon: 'icon -note-add',
          privilege: this.authenticationService.activateOption(
            'EtradeMenu',
            ['ETRADE_PRIVILEGE'],
            ['eTradeGroup'],
          ),
          // active: true,
          route: ['/etrade'],
        },
      ],
      down: [
        {
          name: 'menu.company_admin.menu',
          icon: 'icon -company-admin',
          privilege: this.authenticationService.activateOption(
            'AdminManagement',
            [],
            ['CompanyAdmins'],
          ),

          submenu: [
            {
              name: 'menu.company_admin.updateCR',
              hint: 'menu.new', //TODO this should get from API based on campaign service
              privilege: this.authenticationService.activateOption(
                'UpdateCR',
                [],
                ['CompanyAdmins'],
              ),
              route: ['/companyadmin/updatecr'],
            },
            {
              name: 'represented.representatives',
              hint: 'menu.new',
              privilege: this.authenticationService.activateOption(
                'RepresentativesManagement',
                [],
                ['CompanyAdmins'],
              ),
              route: ['/companyadmin/represented'],
            },
            {
              name: 'menu.company_admin.workflow.menu',
              privilege: this.authenticationService.activateOption(
                'WorkflowMenu',
                [],
                ['CompanyAdmins'],
              ),
              submenu: [
                {
                  name: 'menu.company_admin.workflow.account_rules',
                  privilege: this.authenticationService.activateOption(
                    'WorkflowAccountsRules',
                    [],
                    ['CompanyAdmins'],
                  ),
                  route: ['/companyadmin/workflow/accountRulesSearch'],
                },
                {
                  name: 'workflow.nonaccount',
                  privilege: this.authenticationService.activateOption(
                    'WorkflowNonFinancial',
                    [],
                    ['CompanyAdmins'],
                  ),
                  route: ['/companyadmin/workflow/nonAccountRules'],
                },
                {
                  name: 'workflow.eTrade',
                  privilege: this.authenticationService.activateOption(
                    'WorkflowAccountsRules',
                    [],
                    ['CompanyAdmins'],
                  ),
                  route: ['/companyadmin/workflow/eTrade'],
                },
                {
                  name: 'workflow.requestStatus.requestStatus',
                  privilege: (this.authenticationService.activateOption(
                    'WorkflowAccountsRules',
                    [],
                    ['CompanyAdmins'],
                  ) && this.isDualCompany()),
                  route: ['/companyadmin/workflow/requestStatus']
                },
              ],
            },
            {
              name: 'menu.company_admin.users_management.menu',
              privilege: this.authenticationService.activateOption(
                'UsersMenu',
                [],
                ['CompanyAdmins'],
              ),
              submenu: [
                {
                  name: 'menu.company_admin.users_management.list_of_users',
                  privilege: this.authenticationService.activateOption(
                    'UsersList',
                    [],
                    ['CompanyAdmins'],
                  ),
                  route: ['/companyadmin/manage/user'],
                },
                {
                  name: 'menu.company_admin.users_management.add_user',
                  privilege: this.authenticationService.activateOption(
                    'UsersAdd',
                    [],
                    ['CompanyAdmins'],
                  ),
                  route: ['/companyadmin/user/add'],
                },
                {
                  name: 'companyAdmin.user.requestStatus',
                  privilege: (this.authenticationService.activateOption(
                    'UsersList',
                    [],
                    ['CompanyAdmins'],
                  ) && this.isDualCompany()),
                  route: ['/companyadmin/user/requeststatus'],
                },
              ],
            },
            {
              name: 'menu.company_admin.alias-management.menu',
              hint: 'menu.new',
              privilege: this.authenticationService.activateOption(
                'AdminManagement',
                [],
                ['CompanyAdmins'],
              ),
              route: ['/companyadmin/alias-management'],
            },
            {
              name: 'menu.company_admin.manage.menu',
              privilege: this.authenticationService.activateOption(
                'ManageMenu',
                [],
                ['CompanyAdmins'],
              ),
              submenu: [
                {
                  name: 'menu.company_admin.manage.aramco_service',
                  privilege: this.authenticationService.activateOption(
                    'AramcoAdminService',
                    ['ARAMCOPAYMENTS_PRIVILEGE'],
                    ['CompanyAdmins'],
                  ),
                  route: ['/companyadmin/aramco/beneficiaryList'],
                },
                //ISSUE ARBCORP4-2536
                // {
                //   name: 'menu.company_admin.manage.pos_registration',
                //   privilege: this.authenticationService.activateOption(
                //     'POSManagement',
                //     ['POS_MANAGEMENT_PRIVILEGE'],
                //     ['CompanyAdmins'],
                //   ),
                //   route: ['/companyadmin/workflow/pos'],
                // },
                {
                  name: 'menu.company_admin.manage.pos_account',
                  privilege: this.authenticationService.activateOption(
                    'POSAccount',
                    ['POSSTATEMENT_PRIVILEGE'],
                    ['CompanyAdmins'],
                  ),
                  route: ['/companyadmin/account'],
                },
                {
                  name: 'menu.company_admin.manage.account_nickname',
                  privilege: this.authenticationService.activateOption(
                    'AccountsNickName',
                    [],
                    ['CompanyAdmins', 'AccountNicknameGroup'],
                  ),
                  route: ['/accounts/preferences'],
                },
                {
                  name: 'companyAdmin.beneficiaryOriginator.title',
                  privilege: this.authenticationService.activateOption(
                    'GovernmentRevenueAdmin',
                    ['GOVERNMENTREVENUE_PRIVILEGE'],
                    ['CompanyAdmins'],
                  ),
                  route: ['/companyadmin/accounts/beneficiary-originators'],
                },
                {
                  name: 'menu.company_admin.manage.liquid_management',
                  privilege: this.authenticationService.activateOption(
                    'LiquidityManagementAdmin',
                    ['CASH_MANAGEMENT_PRIVILEGE'],
                    ['CompanyAdmins'],
                  ),
                  route: ['/companyadmin/liquidityManagement'],
                },
                {
                  name: 'menu.company_admin.manage.token_management',
                  privilege: this.authenticationService.activateOption(
                    'TokensManagementAdmin',
                    [],
                    ['CompanyAdmins'],
                  ),
                  route: ['/companyadmin/token/managment'],
                },
                // TODO : where put these items
                {
                  name: 'sadadOLP.caEnrollment.menu',
                  privilege: this.authenticationService.activateOption(
                    'SadadOLPAdmin',
                    [],
                    ['SadadOLPAdminGroup'],
                  ),
                  route: ['/sadadOLP/ca-enrollment'],
                },
                {
                  name: 'companyAdmin.positivePayChequeAccounts.positivePayChequeAccounts',
                  privilege: this.authenticationService.activateOption(
                    'PositivePayChequeAccounts',
                    ['POSITIVEPAYCHECK_PRIVILEGE'],
                    ['PositivePayCheckGroupAdmin'],
                  ),
                  route: ['/companyadmin/PositivePayChequeAccounts'],
                },
              ],
            },
            {
              name: 'menu.company_admin.alert_management.menu',
              privilege: this.authenticationService.activateOption(
                'AlertsAdminMenu',
                ['ALERTS_PRIVILEGE'],
                ['CompanyAdmins'],
              ),
              submenu: [
                {
                  name: 'menu.company_admin.alert_management.registration',
                  privilege: this.authenticationService.activateOption(
                    'AlertsAdminSMSRegistration',
                    ['ALERTS_PRIVILEGE'],
                    ['CompanyAdmins'],
                  ),
                  route: ['/companyadmin/alerts/registration'],
                },
                {
                  name: 'menu.company_admin.alert_management.renewal',
                  privilege: this.authenticationService.activateOption(
                    'AlertsAdminSMSRenewal',
                    ['ALERTS_PRIVILEGE'],
                    ['CompanyAdmins'],
                  ),
                  route: ['/companyadmin/alerts/renewal'],
                },
                {
                  name: 'menu.company_admin.alert_management.report',
                  privilege: this.authenticationService.activateOption(
                    'AlertsAdminSMSReport',
                    ['ALERTS_PRIVILEGE'],
                    ['CompanyAdmins'],
                  ),
                  route: ['/companyadmin/alerts/report'],
                },
                {
                  name: 'menu.company_admin.alert_management.deactivate',
                  privilege: this.authenticationService.activateOption(
                    'AlertsAdminSMSDeactivate',
                    ['ALERTS_PRIVILEGE'],
                    ['CompanyAdmins'],
                  ),
                  route: ['/companyadmin/alerts/desactivate'],
                },
              ],
            },
            {
              name: 'menu.company_admin.fees_information.menu',
              icon: 'icon -payments',
              privilege: this.authenticationService.activateOption(
                'FeesAdminMenu',
                [],
                ['CompanyAdmins'],
              ),
              submenu: [
                {
                  name: 'menu.company_admin.fees_information.general_fees',
                  privilege: this.authenticationService.activateOption(
                    'GeneralFees',
                    [],
                    ['CompanyAdmins'],
                  ),
                  route: ['/fees/general-fees'],
                },
                {
                  name: 'menu.company_admin.fees_information.payroll_fees',
                  privilege: this.authenticationService.activateOption(
                    'PayrollFees',
                    ['PAYROLL_PRIVILEGE'],
                    ['CompanyAdmins'],
                  ),
                  route: ['/fees/payroll-fees'],
                },
                {
                  name: 'menu.company_admin.fees_information.payroll_card_fees',
                  privilege: this.authenticationService.activateOption(
                    'PayrollCardsFees',
                    ['PAYROLLCARDS_PRIVILEGE'],
                    ['CompanyAdmins'],
                  ),
                  route: ['/fees/card-fees'],
                },
                {
                  name: 'menu.company_admin.fees_information.bulk_payments_fees',
                  privilege: this.authenticationService.activateOption(
                    'GeneralFees',
                    ['BULKPAYMENTS_PRIVILEGE'],
                    ['CompanyAdmins'],
                  ),
                  route: ['/fees/bulk-payments-fees'],
                },
              ],
            },
            {
              name: 'menu.company_admin.cash_deposit_machine.menu',
              privilege: this.authenticationService.activateOption(
                'LockBoxAdminMenu',
                ['LOCKBOX_PRIVILEGE'],
                ['CompanyAdmins'],
              ),
              submenu: [
                {
                  name: 'menu.collections_management.cash_deposit_machine.cdm_accounts',
                  privilege: this.authenticationService.activateOption(
                    'LockBoxCDMAccounts',
                    ['LOCKBOX_PRIVILEGE'],
                    ['LockboxGroupAdmin'],
                  ),
                  route: ['/lockbox/cdm-accounts'],
                },
                {
                  name: 'menu.collections_management.cash_deposit_machine.cdm_users',
                  privilege: this.authenticationService.activateOption(
                    'LockBoxUsers',
                    ['LOCKBOX_PRIVILEGE'],
                    ['LockboxGroupAdmin'],
                  ),
                  route: ['/lockbox/cdm-users'],
                },
                {
                  name: 'menu.collections_management.cash_deposit_machine.terminals',
                  privilege: this.authenticationService.activateOption(
                    'LockBoxTerminals',
                    ['LOCKBOX_PRIVILEGE'],
                    ['LockboxGroupAdmin'],
                  ),
                  route: ['/lockbox/ca-cdm-terminals'],
                },
                {
                  name: 'menu.collections_management.cash_deposit_machine.reports',
                  privilege: this.authenticationService.activateOption(
                    'LockBoxReports',
                    ['LOCKBOX_PRIVILEGE'],
                    ['LockboxGroupAdmin'],
                  ),
                  route: ['/lockbox/cdm-reports'],
                },
              ],
            },
            {
              name: 'menu.company_admin.activity_logs.menu',
              privilege: this.authenticationService.activateOption(
                'ActivityLogsAdmin',
                [],
                ['CompanyAdmins'],
              ),
              route: ['/myprofile/activityLogs'],
            },
            {
              name: 'menu.company_admin.custom_properties.menu',
              privilege: this.authenticationService.activateOption(
                'CustomProperties',
                [],
                ['CompanyAdmins'],
              ),
              route: ['/companyadmin/custom-properties'],
            },
          ],
        },
        {
          name: 'public.newProduct',
          privilege: this.authenticationService.activateOption(
            'NewProductSelfOnboarding',
            [],
            ['CompanyAdmins'],
          ),
          icon: 'icon -check',
          submenu: [
            {
              name: 'newProduct.wps',
              privilege: this.authenticationService.activateOption(
                'WpsPayrollSelfOnboarding',
                [],
                ['CompanyAdmins'],
              ),
              route: ['/newProduct/wps/new'],
            },
            {
              name: 'newProduct.requests',
              privilege: this.authenticationService.activateOption(
                'WpsRequestStatus',
                [],
                ['CompanyAdmins'],
              ),
              route: ['/newProduct/wps/requestStatus'],
            },
          ],
        },
        {
          name: 'public.help',
          privilege: true,
          icon: 'icon -basics-info',
          submenu: [
            {
              name: 'dashboard.faqs',
              privilege: true,
              extLink: [this.config.getDocumentUrl() + '/AlRajhi_Business_FAQ_V2.4_' + this.translate.currentLang + '.pdf'],
            },
            {
              name: 'dashboard.tooltip',
              privilege: true,
              route: ['/help/tooltip'],
            },
          ],
        },
      ],
    }
    return data
  }
}
