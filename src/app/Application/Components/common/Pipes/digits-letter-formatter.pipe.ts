import {Injectable, Pipe, PipeTransform} from "@angular/core";

@Pipe({ name: 'digitsLetterFormatterPipe' })
@Injectable({
    providedIn: 'root'
})
export class DigitsLetterFormatterPipe implements PipeTransform {

     lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "K" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
    ]

     public transform(value: any, ...args: any[]): any {
        const regExp = /\.0+$|(\.[0-9]*[1-9])0+$/

        let item = this.lookup.slice().reverse().find(item => value >= item.value)
        return item ? (value / item.value).toFixed(2).replace(regExp, "$1") + item.symbol : "0"
    }

}