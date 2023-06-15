import {Injectable} from '@angular/core';
import {AbstractService} from "../../Common/Services/Abstract/abstract.service";
import {ConfigResourceService} from "../../../../core/config/config.resource.local";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ExternalApplicationService extends AbstractService {

    constructor(public http: HttpClient,
                public config: ConfigResourceService) {
        super(http, config);
        this.servicesUrl = config.getServicesUrl().concat('/external/')
    }

    getToken(app) {
        return this.doGet(this.servicesUrl + app + '/getToken')
    }
}
