/**
 * Service to obtain the balance certificate
 */
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { TranslateDatePipe } from '../../../Components/common/Pipes/hijra-date-pipe'
import { Exception } from '../../../Model/exception'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
import { ModelServiceBeneficiariesList } from '../Model/beneficiaries-list-service.model'
import { ModelPipe } from '../../../Components/common/Pipes/model-pipe'
import { DateFormatPipe } from '../../../Components/common/Pipes/date-format-pipe'

@Injectable()
export class BeneficiariesListService {
  token: string
  servicesUrl: string
  currentUser
  benifidetails
  benifi: any

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    protected injector: Injector,
    @Inject(LOCALE_ID) private _locale: string,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  // Service management error
  public handleError(error: HttpResponse<any> | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string
    if (error instanceof HttpResponse) {
      const err = error['error'] || JSON.stringify(error)
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`
    } else {
      errMsg = error.message ? error.message : error.toString()
    }
    console.error(errMsg)
    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }

  public getResults(
    order: string,
    orderType: string,
    page: number,
    rows: number,
    beneficiaryType: string,
    beneficiaryName: string,
    bankCode: string,
    bankName: string,
    currency: string,
    criteria: string,
  ): Observable<any> {
    const data = {
      erNumber: '',
      filterBankName: criteria == 'bankCode' ? bankCode : bankName,
      filterBenefName: beneficiaryName,
      filterCriteria: criteria,
      filterCurrency: currency,
      order: '',
      orderType: '',
      page,
      rows,
      type: beneficiaryType,
    }

    //console.log("Params service");

    const body = JSON.stringify(data)

    return this.http.post(this.servicesUrl + '/beneficiaries', body).pipe(
        map((response: any) => {
          const result: any = {}
          const body2 = response

          if (response.errorCode !== '0') {
            return null
          } else {
            // Cada vez que se usa este servicio se obtienen todos las descripciones
            // para los codigos de moneda y pais del servicio estatico

            // output is the father node of the content response
            const output = body2.beneficiaryList
            const pagedData = new PagedData<ModelServiceBeneficiariesList>()
            const pageObject = new Page()
            result.jsonListBeneficiaries = []

            pageObject.pageNumber = page
            pageObject.pageSize = rows
            pageObject.size = body2.size
            pageObject.totalElements = body2.total
            pageObject.totalPages = pageObject.totalElements / pageObject.pageSize

            for (let i = 0; i < pageObject.size; i++) {
              const jsonObj = output[i]
              result.jsonListBeneficiaries.push(jsonObj)


              // Category
              if (jsonObj.beneficiaryCategory == 'I') {
                jsonObj.beneficiaryCategory = 'Individual'
              } else if (jsonObj.beneficiaryCategory === 'C') {
                jsonObj.beneficiaryCategory = 'Company'
              } else if (jsonObj.beneficiaryCategory === 'U') {
                jsonObj.beneficiaryCategory = null
              }

              // -------------------------------------------------------------
              // ------------ Fin cambio en los literales --------------------

              // Clean white spaces of bank names

              jsonObj.poBox =
                  jsonObj.poBox === null || jsonObj.poBox === undefined
                      ? jsonObj.poBox
                      : jsonObj.poBox.trim()
              jsonObj.placeBirth =
                  jsonObj.placeBirth === null || jsonObj.placeBirth === undefined
                      ? jsonObj.placeBirth
                      : jsonObj.placeBirth.trim()
              jsonObj.zipCode =
                  jsonObj.zipCode === null || jsonObj.zipCode === undefined
                      ? jsonObj.zipCode
                      : jsonObj.zipCode.trim()
              jsonObj.nationality =
                  jsonObj.nationality === null || jsonObj.nationality === undefined
                      ? jsonObj.nationality
                      : jsonObj.nationality.trim()
              jsonObj.bankCode =
                  jsonObj.bankCode === null || jsonObj.bankCode === undefined
                      ? jsonObj.bankCode
                      : jsonObj.bankCode.trim()

              if (jsonObj.type == '02' || jsonObj.type == '2') {
                const bankNameStr = new ModelPipe(this.injector).transform(
                    'bankCode',
                    jsonObj.bankCode,
                )
                jsonObj.bankName = bankNameStr
              }

              jsonObj.beneficiaryAccountCode =
                  jsonObj.beneficiaryAccountCode === null ||
                  jsonObj.beneficiaryAccountCode === undefined
                      ? jsonObj.beneficiaryAccountCode
                      : jsonObj.beneficiaryAccountCode.trim()
              if (jsonObj.beneficiaryAccount) {
                jsonObj['beneficiaryAccount']['beneficiaryAccount'] =
                    jsonObj['beneficiaryAccount']['beneficiaryAccount'] !== null &&
                    jsonObj['beneficiaryAccount']['beneficiaryAccount']
                        ? jsonObj['beneficiaryAccount']['beneficiaryAccount'].trim()
                        : jsonObj['beneficiaryAccount']['beneficiaryAccount']

                jsonObj['beneficiaryAccount']['ccdmAlias'] =
                    jsonObj['beneficiaryAccount']['ccdmAlias'] !== null &&
                    jsonObj['beneficiaryAccount']['ccdmAlias']
                        ? jsonObj['beneficiaryAccount']['ccdmAlias'].trim()
                        : jsonObj['beneficiaryAccount']['ccdmAlias']

                jsonObj['beneficiaryAccount']['fullAccountNumber'] =
                    jsonObj['beneficiaryAccount']['fullAccountNumber'] !== null &&
                    jsonObj['beneficiaryAccount']['fullAccountNumber']
                        ? jsonObj['beneficiaryAccount']['fullAccountNumber'].trim()
                        : jsonObj['beneficiaryAccount']['fullAccountNumber']

                jsonObj['beneficiaryAccount']['account18Length'] =
                    jsonObj['beneficiaryAccount']['account18Length'] !== null &&
                    jsonObj['beneficiaryAccount']['account18Length']
                        ? jsonObj['beneficiaryAccount']['account18Length'].trim()
                        : jsonObj['beneficiaryAccount']['account18Length']

                jsonObj['beneficiaryAccount']['numberAccount'] =
                    jsonObj['beneficiaryAccount']['numberAccount'] !== null &&
                    jsonObj['beneficiaryAccount']['numberAccount']
                        ? jsonObj['beneficiaryAccount']['numberAccount'].trim()
                        : jsonObj['beneficiaryAccount']['numberAccount']
              }
              const list = new ModelServiceBeneficiariesList(
                  jsonObj.name,
                  jsonObj.type,
                  jsonObj.bankCode,
                  jsonObj.bankName,
                  jsonObj.beneficiaryAccountCode,
                  jsonObj.countryCode,
                  jsonObj.beneficiaryCurrency,
                  jsonObj.beneficiaryId,
                  jsonObj.email,
                  jsonObj.beneficiaryAccountCode,
                  jsonObj.beneficiaryCategory,
                  jsonObj.countryCode,
                  jsonObj.branchName,
                  jsonObj.fullAccountNumber,
                  jsonObj.name,
                  //jsonObj.dateBirth,
                  jsonObj.dateBirth
                      ? new Date(
                          new DateFormatPipe(this.injector, this._locale).transform(
                              jsonObj.dateBirth,
                              'yyyy-MM-dd',
                          ),
                      )
                      : null,
                  jsonObj.placeBirth,
                  jsonObj.mobileNo,
                  jsonObj.address1,
                  jsonObj.addressNumber,
                  jsonObj.zipCode,
                  jsonObj.poBox,
                  jsonObj.city,

                  jsonObj.nationality,
                  jsonObj.ernumber,
                  jsonObj,
                  jsonObj.nickName
              )

              pagedData.data.push(list)
            }
            pagedData.page = pageObject
            result.pagedData = pagedData
            return result
          }
        }),
      catchError(this.handleError),
    )
  }

  public listDetails(type, ernumber, beneficiaryId): Observable<any> {
    const data: any = {}
    data.beneficiaryId = beneficiaryId
    data.ernumber = ernumber
    data.type = type
    return this.http
      .post(this.servicesUrl + '/beneficiaries/details', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            const output = body
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  setDetails(data) {
    this.benifidetails = data
  }

  getDetails() {
    this.benifi = this.benifidetails
    return this.benifi
  }
}
