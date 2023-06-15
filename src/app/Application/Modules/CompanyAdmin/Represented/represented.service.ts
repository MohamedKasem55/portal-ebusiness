import { Injectable } from '@angular/core'
import { AbstractService } from '../../Common/Services/Abstract/abstract.service'
import { HttpClient, HttpParams } from '@angular/common/http'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { CommonValidators } from '../../Common/constants/common-validators.service'
import { SimpleMQ } from 'ng2-simple-mq'
import { Page } from '../../../Model/page'

@Injectable()
export class RepresentedService extends AbstractService {
  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
    protected fb: FormBuilder,
    public commonValidators: CommonValidators,
    private smq: SimpleMQ,
  ) {
    super(http, config)
  }

  public createDetailsForm(data): FormGroup {
    return this.fb.group({
      repGivenName: [data.repGivenName, [Validators.required]],
      repMiddleName: [data.repMiddleName, []],
      repPaternalName: [data.repPaternalName, []],
      repFamilyName: [data.repFamilyName, [Validators.required]],
      repPhone: [data.repPhone?.repPhoneNum, [Validators.required, Validators.pattern('(05)[0-9]{8,8}$')]],
      repBirthDt: data.repBirthDt ? [new Date(data.repBirthDt), [Validators.required]] : ['', [Validators.required]],
      repIDNum: [data.repIdentityInfo?.repIDNum, [Validators.required, this.commonValidators.getValidatorForSAID, Validators.pattern('^[0-9]*$')]],
      repIDIssuerName: [data.repIdentityInfo?.repIDIssuerName, [Validators.required,Validators.maxLength(30)]],
      repIDIssueDt: data.repIdentityInfo?.repIDIssueDt ? [new Date(data.repIdentityInfo.repIDIssueDt), [Validators.required]] : ['', [Validators.required]],
      repIDExpDt: data.repIdentityInfo?.repIDExpDt ? [new Date(data.repIdentityInfo.repIDExpDt), [Validators.required]] : ['', [Validators.required]],
      repStatus: [data.repSttsCd, []],
    })
  }

  public createPowerForm(data): FormGroup {
    return this.fb.group({
      repStartDate: data.repStartDate ? [{
        value: new Date(data.repStartDate),
        disabled: true,
      }, [Validators.required]] : [{
        value: new Date(),
        disabled: true,
      }, [Validators.required]],
      repEndDate: data.repEndDate ? [new Date(data.repEndDate), [Validators.required]] : ['', [Validators.required]],
      signatureFile: ['', [Validators.required]],
    })
  }

  public getAccounts(txType: string): Observable<Array<Account>> {
    const data = {
      order: '',
      orderType: '',
      page: 1,
      rows: 100,
      txType,
    }

    return this.http.post(this.servicesUrl + '/accounts', data).pipe(
      map((response: any) => {
        const result = new Array<Account>()

        const output = response

        const size = output.size

        for (let _i = 0; _i < size; _i++) {
          result.push(output.listAccount[_i] as Account)
        }

        return result
      }),
    )
  }


  public getPowerList(): Observable<any> {
    return this.http.post(this.servicesUrl + '/statics/model', { name: 'powerList' }).pipe(
      map((response: any) => {
        if (response.props) {
          const items = response.props
          let result = []
          Object.keys(items).forEach(function(key) {
            result.push({ key, value: items[key], enabled: false })
          })
          return result
        } else {
          return null
        }
      }),
    )
  }


  public getRepList(statusCode): Observable<any> {
    return this.http.get(this.servicesUrl + '/representative/list?statusCode=' + statusCode).pipe(
      map((response: any) => {
        if (response.errorCode !== '0') {
          return null
        } else {
          return response.representativeInfo
        }
      }),
    )
  }

  public add(data): Observable<any> {
    return this.http
      .post(this.servicesUrl + '/representative/add', data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        }),
      )
  }

  public edit(data): Observable<any> {
    return this.http
      .post(this.servicesUrl + '/representative/modify', data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        }),
      )
  }

  public getRepDetails(repSgntrId): Observable<any> {
    return this.http.get(this.servicesUrl + '/representative/details?repSgntrId=' + repSgntrId).pipe(
      map((response: any) => {
        if (response.errorCode !== '0') {
          return null
        } else {
          return response
        }
      }),
    )
  }

  public deleteRep(data): Observable<any> {
    let _param: HttpParams = new HttpParams()
    _param = _param.append('deletebody', JSON.stringify(data))
    return this.http.delete(this.servicesUrl + '/representative/delete', { params: _param }).pipe(
      map((response: any) => {
        if (response.errorCode !== '0') {
          return null
        } else {
          return response
        }
      }),
    )
  }

  public getFile() {
    const output = {
      file: new Blob(),
      fileName: 'Signature.png',
    }

    return this.http
      .get(this.config.getDocumentUrl() + '/' + 'RepresentativeSignature.png', {
        responseType: 'blob',
      })
      .pipe(
        map((res: any) => {
          output.file = res
          output.fileName = 'Signature.png'
          return output
        }),
        catchError((): Observable<any> => {
          this.smq.publish(
            'error-mq',
            'Document Not Found',
          )
          return null
        }),
      )
  }
}

export enum PageType {
  ADD = 'ADD',
  VIEW = 'VIEW',
  EDIT = 'EDIT'
}
