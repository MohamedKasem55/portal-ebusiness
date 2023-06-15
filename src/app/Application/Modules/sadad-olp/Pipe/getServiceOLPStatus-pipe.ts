import { Injector, Pipe, PipeTransform } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Pipe({ name: 'serviceOLPStatus', pure: false })
export class ServiceOLPStatusPipe implements PipeTransform {
  transform(status: string): string {
    const translate = this.injector.get(TranslateService)

    // public static final String MERCHANT_STATUS_TESTING= "2";
    // public static final String MERCHANT_STATUS_ACTIVE= "3";
    // public static final String MERCHANT_STATUS_BLACKLISTED= "4";
    // public static final String MERCHANT_STATUS_ONHOLD= "5";
    // public static final String MERCHANT_STATUS_CLOSED= "6";
    // public static final String MERCHANT_STATUS_DISABLED= "7";
    // public static final String MERCHANT_STATUS_PENDING_APPROVAL= "101";
    // public static final String MERCHANT_STATUS_APPROVED= "102";
    // public static final String MERCHANT_STATUS_REJECTED= "103";

    if (status) {
      const translate_key = 'MERCHANT_STATUS' + '_' + status
      return this.injector
        .get(TranslateService)
        .instant('sadadOLP.caEnrollment.' + translate_key)
    } else {
      return ''
    }
  }

  constructor(private injector: Injector) {}
}
