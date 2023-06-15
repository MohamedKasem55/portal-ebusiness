import { ErrorGenerate } from '../../../Model/errorGenerate'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
export class ActivateCardModel {
  digit1: number
  digit2: number
  digit3: number
  digit4: number
  digit5: number
  digit6: number
  digit7: number
  digit8: number
  digit9: number
  digit10: number
  digit11: number
  digit12: number
  digit13: number
  digit14: number
  digit15: number
  digit16: number
  newPin1: number
  newPin2: number
  newPin3: number
  newPin4: number
  repeatNewPin1: number
  repeatNewPin2: number
  repeatNewPin3: number
  repeatNewPin4: number
  code1: number
  code2: number
  code3: number
  code4: number

  constructor(
    _digit1: number,
    _digit2: number,
    _digit3: number,
    _digit4: number,
    _digit5: number,
    _digit6: number,
    _digit7: number,
    _digit8: number,
    _digit9: number,
    _digit10: number,
    _digit11: number,
    _digit12: number,
    _digit13: number,
    _digit14: number,
    _digit15: number,
    _digit16: number,
    _newPin1: number,
    _newPin2: number,
    _newPin3: number,
    _newPin4: number,
    _repeatNewPin1: number,
    _repeatNewPin2: number,
    _repeatNewPin3: number,
    _repeatNewPin4: number,
    _code1: number,
    _code2: number,
    _code3: number,
    _code4: number,
  ) {
    this.digit1 = _digit1
    this.digit2 = _digit2
    this.digit3 = _digit3
    this.digit4 = _digit4
    this.digit5 = _digit5
    this.digit6 = _digit6
    this.digit7 = _digit7
    this.digit8 = _digit8
    this.digit9 = _digit9
    this.digit10 = _digit10
    this.digit11 = _digit11
    this.digit12 = _digit12
    this.digit13 = _digit13
    this.digit14 = _digit14
    this.digit15 = _digit15
    this.digit16 = _digit16
    this.newPin1 = _newPin1
    this.newPin2 = _newPin2
    this.newPin3 = _newPin3
    this.newPin4 = _newPin4
    this.repeatNewPin1 = _repeatNewPin1
    this.repeatNewPin2 = _repeatNewPin2
    this.repeatNewPin3 = _repeatNewPin3
    this.repeatNewPin4 = _repeatNewPin4
    this.code1 = _code1
    this.code2 = _code2
    this.code3 = _code3
    this.code4 = _code4
  }
}

export interface AccountDigits {
  digit1?: number
  digit2?: number
  digit3?: number
  digit4?: number
  digit5?: number
  digit13?: number
  digit14?: number
  digit15?: number
  digit16?: number
}

// tslint:disable-next-line: max-classes-per-file
export class RequestValidateActivate {
  cardNumber: string
  cardSeqNumber: string
}
// tslint:disable-next-line: max-classes-per-file
export class ResponseValidateActivate extends ErrorGenerate {
  cardNumber: string
  cardSeqNumber: string
}
// tslint:disable-next-line: max-classes-per-file
export class RequestConfirmActivate {
  cardNumber: string
  cardSeqNumber: string
  requestValidate: RequestValidate
}
// tslint:disable-next-line: max-classes-per-file
export class ResponseConfirmActivate extends ErrorGenerate {}
