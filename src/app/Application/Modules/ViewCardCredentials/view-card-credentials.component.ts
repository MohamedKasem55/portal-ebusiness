import { CryptoService } from 'app/core/crypto/crypto.service';
import { Component, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ViewCardCredentialsService } from '../Common/Services/viewCardCredentials/view-card-credentials.service';
import { CredentialsObject, ViewCardCredentialsData } from './view-card-credentials.models';
import * as CryptoJS from 'crypto-js';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'arb-view-card-credentials',
  templateUrl: './view-card-credentials.component.html',
  styleUrls: ['./view-card-credentials.component.scss']
})
export class ViewCardCredentialsComponent implements OnInit, OnDestroy {
  @ViewChild('timeExpiredPopUp', { static: true }) timeExpiredPopUp: ModalDirective
  @Input() countDown: boolean = false;
  public params: ViewCardCredentialsData = new ViewCardCredentialsData();
  public indexSelected: number = 1;
  public madaCard: string = '';
  public businessCard: string = '';
  public prepaidCard: string = '';
  public credentialsData: CredentialsObject = new CredentialsObject();
  public cvvIsVisible: boolean = false;
  public sourcePage: string[];
  public messageExpired: string = '';
  public imageType: string = ''
  public publicKey:string;
  public timerInterval: any;
  public display: any;
  private datePipe;

  public routes: any[];
  constructor(public router: Router, private route: ActivatedRoute, public cryptoService: CryptoService, public viewCardCredentialService: ViewCardCredentialsService, public translate: TranslateService,) {
    this.datePipe = new DatePipe('en-US')
  }

  ngOnInit(): void {
    this.getCountdown(2);

    if(!this.params){
      this.router.navigate([''])
    }else{
      this.params = this.viewCardCredentialService.getViewCardCredentialsData();
    }
    this.buildSourceData(this.params);
    this.getTypeOfCard()
  }

  buildSourceData(params: any) {
    if (params) {
      this.messageExpired = params['messageExpired'];
      this.sourcePage = params['sourcePage'];
      this.routes = params['routes'] ? JSON.parse(params['routes']) : [];
      this.publicKey= params['privateString']
      this.credentialsData.accountNumber = params['accountNumber'];
      this.credentialsData.cardHolderName = params['cardHolderName'];
      this.credentialsData.cvv = this.cryptoService.decryptRSA(params['cvv']);
      this.credentialsData.expiryDate = params['expiryDate'];
      this.imageType = params['imageType'];
    }
  }

  changeCvvIsVisible() {
    this.cvvIsVisible = !this.cvvIsVisible
  }
  copyToClipboard(dataToCopy: string) {
    let textCopy: any = ''
    if (dataToCopy === 'cardHolderName') {
      textCopy = this.credentialsData.cardHolderName;
    } else {
      textCopy = this.credentialsData.accountNumber;
    }
    const el = document.createElement('textarea');
    el.value = textCopy;
    el.setAttribute('readonly', '');
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
  goBack() {
    clearInterval(this.timerInterval);
    this.sourcePage ? this.router.navigate(this.sourcePage) : this.router.navigate(['/']);
  }
  getTypeOfCard() {
    this.madaCard = ViewCardCredentialsService.MadaCards;
    this.businessCard = ViewCardCredentialsService.BusinessCards;
    this.prepaidCard = ViewCardCredentialsService.PrepaidCards;
  }
  getCountdown(minute: number) {
    this.countDown = true;
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;

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
        this.cvvIsVisible = false;
        this.timeExpiredPopUp.show();
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }

}