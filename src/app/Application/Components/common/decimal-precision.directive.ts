import { Directive, HostListener, Input } from '@angular/core'

/**
 * Allows the aside to be toggled via click.
 */
@Directive({
  selector: '[decimal-precision]',
})
export class DecimalPrecisionDirective {
  @Input('decimal-precision')
  precision = '2'

  constructor() {}

  getPrecision() {
    return this.precision ? parseInt(this.precision, 10) : 2
  }

  @HostListener('change', ['$event'])
  onChange($event: any) {
    event.target['value'] = (+event.target['value']).toFixed(
      this.getPrecision(),
    )
  }

  @HostListener('keydown', ['$event'])
  keyDown($event: any) {
    if (isNaN(+event['key'])) {
      return true
    }
    if ((event.target['value'] + '').lastIndexOf('.') === -1) {
      return true
    }
    if ((event.target['value'] + '').split('.').length > 1) {
      if ((event.target['value'] + '').split('.')[1].length > 1) {
        return false
      } else {
        return true
      }
    }
    return true
  }

  @HostListener('input', ['$event'])
  input($event: any) {
    if ((event.target['value'] + '').lastIndexOf('.') !== -1) {
      if (
        (event.target['value'] + '').lastIndexOf('.') + this.getPrecision() <
        (event.target['value'] + '').length
      ) {
        event.target['value'] = (+event.target['value']).toFixed(
          this.getPrecision(),
        )
      }
    }
    return true
  }
}
