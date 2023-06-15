import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minSec'
})
export class MinSecPipe implements PipeTransform {

  transform(value: number): any {
    return (value > 9)?value:"0"+value
  }

}
