import { Injector, Pipe, PipeTransform } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Pipe({ name: 'statusPipe', pure: false })
export class StatusPipe implements PipeTransform {
  constructor(private injector: Injector) {}

  transform(value: string): any {
    if (value === 'I') {
      return this.injector.get(TranslateService).instant('status.initiate')
    } else if (value === 'P') {
      return this.injector.get(TranslateService).instant('status.pending')
    } else if (value === 'A') {
      return this.injector.get(TranslateService).instant('status.aprove')
    } else if (value === 'R') {
      return this.injector.get(TranslateService).instant('status.rejected')
    } else if (value === '1') {
      return this.injector.get(TranslateService).instant('New Shipment')
    }

    return value
  }
}
