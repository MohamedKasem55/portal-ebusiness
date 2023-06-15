import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AbstractService } from './abstract.service'

@Injectable()
export abstract class AbstractActionDetailsService extends AbstractService {
  static number = 0

  id: any

  selectedItem: any = {}

  protected constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  public getSelectedItem() {
    return this.selectedItem
  }

  public setSelectedItem(itemDetails) {
    this.selectedItem = itemDetails
  }

  protected abstract createInitRequest(): Observable<any>

  public init(): Observable<any> {
    return this.createInitRequest().pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  protected abstract createDetailRequest(values: any): Observable<any>

  public detail(values: any): Observable<any> {
    return this.createDetailRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  public clearData() {
    this.selectedItem = null
  }
}
