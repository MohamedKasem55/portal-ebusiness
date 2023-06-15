import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AbstractActionForWizardService } from './abstract-action-for-wizard.service'

@Injectable()
export abstract class AbstractActionAproveService extends AbstractActionForWizardService {
  aproveOperation = 'APROVE'
  refuseOperation = 'REFUSE'
  deleteOperation = 'DELETE'
  reInitiateOperation = 'REINITIATE'

  selectedItems: any[] = []
  operation: any

  protected constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  protected abstract createConfirmRequest(values: any): Observable<any>

  public confirm(values: any): Observable<any> {
    return this.createConfirmRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  protected abstract createRefuseRequest(values: any): Observable<any>

  public refuse(values: any): Observable<any> {
    return this.createRefuseRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  protected createDeleteRequest(values: any): Observable<any> {
    return of({
      errorCode: '0',
    })
  }

  public delete(values: any): Observable<any> {
    return this.createDeleteRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  protected createReInitiateRequest(values: any): Observable<any> {
    return of({
      errorCode: '0',
    })
  }

  public reInitiate(values: any): Observable<any> {
    return this.createReInitiateRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  protected abstract createDetailsRequest(values: any): Observable<any>

  public details(values: any): Observable<any> {
    return this.createDetailsRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  public getSelectedItems() {
    return this.selectedItems
  }

  public setSelectedItems(selected) {
    this.selectedItems = selected
  }

  public getOperation() {
    return this.operation
  }

  public setOperation(operation) {
    this.operation = operation
  }

  public clearData() {
    this.selectedItems = null
    this.operation = null
  }
}
