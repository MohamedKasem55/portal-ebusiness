import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import {CommunityServicesComponent} from "./community-services/community-services.component";
import {SingleCharityTransferComponent} from "./single-charity-transfer/single-charity-transfer.component";

export const routes: Routes = [
    {
        path: 'community-services',
        component: CommunityServicesComponent
    },
    {
        path: 'single-charity-transfer',
        component: SingleCharityTransferComponent
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CharityTransferRoutingModule {}