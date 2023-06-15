import {Component, OnInit, ViewChild} from '@angular/core'
import {TranslateService} from '@ngx-translate/core'
import {Breadcrumb} from 'app/Application/Modules/FinanceProduct/shared/models/common'
import {Subject, Subscription} from 'rxjs'
import {Router} from "@angular/router";
import {FinanceFleetNewReqService} from "../../../fleet/requests/fleet-finance.service";
import {ColumnMode, DatatableComponent} from "@swimlane/ngx-datatable";

@Component({
    selector: 'branches',
    templateUrl: './branches.component.html',
    styleUrls: ['./branches.component.scss'],
})
export class BranchesComponent implements OnInit {

    breadCrumb: Breadcrumb[] = []
    subscriptions: Subscription[] = []
    branchesLst: any = []
    filteredLst: any = []
    public defaultColumnMode = ColumnMode.force
    public defaultHeight: any = 'auto'
    public defaultWidth: any = 'auto'
    @ViewChild(DatatableComponent) branchesTable: DatatableComponent;

    constructor(
        public translate: TranslateService,
        public router: Router,
        public newReqService: FinanceFleetNewReqService
    ) {
        this.getBranches()
    }

    ngOnInit(): void {
        this.translate.get('fleet').subscribe((data: any) => {
            this.breadCrumb = [
                {txt: data.newRequest.Finance, active: false},
                {txt: data.newRequest.NoteligibleTitle, active: true},
                {txt: data.newRequest.viewBranches, active: true},
            ]
        })
    }

    getBranches() {
        this.newReqService.getAllBranchesRes().subscribe((response) => {
                console.log("response from branches:", response)
                if (response === null) {
                    this.router.navigate(['/']).then(() => {
                    });
                } else {
                    this.branchesLst = response
                    this.filteredLst = [...response];
                }
            },
            (error) => {
                this.router.navigate(['/']).then(() => {
                })
            },
        )
    }

    onSearch(event) {
        let val = event.target.value.toLowerCase();
        const temp = this.filteredLst?.filter((d) => {
            return d.branch.toLowerCase().indexOf(val) !== -1 || !val;
        });
        this.branchesLst = temp;
        this.branchesTable.offset = 0;
    }

  navigateTo(navUrl):void{
    this.router.navigate([navUrl])
  }
}
