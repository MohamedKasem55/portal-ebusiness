import {Injectable} from '@angular/core';
import {AbstractService} from "../../../Common/Services/Abstract/abstract.service";
import {ConfigResourceService} from "../../../../../core/config/config.resource.local";
import {HttpClient} from "@angular/common/http";
import {FormBuilder} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class DocumentStatusDetailsService extends AbstractService{

  constructor(
      public config: ConfigResourceService,
      protected http: HttpClient,
      public fb: FormBuilder,
      public translateService: TranslateService
  ) {
    super(http, config);
  }

  downloadDocument(fileNetID, serviceType): Observable<any>{

    const params = {
      serviceType: serviceType
    }

    return this.http.get(this.servicesUrl + `/custDocs/downloadDocument/${fileNetID}`, {params: params}).pipe(
        map((response: any) => response),
        catchError(this.handleError),
    )
  }
}
