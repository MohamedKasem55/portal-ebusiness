import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../../core/security/authentication.service'

@Injectable()
export class HajjUmrahService {
  private servicesUrl: string
  baseRoute = '/hajjumra/'
  operationType: any

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public getPending(request): Observable<any> {
    // const data:any = {};
    // data.request=request;
    //console.log(data.request);
    // pending Card Operation list
    return this.http
      .post(
        this.servicesUrl + this.baseRoute + 'pendingCardsOperationList',
        request,
      )
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  public getPendingAllocations(request): Observable<any> {
    return this.http
      .post(
        this.servicesUrl + this.baseRoute + 'pendingCardsAllocatedList',
        request,
      )
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  public operationDetails(batchListsContainerDTO, actionType): Observable<any> {
    const data: any = {}
    data.actionType = actionType
    data.selectedOperations = batchListsContainerDTO.selected
    return this.http
      .post(
        this.servicesUrl + this.baseRoute + 'pendingCardsOperationDetails',
        data,
      )
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  public allocationDetails(
    batchListsContainerDTO,
    actionType,
  ): Observable<any> {
    const data: any = {}
    data.actionType = actionType
    data.selectedOperations = batchListsContainerDTO.allocationsSelected
    return this.http
      .post(
        this.servicesUrl + this.baseRoute + 'pendingCardsAllocatedDetails',
        data,
      )
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  public authorizeConfirm(
    batchListsContainerDTO,
    requestValidate: any,
  ): Observable<any> {
    const data: any = {}
    data.batchListsContainerDTO = batchListsContainerDTO
    data.requestValidate = requestValidate

    return this.http
      .post(
        this.servicesUrl + this.baseRoute + 'pendingAuthorizeCardsOperation',
        data,
      )
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  public authorizeAllocatedConfirm(
    batchListsContainerDTO,
    requestValidate: any,
  ): Observable<any> {
    const data: any = {}
    data.batchListsContainerDTO = batchListsContainerDTO
    data.requestValidate = requestValidate

    return this.http
      .post(
        this.servicesUrl + this.baseRoute + 'pendingAuthorizeCardsAllocated',
        data,
      )
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  public refuseConfirm(
    batchListsContainerDTO,
    rejectReason,
    requestValidate: any,
  ): Observable<any> {
    const data: any = {}
    data.batchListsContainerDTO = {}
    data.batchListsContainerDTO.notAllowed = []
    data.batchListsContainerDTO.notAllowed.push(
      ...batchListsContainerDTO.toProcess,
    )
    data.batchListsContainerDTO.notAllowed.push(
      ...batchListsContainerDTO.toAuthorize,
    )
    data.rejectReason = rejectReason
    data.requestValidate = requestValidate

    return this.http
      .post(
        this.servicesUrl + this.baseRoute + 'pendingRefuseCardsOperation',
        data,
      )
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  public refuseAllocatedConfirm(
    batchListsContainerDTO,
    rejectReason,
    requestValidate: any,
  ): Observable<any> {
    const data: any = {}
    data.batchListsContainerDTO = {}
    data.batchListsContainerDTO.notAllowed = []
    data.batchListsContainerDTO.notAllowed.push(
      ...batchListsContainerDTO.toProcess,
    )
    data.batchListsContainerDTO.notAllowed.push(
      ...batchListsContainerDTO.toAuthorize,
    )
    data.rejectReason = rejectReason
    data.requestValidate = requestValidate

    return this.http
      .post(
        this.servicesUrl + this.baseRoute + 'pendingRefuseCardsAllocated',
        data,
      )
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}

          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }

  setopertionType(typevalue) {
    this.operationType = typevalue
  }

  getopertionType() {
    const operatType = this.operationType
    return operatType
  }
}
