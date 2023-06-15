import { Injectable } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms'
import { catchError, map } from 'rxjs/operators'
import { AbstractService } from '../Common/Services/Abstract/abstract.service'
import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../core/config/config.resource.local'
import { RequestValidate } from '../../Model/requestvalidateType'
import { FinanceProductCodeService } from '../FinanceProduct/finance-product-code.service'
import { CommonValidators } from '../Common/constants/common-validators.service'
import { Observable } from 'rxjs'
import { SimpleMQ } from 'ng2-simple-mq'


@Injectable()
export class MRCCService extends AbstractService {

  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
    protected fb: FormBuilder,
    private financeProductCode: FinanceProductCodeService,
    public commonValidators: CommonValidators,
    private smq: SimpleMQ,
  ) {
    super(http, config)
  }


  public createCardDetailsForm(data): FormGroup {
    return this.fb.group({
      embossingName: [null, [Validators.required, Validators.pattern(this.commonValidators.nameValidatorPattern)]],
      embossingCompanyName: ['', [Validators.required, Validators.pattern(this.commonValidators.nameValidatorPattern)]],
      account: [null, [Validators.required]],
      amount: [data.financingAmt, [Validators.required]],
      repaymentOption: [5, [Validators.required]],
      dossierId: ['', []],
      termsAccept: [false, [Validators.required]],
    })
  }

  public initiate() {
    const data = { financeProductCode: this.financeProductCode.MRCC_PRODUCT_CODE() }
    return this.http.post(this.servicesUrl + '/finance/initiate', data).pipe(
      map((response: any) => {
        if (response.errorCode !== '0') {
          return null
        } else {
          return response
        }
      }),
    )
  }

  public validateInitialOffer(requestValidate: RequestValidate) {
    const data = { financeProductCode: this.financeProductCode.MRCC_PRODUCT_CODE(), requestValidate }
    return this.http
      .post(this.servicesUrl + '/finance/validateInitialOffer', data)
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


  public getCustomerData() {
    return this.http.get(this.servicesUrl + '/finance/customerData').pipe(
      map((response: any) => {
        if (response.errorCode !== '0') {
          return null
        } else {
          return response
        }
      }),
    )
  }

  public getMandatoryDocuments() {
    return this.http
      .get(
        this.servicesUrl +
        '/finance/mandatoryDocuments/' + this.financeProductCode.MRCC_PRODUCT_CODE(),
      )
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

  public confirmOpenDossier(data) {
    return this.http
      .post(this.servicesUrl + '/finance/confirmOpenDossier', data)
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

  public attachDocument(doessierId, documentCode, file, dataURL) {
    let data = {
      doessierId,
      documentCode,
      fileName: file.name,
      fileType: file.type,
      fileContent: dataURL,
    }
    return this.http.post(this.servicesUrl + '/finance/attachDocument', data)
  }

  public convertFileToURL(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        resolve(reader.result)
      }
    })
  }

  public getEmbosingName() {
    // const data = { financeProductCode: this.financeProductCode.MRCC_PRODUCT_CODE() }
    return this.http.get(this.servicesUrl + '/finance/getEmbosingName').pipe(
      map((response: any) => {
        if (response.errorCode !== '0') {
          return null
        } else {
          return response
        }
      }),
    )
  }


  public getPDFFile(file, fileName) {
    const output = {
      file: new Blob(),
      fileName: file,
    }

    return this.http
      .get(this.config.getDocumentUrl() + '/' + file, {
        responseType: 'blob',
      })
      .pipe(
        map((res: any) => {
          output.file = res
          output.fileName = fileName
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
