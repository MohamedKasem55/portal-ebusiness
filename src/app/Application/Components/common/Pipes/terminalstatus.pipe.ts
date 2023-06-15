import { Injector, Pipe, PipeTransform } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Pipe({
  name: 'terminalstatus',
  pure: false,
})
export class TerminalstatusPipe implements PipeTransform {
  constructor(private injector: Injector) {}

  transform(value: string): any {
    if (value === '1') {
      return this.injector.get(TranslateService).instant('Hemaia')
    } else if (value === '2') {
      return this.injector.get(TranslateService).instant('Abana')
    }

    return value
  }
}
