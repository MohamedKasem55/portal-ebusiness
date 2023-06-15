import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'ArrayOfObjects' })
export class ArrayOfObjects implements PipeTransform {
  transform(value: any): any {
    if (value) {
      let keys = Object.keys(value)
      let values = Object.values(value)
      let output = []
      for (let i = 0; i < keys.length; i++) {
        let o = { key: keys[i], value: values[i] }
        output.push(o)
      }
      return output
    }
    return []
  }
}
