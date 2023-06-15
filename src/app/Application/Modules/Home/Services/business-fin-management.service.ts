import {Injectable} from '@angular/core';
import {AppService} from "../../../../core/service/app.service";
import {HttpClient} from "@angular/common/http";
import {ConfigResourceService} from "../../../../core/config/config.resource.local";
import {Observable} from "rxjs";
import {BfmBaseRequest} from "../business-finance-managment/model/bfm-base-request";
import {TopByCategoryRequest} from "../business-finance-managment/model/top-by-category-request";
import {TopBySubCategoryRequest} from "../business-finance-managment/model/top-by-sub-category-request";
import {POSLocation} from "../business-finance-managment/model/p-o-s-location";
import {environment} from "../../../../../environments/environment";

@Injectable()
export class BusinessFinManagementService extends AppService {
    servicesUrl: string
    currentUser

    constructor(private http: HttpClient, public config: ConfigResourceService) {
        super()
        this.servicesUrl = environment.bfmUrl
    }

    getActualAndExpected(actualReq: BfmBaseRequest): Observable<any> {
        return this.http.post(this.servicesUrl + 'actual-expected', actualReq)
    }

    getBalanceAndCashFlow(actualReq: BfmBaseRequest): Observable<any> {
        return this.http.post(this.servicesUrl + 'balance-cashflow', actualReq)
    }

    getTopByCategory(topByCategoryRequest: TopByCategoryRequest): Observable<any> {
        return this.http.post(this.servicesUrl + 'top-by-category', topByCategoryRequest)
    }

    getTopSubCategory(topBySubCategoryRequest: TopBySubCategoryRequest) {
        return this.http.post(this.servicesUrl + 'top-subcats-by-category', topBySubCategoryRequest)
    }

    getPOSLocation(posLocation: POSLocation): Observable<any> {
        return this.http.post(this.servicesUrl + 'pos-by-location', posLocation)
    }

}
