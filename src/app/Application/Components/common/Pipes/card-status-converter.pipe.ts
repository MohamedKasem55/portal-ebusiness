import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'cardStatusConverter',
})
export class CardStatusConverterPipe implements PipeTransform {
  private cardStatuses = {
    AT: 'cardStatus.Active',
    AC: 'cardStatus.Renewed',
    EX: 'cardStatus.Expiring',
    SO: 'cardStatus.Blocked',
    RP: 'cardStatus.Replaced',
    NP: 'cardStatus.Issued',
  }

  transform(value: string): unknown {
    return this.cardStatuses[value]
  }
}
