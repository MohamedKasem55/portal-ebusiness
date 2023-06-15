import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'ignoreGMT', pure: true })
export class IgnoreGMTPipe implements PipeTransform {
  transform(value: Date): Date {
    const newDate = value;
    const timeZoneDifference = (newDate.getTimezoneOffset() / 60) * -1; //convert to positive value.
    newDate.setTime(newDate.getTime() + (timeZoneDifference * 60) * 60 * 1000);
    newDate.toISOString();
    return newDate;
  }
}