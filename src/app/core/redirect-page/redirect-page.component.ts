import {Component, OnInit} from '@angular/core';
import {ConfigResourceService} from "../config/config.resource.local";
import {Router} from "@angular/router";
import {StorageService} from "../storage/storage.service";
import {QueryParamsManipulationService} from "../../Application/Components/common/services/query-params-manipulation.service";

@Component({
    selector: 'app-redirect-page',
    templateUrl: './redirect-page.component.html',
    styleUrls: ['./redirect-page.component.scss']
})
export class RedirectPageComponent implements OnInit {

    constructor(
        private config: ConfigResourceService,
        private router: Router,
        private storageService: StorageService,
    ) {
    }

    ngOnInit(): void {
        const queryParams = QueryParamsManipulationService.parseQueryParams(document.documentURI)
        const queryParamsArr = QueryParamsManipulationService.parseQueryParamsArr(queryParams)
        const redirectTo = QueryParamsManipulationService.getQueryParam('redirectTo', queryParams)

        setTimeout(() => {
            if(this.storageService.retrieve('welcome') && redirectTo){

                this.router.navigate([`business-hub/${redirectTo}/dashboard`], {
                    queryParams: QueryParamsManipulationService.transformParamArrToObj(queryParamsArr)
                })
            } else {
                this.router.navigateByUrl('/')
            }
        },1000)
     }

}
