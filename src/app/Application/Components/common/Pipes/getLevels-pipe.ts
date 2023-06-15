import { Injector, Pipe, PipeTransform } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { BatchSecurity } from '../../../Model/Batch/BatchSecurity'
import { StatusLevels } from '../../../Model/statusLevels.model'

@Pipe({ name: 'levels', pure: false })
export class LevelFormatPipe implements PipeTransform {
  transform(securityLevels: BatchSecurity[], type: string): string | null {
    const translate = this.injector.get(TranslateService)
    let status = ''
    let nextStatus = ''
    for (let index = 0; index < securityLevels.length; index++) {
      const batchSecurityDTO: BatchSecurity = securityLevels[index]
      if (batchSecurityDTO.status == 'I' || batchSecurityDTO.status == 'A') {
        status = status + ' L' + batchSecurityDTO.level
      } else {
        nextStatus = nextStatus + ' L' + batchSecurityDTO.level
      }
    }
    status = status + '\t'

    if (nextStatus == '') {
      if (translate.currentLang == 'en') {
        nextStatus = this.injector
          .get(TranslateService)
          .instant('public.completed')
      } else {
        nextStatus = this.injector
          .get(TranslateService)
          .instant('public.completed')
      }
    }
    const statuslevel: StatusLevels = new StatusLevels(status, nextStatus)
    let result = ''
    if (type == 'status') {
      result = statuslevel.status
    } else {
      result = statuslevel.nextStatus
    }
    return result
  }

  constructor(private injector: Injector) {}
}
