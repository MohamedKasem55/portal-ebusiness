import { Component, OnInit, Input, OnChanges, Injector } from '@angular/core'
import { TableRow } from '../../information/utils/table-row.interface'
import { StorageService } from 'app/core/storage/storage.service'

@Component({
  selector: 'app-information-data',
  templateUrl: './information-data.component.html',
  styleUrls: ['./information-data.component.scss'],
})
export class InformationDataComponent implements OnInit, OnChanges {
  @Input() userDataTable: TableRow[]
  @Input() limitsDataTable: TableRow[]
  @Input() smsDataTable: TableRow[]

  public filteredUserDataTable: TableRow[] = []
  public filteredLimitsDataTable: TableRow[] = []
  public filteredSmsDataTable: TableRow[] = []
  public lastLoginSuccesfull = false
  userImage: any
  constructor(private _storage: StorageService, public injector: Injector) {}

  ngOnInit(): void {
    const storageService = this.injector.get(StorageService)
    const current = JSON.parse(storageService.retrieve('currentUser'))

    this.userImage = current.user.userImage
      ? current.user.userImage
      : 'img/default-avatar.svg'
    //console.log( this.userImage);
  }
  public ngOnChanges() {
    this.filteredUserDataTable = this._filteredTableData(this.userDataTable)
    this.filteredLimitsDataTable = this._filteredTableData(this.limitsDataTable)
    this.filteredSmsDataTable = this._filteredTableData(this.smsDataTable)
  }

  private _filteredTableData(tableData: TableRow[]): TableRow[] {
    const filteredTable: TableRow[] = []
    if (!tableData) {
      return filteredTable
    }
    tableData.forEach((row) => {
      if (row.haveToShow) {
        filteredTable.push(row)
      }
      if (
        row.name === 'welcome.lastLogonStatusLbl' &&
        row.value === 'Successful'
      ) {
        this.lastLoginSuccesfull = true
      }
    })
    return filteredTable
  }

  public isIconField(row): boolean {
    return (
      row.name === 'welcome.lastLogonStatusLbl' ||
      row.name === 'welcome.lastLogonDateTimeLbl'
    )
  }

  public customLayout(row): string {
    const standardLayout = 'col-xs-6 col-sm-3'
    const largeLayout = 'col-xs-12 col-sm-3'
    if (
      row.name === 'welcome.lastLogonDateTimeLbl' ||
      row.name === 'welcome.companyNameLbl'
    ) {
      return largeLayout
    }
    return standardLayout
  }

  public customTextColor(value): string {
    const notArabicPattern =
      /[^\u0600-\u06ff\u0750-\u077f\ufb50-\ufc3f\ufe70-\ufefc]$/
    return notArabicPattern.test(value) ? 'text-color' : 'text-color-ar'
  }
}
