import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'typeOperationStatusConverter',
})
export class TypeOperationStatusConverterPipe implements PipeTransform {
  private typeOperation = {
    RG: 'public.register',
    MD: 'public.modify',
    BL: 'public.block',
    UB: 'public.unblock',
    DL: 'public.delete',
    DU: 'public.deleteUnregistered',
    UR: 'public.unregistered',
    RP: 'public.resetPwd'
  }

  transform(value: string): unknown {
    return this.typeOperation[value]
  }
}
