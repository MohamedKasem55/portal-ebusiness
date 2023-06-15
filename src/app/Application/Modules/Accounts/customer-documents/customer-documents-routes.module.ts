import {Routes} from "@angular/router";
import {RequestNewDocumentComponent} from "./request-new-document/request-new-document.component";
import {DocumentStatusComponent} from "./document-status/document-status.component";
import {DocumentStatusDetailsComponent} from "./document-status-details/document-status-details.component";

export const routes: Routes = [
    {
        path: 'requestNewDocument',
        component: RequestNewDocumentComponent
    },
    {
        path: 'viewDocumentsStatus',
        component: DocumentStatusComponent
    },
    {
        path: 'viewDocumentStatusDetails',
        component: DocumentStatusDetailsComponent
    }
]