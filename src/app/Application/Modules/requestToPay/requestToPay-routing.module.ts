import {Routes} from '@angular/router'
import {RequestToPayComponent} from "./requestToPay.component";
import {RequestToPayNewRequestComponent} from "./new-request/requestToPay-new-request.component";
import {RequestToPayRequestDetailsComponent} from "./request-details/request-details.component";

export const routes: Routes = [
    {
        path: '',
        component: RequestToPayComponent,
    },
    {
        path: 'newRequest',
        component: RequestToPayNewRequestComponent,
    },
    {
        path: 'details',
        component: RequestToPayRequestDetailsComponent,
    },
]
