import { Pipe, PipeTransform } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Pipe({
  name: 'quarter',
})
export class QuarterPipe implements PipeTransform {
  constructor(public translate: TranslateService) {}

  transform(value: number): any {
    if (value === 0) {
      return this.translate.instant(
        'dividendDistribution.requestReports.annual',
      )
    }

    const quarter: string = this.translate.instant(
      'dividendDistribution.reports.quarter',
    )
    if (value === 1) {
      return `${value}st ${quarter}`
    }
    if (value === 2) {
      return `${value}nd ${quarter}`
    }
    if (value === 3) {
      return `${value}rd ${quarter}`
    }
    if (value === 4) {
      return `${value}th ${quarter}`
    }

    return null
  }
}
