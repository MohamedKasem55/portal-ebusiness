import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
} from '@angular/core'
import { Subscription } from 'rxjs'
import { CommercialCardsService } from '../commercial-cards.service'
import {
  BusinessCardsListItems,
  BusinessDetailAndList,
} from '../commercial-cards-models'

@Component({
  selector: 'app-reset-card-pin-step1',
  templateUrl: './resetPIN-step1.component.html',
  styleUrls: ['./resetPIN.component.scss'],
})
export class ResetPINStep1Component implements OnInit, OnDestroy {
  @Input() form: any
  @Output() onInit = new EventEmitter<Component>()

  @ViewChild('pin1', { read: ElementRef }) set pin1(content: ElementRef) {
    if (content) {
      content.nativeElement.focus()
    }
  }
  @ViewChild('pin2', { read: ElementRef }) pin2: ElementRef
  @ViewChild('pin3', { read: ElementRef }) pin3: ElementRef
  @ViewChild('pin4', { read: ElementRef }) pin4: ElementRef
  @ViewChild('pin5', { read: ElementRef }) pin5: ElementRef
  @ViewChild('pin6', { read: ElementRef }) pin6: ElementRef
  @ViewChild('pin7', { read: ElementRef }) pin7: ElementRef
  @ViewChild('pin8', { read: ElementRef }) pin8: ElementRef

  public accountNumber: string
  mensajeError: any = {}
  businessCardItem: BusinessCardsListItems
  public businessCardObject: BusinessDetailAndList
  constructor(public commercialCardsService: CommercialCardsService) {}

  ngOnInit() {
    this.onInit.emit(this as Component)
    this.businessCardObject =
      this.commercialCardsService.getBusinessCardsDetailsAndList()
    this.businessCardItem = this.businessCardObject.list
  }

  validatePin() {
    let pinNumber = ''
    let repeatPinNumber = ''
    let PinEqualRepeat = true
    if (
      this.form['controls'].repeatNewPin['controls']['repeatNewPin1'].value &&
      this.form['controls'].repeatNewPin['controls']['repeatNewPin2'].value &&
      this.form['controls'].repeatNewPin['controls']['repeatNewPin3'].value &&
      this.form['controls'].repeatNewPin['controls']['repeatNewPin4'].value &&
      this.form['controls'].newPin['controls']['newPin1'].value &&
      this.form['controls'].newPin['controls']['newPin2'].value &&
      this.form['controls'].newPin['controls']['newPin3'].value &&
      this.form['controls'].newPin['controls']['newPin4'].value
    ) {
      for (let i = 1; i < 5; i++) {
        pinNumber =
          pinNumber +
          this.form['controls'].newPin['controls']['newPin' + i].value
        repeatPinNumber =
          repeatPinNumber +
          this.form['controls'].repeatNewPin['controls']['repeatNewPin' + i]
            .value
      }

      if (pinNumber == repeatPinNumber) {
        PinEqualRepeat = true
      } else {
        PinEqualRepeat = false
      }
      return PinEqualRepeat
    }
    return PinEqualRepeat
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
        this.pin5.nativeElement.focus()
        break
      case 5:
        this.pin6.nativeElement.focus()
        break
      case 6:
        this.pin7.nativeElement.focus()
        break
      case 7:
        this.pin8.nativeElement.focus()
        break
    }
  }

  ngOnDestroy() {}

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }
}
