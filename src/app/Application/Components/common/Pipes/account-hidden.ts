import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'hiddenAccount' })
export class HiddenAccountPipe implements PipeTransform {
  transform(value: number, active: boolean): string {
    if (!value) {
      return ''
    } else {
      return this.hiddenAccount(value, active)
    }
  }
  public hiddenAccount(accountNumber: number, active: boolean): string {
    const account: string = accountNumber.toString()
    let hiddenAccount: string
    if (active != null) {
      if (active) {
        const accountFirstPart: string = account.substr(0, 6)
        const accountSecondPart: string = account.substr(12, 16)
        hiddenAccount = accountFirstPart + '******' + accountSecondPart
      } else {
        hiddenAccount = '**** **** **** ****'
      }
    } else {
      const lastPart: string = account.substr(12, 16)
      hiddenAccount = '**** **** **** ' + lastPart
    }
    return hiddenAccount
  }
}
