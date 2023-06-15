import {Injectable} from '@angular/core'
import {FormControl} from '@angular/forms'

@Injectable({
    providedIn: 'root',
})
export class CommonValidators {

    EMAIL_VALIDATOR = '^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]+$'

    ONLY_ENGLISH = '^[A-Za-z ]*$'

    ONLY_ENGLISH_NUMBERS = '^([a-zA-Z0-9]+\\s?)*$'

    ONLY_ENGLISH_WITH_SPACE = '^([a-zA-Z]+\\s?)*$'

    accepted_media_types = '.xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf'

    accepted_media_types_to_upload = '.png,.pdf,.jpg'

    mobileNumberValidatorPattern = '(\\+9665|05|[+]*[0-9]{1,4})[0-9]{8,8}$'

    mobileNumberTextPattern = '05xxxxxxxx,+9665xxxxxxxx or +xxxxxxxxx'

    mobileNumberFormatPattern = '05xxxxxxxx/+9665xxxxxxxx/+xxxxxxxxx'

    nameValidatorPattern='^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$'

    URpayVIBANPattern='^(SA)[0-9]{2}(802)[0-9]{8}(22)[0-9]{4}(01)[0-9]$'

    URpayMobilePattern='(05)[0-9]{8}$'

    IbanLength=24

    localIBANPattern='^(SA)[0-9]{22}$'

    saudiIbanWithOrWithoutLetters = '\\b([SA]{2})[A-Z0-9]{22}$'

    internationalIbanWithOrWithoutLetters = '\\b([A-Z]{2})?[0-9]{22}$'

    getValidatorForSAID(control: FormControl): any {
        if (
            control === null ||
            control === undefined ||
            control.value === null ||
            control.value === undefined
        ) {
            return null
        }
        let id = control.value
        id = id ? id.trim() : ''
        if (Number(id) === null) {
            return {'incorrecId-Iqama': true}
        }
        if (id.length !== 10) {
            return {'incorrecId-Iqama': true}
        }
        const _type = id.substr(0, 1)
        if (_type !== '2' && _type !== '1') {
            return {'incorrecId-Iqama': true}
        }
        let sum = 0
        for (let i = 0; i < 10; i++) {
            if (i % 2 === 0) {
                const ZFOdd = String('00' + String(Number(id.substr(i, 1)) * 2)).slice(
                    -2,
                )
                sum += Number(ZFOdd.substr(0, 1)) + Number(ZFOdd.substr(1, 1))
            } else {
                sum += Number(id.substr(i, 1))
            }
        }
    }
}
