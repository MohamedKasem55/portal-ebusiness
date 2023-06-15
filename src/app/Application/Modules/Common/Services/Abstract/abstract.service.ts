import { HttpClient, HttpResponse } from '@angular/common/http'
import { throwError as observableThrowError, Subject, Observable} from 'rxjs'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Exception } from '../../../../Model/exception'
import {catchError, map} from 'rxjs/operators';

export abstract class AbstractService {
  servicesUrl: string

  protected constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
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
    //console.error(errMsg);
    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }

  public responseHasError(response: any): boolean {
    return response && response.errorCode !== '0';
  }

  public getResponseAsException(response: any): Exception {
    if (this.responseHasError(response)) {
      const exception: Exception = new Exception(
        response.errorCode,
        response.errorDescription,
      )
      return exception
    }
    return null
  }

  public doGet(url: string, options: any = {}, handler: (response: any) => any = null, emitError: boolean = false): Observable<any> | Observable<Exception> {
    const subject: Subject<any> = new Subject();
    this.http.get(url, options ? options : {})
        .pipe(
            map((response: any) => {
                if (this.responseHasError(response)) {
                    if (emitError) {
                        subject.next(this.getResponseAsException(response));
                    }
                    subject.complete();
                    return;
                }
                subject.next(handler ? handler(response) : response);
                subject.complete();
            }),
            catchError(this.handleError),
        )
        .subscribe(() => {
        });
    return subject.asObservable();
}

public doPost(url: string, body: any, options: any = {}, handler: (response: any) => any = null, emitError: boolean = false): Observable<any> | Observable<Exception> {
    const subject: Subject<any> = new Subject();
    this.http.post(url, body, options ? options : {})
        .pipe(
            map((response: any) => {
                if (this.responseHasError(response)) {
                    if (emitError) {
                        subject.next(this.getResponseAsException(response));
                    }
                    subject.complete();
                    return;
                }
                subject.next(handler ? handler(response) : response);
                subject.complete();
            }),
            catchError(this.handleError),
        )
        .subscribe(() => {
        });
    return subject.asObservable();
}

public doPut(url: string, body: any, options: any = {}, handler: (response: any) => any = null, emitError: boolean = false): Observable<any> | Observable<Exception> {
    const subject: Subject<any> = new Subject();
    this.http.put(url, body, options ? options : {})
        .pipe(
            map((response: any) => {
                if (this.responseHasError(response)) {
                    if (emitError) {
                        subject.next(this.getResponseAsException(response));
                    }
                    subject.complete();
                    return;
                }
                subject.next(handler ? handler(response) : response);
                subject.complete();
            }),
            catchError(this.handleError),
        )
        .subscribe(() => {
        });
    return subject.asObservable();
}

public doPatch(url: string, body: any, options: any = {}, handler: (response: any) => any = null, emitError: boolean = false): Observable<any> | Observable<Exception> {
    const subject: Subject<any> = new Subject();
    this.http.patch(url, body, options ? options : {})
        .pipe(
            map((response: any) => {
                if (this.responseHasError(response)) {
                    if (emitError) {
                        subject.next(this.getResponseAsException(response));
                    }
                    subject.complete();
                    return;
                }
                subject.next(handler ? handler(response) : response);
                subject.complete();
            }),
            catchError(this.handleError),
        )
        .subscribe(() => {
        });
    return subject.asObservable();
}

public doDelete(url: string, options: any = {}, handler: (response: any) => any = null, emitError: boolean = false): Observable<any> | Observable<Exception> {
    const subject: Subject<any> = new Subject();
    this.http.delete(url, options ? options : {})
        .pipe(
            map((response: any) => {
                if (this.responseHasError(response)) {
                    if (emitError) {
                        subject.next(this.getResponseAsException(response));
                    }
                    subject.complete();
                    return;
                }
                subject.next(handler ? handler(response) : response);
                subject.complete();
            }),
            catchError(this.handleError),
        )
        .subscribe(() => {
        });
    return subject.asObservable();
}

  public getUnescapedStr(str) {
    const txt = document.createElement('textarea')
    txt.innerHTML = unescape(str)
    return txt.value
  }
}
