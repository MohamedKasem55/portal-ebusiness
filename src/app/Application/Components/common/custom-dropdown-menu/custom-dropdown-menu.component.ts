import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    DoCheck, OnChanges,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'app-custom-dropdown-menu',
    templateUrl: './custom-dropdown-menu.component.html',
    styleUrls: ['./custom-dropdown-menu.component.scss'],
})
export class CustomDropdownMenuComponent implements OnInit,OnChanges {
    @Input() menuTitles: string[]
    @Output() onSelectItem: EventEmitter<any> = new EventEmitter<any>()
    @Output() onSelectAction: EventEmitter<any> = new EventEmitter<any>()
    @Input() useNewStyle = false;
    @Input() selectedIndex=0;

    selectedTitle: string
    isCollapsed = false

    constructor(public translate: TranslateService) {}

    ngOnInit(): void {
        this.selectedTitle = this.menuTitles[this.selectedIndex]
    }
    ngOnChanges(): void {

    }
    onSelect(event, obj: any){
        this.selectedTitle = obj
        this.onSelectItem.emit(event)
        this.onSelectAction.emit(obj)
        this.toggleCollapse()
    }

    toggleCollapse(){
        this.isCollapsed = !this.isCollapsed;
    }
}
