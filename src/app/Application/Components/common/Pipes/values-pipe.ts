import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'values' })
export class ValuesPipe implements PipeTransform {
  transform(value: any, args: any[] = null): any {
    if (value) {
      return Object.keys(value).sort(function (a, b) {
        return a > b ? 1 : b > a ? -1 : 0
      })
      //.map(key => value[key]);
    }
    return []
  }
}
