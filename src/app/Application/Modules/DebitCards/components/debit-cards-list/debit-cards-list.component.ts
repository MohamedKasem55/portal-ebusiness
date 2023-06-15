import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AbstractDatatableMobileComponent } from '../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { StaticService } from '../../../Common/Services/static.service'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { DebitCardListService } from './debit-card-list.service'
import { ViewCardCredentialsService } from 'app/Application/Modules/Common/Services/viewCardCredentials/view-card-credentials.service'
import { CredentialsObject, ViewCardCredentialsData } from 'app/Application/Modules/ViewCardCredentials/view-card-credentials.models'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { Exception } from 'app/Application/Model/exception'


@Component({
  selector: 'app-debit-cards-list',
  templateUrl: './debit-cards-list.component.html',
  styleUrls: ['./debit-cards-list.component.scss'],
})
export class DebitCardsListComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy {
  @ViewChild('displayCardCredential', { static: true }) displayCardCredential: ModalDirective
  @ViewChild('pin1', { read: ElementRef }) pin1: ElementRef
  @ViewChild('pin2', { read: ElementRef }) pin2: ElementRef
  @ViewChild('pin3', { read: ElementRef }) pin3: ElementRef
  @ViewChild('pin4', { read: ElementRef }) pin4: ElementRef
  public form: any
  public viewCredentialGroupIsActive: boolean = false
  public isSole: boolean = false;
  public confirmResponse: any = {}
  public timerInterval: any;
  public display: any;
  public params: ViewCardCredentialsData = new ViewCardCredentialsData();
  public countDown: boolean = false;
  public requestValidate: RequestValidate = new RequestValidate();
  public madaCardDetails: any;
  carouselMaxColumns: number
  carouselMaxRows: number
  carouselFirstColumn: number
  carouselCurrentColumn: number
  carouselColumnWidth: any
  carouselItems: any[]
  carouselDisplayingCard: any
  noCardsExists = undefined

  constructor(
    public fb: FormBuilder,
    public service: DebitCardListService,
    public viewCardCredentialsService: ViewCardCredentialsService,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, authenticationService, router)
    this.order = 'cardNumber'
    this.orderType = 'desc'
    this.searchForm = this.fb.group({})
    this.form = fb.group({
      newPin: fb.group({
        newPin1: ['', Validators.required],
        newPin2: ['', Validators.required],
        newPin3: ['', Validators.required],
        newPin4: ['', Validators.required],
      }),
    })
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
    super.ngOnDestroy()
  }

  ngOnInit(): void {
    this.carouselInit()
    this.search()
    super.ngOnInit()
    this.isSolePropietorCompany()
    this.viewCredentialGroupIsActive = this.getViewCredentialGroup()
  }

  carouselInit() {
    this.carouselMaxColumns = 1
    this.carouselMaxRows = 1
    this.carouselFirstColumn = 0
    this.carouselCurrentColumn = this.carouselFirstColumn
    this.carouselColumnWidth = Math.floor(100 / this.carouselMaxColumns) + '%'
    this.carouselItems = []
  }

  carouselUpdate() {
    const total = this.elementsPage.page.totalElements
    let pos = 0
    while (pos < total) {
      this.carouselItems.push(this.elementsPage.data[pos])
      pos++
    }
    this.carouselDisplayingCard = this.carouselItems[this.carouselCurrentColumn]
    if (this.carouselDisplayingCard) {
      this.noCardsExists = false
    } else {
      this.noCardsExists = true
    }
  }

  previous() {
    this.carouselCurrentColumn--
    if (this.carouselCurrentColumn < 0) {
      this.carouselCurrentColumn = this.elementsPage.page.totalElements - 1
    }
    this.carouselDisplayingCard = this.carouselItems[this.carouselCurrentColumn]
  }

  next() {
    this.carouselCurrentColumn++
    if (this.carouselCurrentColumn >= this.elementsPage.page.totalElements) {
      this.carouselCurrentColumn = 0
    }
    this.carouselDisplayingCard = this.carouselItems[this.carouselCurrentColumn]
  }

  getId(row): any { }

  getList(searchElement, order, orderType, offset, pageSize) {
    this.subscriptions.push(
      this.service
        .getResults(searchElement, order, orderType, offset, pageSize)
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.elementsPage = result
            this.madaCardDetails = result
            this.carouselUpdate()
          }
        }),
    )
  }
  goToDisplayCardCredentials() {
    this.viewCardCredentialsService.setViewCardCredentialsData(this.params);
    this.router.navigate(['/debit-cards/viewCardCredentials']);
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
    if(this.carouselDisplayingCard){
      this.subscriptions.push(
        this.viewCardCredentialsService.sendMessage().subscribe((result) => {
          if (result.errorCode != '0' ||result.hasOwnProperty('error') ||
            result.error instanceof Exception) {
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
        console.log("finished");
        this.displayCardCredential.hide();
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }
  resendOTP() {
    this.countDown = false;
    clearInterval(this.timerInterval);
    this.getCountdown(1);
  }

  validateOTP(form: FormGroup) {
    const code = form['newPin'] ? form['newPin']['newPin1'] + form['newPin']['newPin2'] + form['newPin']['newPin3'] + form['newPin']['newPin4'] : 0;
    this.requestValidate.otp = code;
    this.closePopUp()
    this.subscriptions.push(
      this.viewCardCredentialsService
        .validateOTP(this.requestValidate, this.carouselDisplayingCard).subscribe(
          (result) => {
            if (result.errorCode !== '0' ||result.hasOwnProperty('error') ||
            result.error instanceof Exception) {
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
      ['menu.account_management.mada_business_cards.menu'],
      ['menu.account_management.mada_business_cards.list_of_cards']]
    const routesString = JSON.stringify(routes)
    const params: ViewCardCredentialsData = {
      accountNumber: credentialsObject.accountNumber,
      cvv: credentialsObject.cvv,
      expiryDate: credentialsObject.expiryDate,
      cardHolderName: credentialsObject.cardHolderName,
      messageExpired: 'Mada Business Cards.',
      sourcePage: ['/debit-cards/list'],
      imageType: ViewCardCredentialsService.MadaCards,
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
      'DebitCardsList',
      [],
      [
        'MADAQueryCardCredentials',
      ],
    )
    return groupIsActive;
  }
}
