import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AbstractInitiatorService } from './abstract-initiator-service'

@Injectable()
export abstract class AbstractActionModifyService extends AbstractInitiatorService {
  protected constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  protected createInitRequest(values: any = null): Observable<any> {
    return undefined
  }

  public init(values: any = null): Observable<any> {
    return this.createInitRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  protected abstract createConfirmRequest(values: any): Observable<any>

  public confirm(values: any): Observable<any> {
    return this.createConfirmRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  protected abstract createValidateRequest(values: any): Observable<any>

  public validate(values: any): Observable<any> {
    return this.createValidateRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  public back(rout: string) {
    return null
  }
}
