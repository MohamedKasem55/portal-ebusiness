import {Injectable, Injector} from '@angular/core';
import {AbstractService} from "../../../Common/Services/Abstract/abstract.service";
import {ConfigResourceService} from "../../../../../core/config/config.resource.local";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {CommonValidators} from "../../../Common/constants/common-validators.service";

@Injectable({
  providedIn: 'root'
})
export class DocumentStatusService extends AbstractService{

  constructor(
      private injector: Injector,
      public config: ConfigResourceService,
      protected http: HttpClient,
      public fb: FormBuilder,
      public translateService: TranslateService,
      public commonValidators: CommonValidators
  ) {
    super(http, config);
  }

  getCustDocsModels(modelName): Observable<any>{
    const data = {
      name: modelName
    }

    return this.http.post(this.servicesUrl + '/statics/model', data).pipe(
        map((response: any) => {
          if (response.props) {
            const result = []
            for (const _prop in response.props) {
              if (_prop)
                result.push({ key: _prop, value: response.props[_prop] })
            }
            return result
          }
        }),
        catchError(this.handleError),
    )
  }

  listCustDocRequests(data): Observable<any>{

    return this.http.get(this.servicesUrl + '/custDocs/listCustDocRequests', {params: data}).pipe(
        map((response: any) => response),
        catchError(this.handleError),
    )
  }

  buildFilterForm(){
    return this.fb.group({
      reqState: '01',
      docType: null,
      requesterId: [null, Validators.pattern('^\\S*$')],
      accountNum: null
    })
  }
}
