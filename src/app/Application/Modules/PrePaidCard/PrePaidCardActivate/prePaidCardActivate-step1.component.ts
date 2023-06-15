import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  EventEmitter,
  Output,
  ElementRef,
} from '@angular/core'
import {
  FormControl,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms'
import { PrePaidCardService } from '../prePaidCard.service'
import { PrepaidCardItem } from '../PrePaidCardList/prePaidCardListModel'

@Component({
  selector: 'app-step1',
  templateUrl: './prePaidCardActivate-step1.component.html',
})
export class PrePaidCardActivateStep1Component implements OnInit, OnDestroy {
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
  public prepaidCardSelected: PrepaidCardItem
  constructor(
    private fb: FormBuilder,
    public prePaidCardService: PrePaidCardService,
  ) {}

  ngOnInit() {
    this.onInit.emit(this as Component)
    this.prepaidCardSelected = this.prePaidCardService.getPrepaidCardSelected()
    console.log('this.prepaidCardList', this.prepaidCardSelected)
  }

  ngOnDestroy() {}
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
  isValidPass(): boolean {
    if (
      this.form.controls['repeatNewPin4'].value &&
      this.form.controls['newPin4'].value
    ) {
      if (
        this.form.controls['repeatNewPin4'].value ==
        this.form.controls['newPin4'].value
      ) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
  validatePin() {
    // obtainAccountForm(form: any): string {
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
      // if (this.form.controls.newPin.valid && this.form.controls.repeatNewPin.valid) {
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
}
