import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AbstractService } from './abstract.service'

@Injectable()
export abstract class AbstractActionSingleAproveService extends AbstractService {
  aproveOperation = 'APROVE'
  refuseOperation = 'REFUSE'

  selectedItem: any
  operation: any

  protected constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  protected abstract createConfirmBlockRequest(values: any): Observable<any>

  public confirmBlock(values: any): Observable<any> {
    return this.createConfirmBlockRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  protected abstract createRefuseBlockRequest(values: any): Observable<any>

  public refuseBlock(values: any): Observable<any> {
    return this.createRefuseBlockRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  protected abstract createConfirmUnblockRequest(values: any): Observable<any>

  public confirmUnblock(values: any): Observable<any> {
    return this.createConfirmUnblockRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  protected abstract createRefuseUnblockRequest(values: any): Observable<any>

  public refuseUnblock(values: any): Observable<any> {
    return this.createRefuseUnblockRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  protected abstract createConfirmModifyRequest(values: any): Observable<any>

  public confirmModify(values: any): Observable<any> {
    return this.createConfirmModifyRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  protected abstract createRefuseModifyRequest(values: any): Observable<any>

  public refuseModify(values: any): Observable<any> {
    return this.createRefuseModifyRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  protected abstract createConfirmDeleteRequest(values: any): Observable<any>

  public confirmDelete(values: any): Observable<any> {
    return this.createConfirmDeleteRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  protected abstract createRefuseDeleteRequest(values: any): Observable<any>

  public refuseDelete(values: any): Observable<any> {
    return this.createRefuseDeleteRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  protected abstract createConfirmRegisterRequest(values: any): Observable<any>

  public confirmRegister(values: any): Observable<any> {
    return this.createConfirmRegisterRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  protected abstract createRefuseRegisterRequest(values: any): Observable<any>

  public refuseRegister(values: any): Observable<any> {
    return this.createRefuseRegisterRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  public getSelectedItem() {
    return this.selectedItem
  }

  public setSelectedItem(selected) {
    this.selectedItem = selected
  }

  public getOperation() {
    return this.operation
  }

  public setOperation(operation) {
    this.operation = operation
  }

  public clearData() {
    this.selectedItem = null
    this.operation = null
  }
}
