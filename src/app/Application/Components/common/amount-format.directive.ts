import {Directive, ElementRef, HostListener, Input} from '@angular/core'


@Directive({
    selector: '[amount-format]',
})
export class AmountFormatDirective {

    constructor(private el: ElementRef) {

    }

    ngOnInit(){
        if(this.el && this.el.nativeElement.value){
            this.el.nativeElement.value = this.formatValue(+this.el.nativeElement.value)
        }
    }

    @HostListener('change', ['$event'])
    onChange(event: any) {
        if(!event.target['value']){
            return
        }
        const value = event.target['value'].toString().replace(/,/g, '')
        event.target['value'] = this.formatValue(+value)
    }


    formatValue(amount) : string{
            return amount.toLocaleString('en-US', {'minimumFractionDigits': 2})
    }

}
