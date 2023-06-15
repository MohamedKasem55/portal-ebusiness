import { Pipe, PipeTransform } from '@angular/core'
import { BusinessCardsListItems } from '../../../Modules/CommercialCards/commercial-cards-models'

@Pipe({ name: 'cardBalancePercentage' })
export class CardBalancePercentagePipe implements PipeTransform {
  transform(targetData: any): string {
    if (!targetData) {
      return ''
    } else {
      return this.calculatePercentage(targetData)
    }
  }
  public calculatePercentage(targetData: any): string {
    const percentage = 100
    const totalBalance: number = targetData.cashLimit
    const amountUnbilled: number = targetData.unbilledAmt
    let hiddenCardNumberPercentage: string
    let hiddenCardNumber: number
    if (totalBalance && amountUnbilled) {
      hiddenCardNumber = (amountUnbilled * percentage) / totalBalance
      hiddenCardNumberPercentage = hiddenCardNumber + '%'
    } else {
      hiddenCardNumber = 0
      hiddenCardNumberPercentage = hiddenCardNumber + '%'
    }
    return hiddenCardNumberPercentage
  }
}
