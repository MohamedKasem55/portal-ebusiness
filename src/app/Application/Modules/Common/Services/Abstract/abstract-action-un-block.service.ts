import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AbstractService } from './abstract.service'

@Injectable()
export abstract class AbstractActionUnBlockService extends AbstractService {
  protected constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  protected abstract createBlockRequest(values: any): Observable<any>

  public block(values: any): Observable<any> {
    return this.createBlockRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  protected abstract createUnblockRequest(values: any): Observable<any>

  public unblock(values: any): Observable<any> {
    return this.createUnblockRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }
}
