import { CurrencyPipe } from '@angular/common'
import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Injector,
  Input,
  LOCALE_ID,
  OnInit,
  Optional,
} from '@angular/core'
import { NgModel } from '@angular/forms'

@Directive({
  selector: '[inputPattern]',
})
export class InputPattern implements OnInit {
  @Input() inputPattern: string
  regStr: any

  constructor(
    private element: ElementRef,
    @Optional() private ngModel: NgModel,
    private injector: Injector,
    @Inject(LOCALE_ID) private locale: string,
  ) {}

  ngOnInit() {
    switch (this.inputPattern) {
      case 'onlyDigits':
        this.regStr = /[0-9]$/
        break
      case 'onlyNumbers':
        this.regStr = /[0-9\-]$/
        break
      case 'onlyFormattedNumbers':
        this.regStr = /[0-9\-]$/
        break
      case 'onlyPositiveNumbers':
        this.regStr = /[0-9]$/
        break
      case 'onlyFormattedPositiveNumbers':
        this.regStr = /[0-9]$/
        break
      case 'accountRulesOnlyDecimalNumbers':
        this.regStr = /^[-]{0,1}\d{0,13}\.?\d{0,2}$/
        break
      case 'onlyDecimalNumbers':
        this.regStr = /^[-]{0,1}\d{0,15}\.?\d{0,2}$/
        break
      case 'onlyFormattedDecimalNumbers':
        this.regStr = /^[-]{0,1}\d{0,15}\.?\d{0,2}$/
        break
      case 'onlyPositiveDecimalNumbers':
        this.regStr = /^\d{0,15}\.?\d{0,2}$/
        break
      case 'onlyFormattedPositiveDecimalNumbers':
        this.regStr = /^\d{0,15}\.?\d{0,2}$/
        break
      case 'notArabic':
        this.regStr = /[^\u0600-\u06ff\u0750-\u077f\ufb50-\ufc3f\ufe70-\ufefc]$/
        break
      case 'notArabicNotSpaces':
        this.regStr = /^[a-zA-Z0-9_-\u0600-\u06ff\u0750-\u077f\ufb50-\ufc3f\ufe70-\ufefc]$/
        break
      case 'onlyMobileNumbers':
        this.regStr = /[\+0-9]$/
        break
      case 'noSpecials':
        this.regStr = /^[a-zA-Z0-9_-]$/
        break
      case 'noSpecialsAndSpaces':
        this.regStr = /^[ a-zA-Z0-9_-]$/
        break
      case 'onlyAlphabetics':
        this.regStr =
          /[A-Za-z\s\u0600-\u06ff\u0750-\u077f\ufb50-\ufc3f\ufe70-\ufefc]$/
        break
      default:
        this.regStr = new RegExp(this.inputPattern)
        break
    }
  }

  @HostListener('keypress', ['$event']) onKeyPress(event) {
    const e = event as KeyboardEvent

    const code = e.which || e.keyCode || 0
    if (
      [8, 9, 27, 13, 190].indexOf(code) !== -1 ||
      // Allow: Ctrl+C
      (code == 67 && e.ctrlKey === true) ||
      // Allow: Ctrl+V
      (code == 86 && e.ctrlKey === true) ||
      (code == 118 && e.ctrlKey === true) ||
      // Allow: Ctrl+X
      (code == 88 && e.ctrlKey === true) ||
      //firefox allow home, end, left, right
      e.key == 'ArrowLeft' ||
      e.key == 'ArrowRight' ||
      e.key == 'Home' ||
      e.key == 'End'
    ) {
      // Allow: home, end, left, right
      //(code >= 35 && code <= 39)) {

      return
    }
    const ch = String.fromCharCode(code)
    const actValue = (e.target as HTMLInputElement).value
    if (this.regStr.test(ch)) {
      switch (this.inputPattern) {
        case 'onlyMobileNumbers':
        case 'onlyDecimalNumbers':
        case 'onlyPositiveDecimalNumbers':
        case 'accountRulesOnlyDecimalNumbers':
          if (!this.regStr.test(actValue + ch)) {
            e.preventDefault()
          } else {
            return
          }
          break
        default:
          return
      }
    } else {
      e.preventDefault()
    }
  }

  @HostListener('blur', ['$event']) onBlur(event) {
    const e = event as KeyboardEvent
    const value = (e.target as HTMLInputElement).value
    switch (this.inputPattern) {
      case 'onlyFormattedNumbers':
      case 'onlyFormattedPositiveNumbers':
        const value1 =
          value !== '' && value !== null && value !== undefined ? value : 0
        const temp1 = `${value1}`.replace(/\,/g, '')
        const transformed1 = new CurrencyPipe(this.locale)
          .transform(temp1, '', '', '1.0-0', this.locale)
          .replace('$', '')
          ;(e.target as HTMLInputElement).value = transformed1
        break
      case 'onlyFormattedDecimalNumbers':
      case 'onlyFormattedPositiveDecimalNumbers':
        const value2 =
          value !== '' && value !== null && value !== undefined ? value : 0
        const temp2 = `${value2}`.replace(/\,/g, '')
        const transformed2 = new CurrencyPipe(this.locale)
          .transform(temp2, '', '', '1.2-2', this.locale)
          .replace('$', '')
          ;(e.target as HTMLInputElement).value = transformed2
        break
      default:
        return
    }
  }
}
