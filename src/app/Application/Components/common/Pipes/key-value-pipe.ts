import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'keyValuePipe', pure: true })
export class KeyValuePipe implements PipeTransform {
  transform(key: string, array: Array<any>): any {
    if (key) {
      for (const entry of array) {
        if (entry.key === key) {
          return entry.value
        }
      }
    }
    return null
  }
}
