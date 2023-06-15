import { Injector, Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'lastLogonDateTime', pure: false })
export class LastLogonDateTimePipe implements PipeTransform {
  constructor(private injector: Injector) {}
  // Function that returns the type of payment / transfer depending on the code obtained taking into account the language
  transform(valueLastLogonDateTime: string, dateTime: string): string {
    let date: string
    let time: string
    let cadena: string[]
    let value: string

    cadena = valueLastLogonDateTime.split(' ')
    date = cadena[0]
    time = cadena[1]

    if (dateTime === 'time') {
      value = time
    } else {
      value = date
    }
    return value
  }
}
