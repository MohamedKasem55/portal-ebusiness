import {Pipe, PipeTransform} from '@angular/core'

@Pipe({ name: 'maskMobileNumber' })
export class MaskMobileNumber implements PipeTransform {


    transform(mobile: string): string {
        if (!mobile) {
            return ''
        } else {
            return this.mask(mobile)
        }
    }

    public mask(mobile: string): string {
        const masked = [...mobile].map((char, i) => {
            if (mobile.length - 2 > i && i > 1) {
                return "X"
            }
            return char
        });

        return masked.join("")
    }

}

