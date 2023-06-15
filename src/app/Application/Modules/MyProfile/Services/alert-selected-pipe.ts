import { Injectable } from '@angular/core'

@Injectable()
export class AlertSelectedPipe {
  data: any

  public pushData(_data: any) {
    this.data = _data
  }

  public popData(): any {
    const aux = this.data
    delete this.data
    return aux
  }
}
