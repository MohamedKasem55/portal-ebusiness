import { Pipe, PipeTransform } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Pipe({
  name: 'operation',
})
export class OperationPipe implements PipeTransform {
  constructor(public translate: TranslateService) {}

  transform(value: '00' | '01' | '02'): any {
    switch (value) {
      case '00':
        return this.translate.instant('posRequest.add')
      case '01':
        return this.translate.instant(
          'companyAdmin.beneficiaryOriginator.modify',
        )
      case '02':
        return this.translate.instant('public.delete')
    }
  }
}
