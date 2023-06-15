import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AbstractService } from './abstract.service'

@Injectable()
export abstract class AbstractActionForWizardService extends AbstractService {
  protected constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  protected abstract createInitRequest(values: any): Observable<any>

  public init(values: any = {}): Observable<any> {
    return this.createInitRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  protected abstract createStepRequest(
    step: number,
    values: any,
  ): Observable<any>

  public step(step: number, values: any): Observable<any> {
    return this.createStepRequest(step, values).pipe(
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
}
