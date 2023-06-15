import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { ModelServiceBeneficiariesList } from '../Model/beneficiaries-list-service.model'
import { TranslateDatePipe } from '../../../Components/common/Pipes/hijra-date-pipe'
import { DateFormatPipe } from '../../../Components/common/Pipes/date-format-pipe'

@Injectable({ providedIn: 'root' })
export class BeneficiariesInternationalBagService {
  currentInternationalBeneficiary: any[] = null

  constructor(
    protected injector: Injector,
    @Inject(LOCALE_ID) private _locale: string,
  ) {}

  transformInternationalBeneficiary(jsonObj: any): any {
    if (jsonObj.beneficiaryCategory == 'I') {
      jsonObj.beneficiaryCategory = 'Individual'
    } else if (jsonObj.beneficiaryCategory === 'C') {
      jsonObj.beneficiaryCategory = 'Company'
    } else if (jsonObj.beneficiaryCategory === 'U') {
      jsonObj.beneficiaryCategory = null
    }
    jsonObj.zipCode = jsonObj.zipCode !== null ? jsonObj.zipCode.trim() : ''
    jsonObj.poBox = jsonObj.poBox != null ? jsonObj.poBox.trim() : ''
    jsonObj.city = jsonObj.city != null ? jsonObj.city.trim() : ''
    jsonObj.placeBirth =
      jsonObj.placeBirth != null ? jsonObj.placeBirth.trim() : ''
    const list = new ModelServiceBeneficiariesList(
      jsonObj.name,
      jsonObj.type,
      jsonObj.bankCode,
      jsonObj.bankName,
      jsonObj.beneficiaryAccountCode,
      jsonObj.countryCode,
      jsonObj.beneficiaryCurrency,
      jsonObj.beneficiaryId,
      jsonObj.email,
      jsonObj.beneficiaryAccountCode,

      jsonObj.beneficiaryCategory,
      jsonObj.countryCode,
      jsonObj.branchName,
      jsonObj.fullAccountNumber,
      jsonObj.name,
      //jsonObj.dateBirth,
      jsonObj.dateBirth
        ? new DateFormatPipe(this.injector, this._locale).transform(
            jsonObj.dateBirth,
            'dd/MM/yyyy',
          )
        : '',
      jsonObj.placeBirth.trim(),
      jsonObj.mobileNo,
      jsonObj.address1,
      jsonObj.addressNumber,
      jsonObj.zipCode.trim(),
      jsonObj.poBox.trim(),
      jsonObj.city.trim(),

      jsonObj.nationality,
      jsonObj.ernumber,
      jsonObj,
        jsonObj.nickName
    )
    list['beneficiaryAccount'] = jsonObj.beneficiaryAccount
    return list
  }
}
