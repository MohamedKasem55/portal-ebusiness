import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'hiddenCardNumber' })
export class HiddenCardNumberPipe implements PipeTransform {
  transform(value: number, hiddenPart?: string): string {
    if (!value) {
      return ''
    } else {
      return this.hiddenAccount(value, hiddenPart)
    }
  }
  public hiddenAccount(cardNumber: number, hiddenPart?: string): string {
    const number: string = cardNumber.toString()
    let hiddenCardNumber: string
    if (hiddenPart && hiddenPart === '7to12') {
      const cardNumberFirstPart: string = number.substr(0, 6)
      const cardNumberSecondPart: string = number.substr(12, 16)
      hiddenCardNumber = cardNumberFirstPart + '******' + cardNumberSecondPart
    } else {
      const cardNumberFirstPart: string = number.substr(0, 4)
      const cardNumberSecondPart: string = number.substr(11, 16)
      hiddenCardNumber = cardNumberFirstPart + '*******' + cardNumberSecondPart
    }
    return hiddenCardNumber
  }
}
