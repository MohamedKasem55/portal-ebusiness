import { Injectable } from '@angular/core'
import { AbstractActionAddService } from './abstract-action-add.service'

@Injectable()
export abstract class AbstractInitiatorService extends AbstractActionAddService {
  public abstract back(rout: string)
}
