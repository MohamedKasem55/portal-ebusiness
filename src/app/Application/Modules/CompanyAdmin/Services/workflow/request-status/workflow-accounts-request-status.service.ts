import {Injectable} from '@angular/core';
import {AbstractListService} from "../../../../Common/Services/Abstract/abstract-list.service";
import {HttpClient} from "@angular/common/http";
import {ConfigResourceService} from "../../../../../../core/config/config.resource.local";
import {Observable, of} from "rxjs";

@Injectable()
export class WorkflowAccountsRequestStatusService extends AbstractListService {

    private selectedItem: any = null;
    public static isPending = 'P'
    public static isRejected = 'R'
    public constructor(
        protected http: HttpClient,
        public config: ConfigResourceService,
    ) {
        super(http, config);
    }

    setSelectedItem(selectedItem: any): void {
        this.selectedItem = selectedItem;
    }

    getSelectedItem(): any {
        return this.selectedItem;
    }

    protected createDataRequest(criteria: any, order: string, orderType: string, page: number, rows: number): Observable<any> {
        const params = {
            page,
            rows
        };
        return this.http.post(this.servicesUrl + '/workflow/requestStatus/accounts/list', params);
    }

    protected getOutputFromRequestedData(_body): any {
        if (_body) {
            const items = _body['workflowAccountBatchList']['items'].sort((a, b) => {
                return a['initiationDate'] > b['initiationDate'] ? -1 : b['initiationDate'] > a['initiationDate'] ? 1 : 0
            })
        }
        const itemsData = _body.workflowAccountBatchList
        return {
            items: itemsData?.items ? itemsData?.items : [], // _body.cardsList,
            total: itemsData?.total ? itemsData?.total : 0,
            size: itemsData?.size ? itemsData?.size : 0,
        };
    }

}
