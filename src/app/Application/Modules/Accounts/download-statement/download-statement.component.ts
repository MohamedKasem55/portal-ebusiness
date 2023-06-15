import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { AccountStatementsService } from '../Services/account-statements.service'

@Component({
  selector: 'app-download-statement',
  templateUrl: './download-statement.component.html',
  styleUrls: ['./download-statement.component.scss'],
})
export class DownloadStatementComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('checkboxesCell', { static: true })
  public checkboxCellTemplate: TemplateRef<any>
  @ViewChild('anchorCell', { static: true })
  public anchorCellTemplate: TemplateRef<any>

  public files: { name: string }[] = []
  public filesToDelete: string[] = []
  searchlistPage
  downloadlist
  viewMolFilesPage: any
  tableSelected = []

  constructor(private accountStatementsService: AccountStatementsService) {
    super()
  }

  ngOnInit() {
    this.list(null)
  }

  public toogle(name: string): void {
    const idIndex: number = this.filesToDelete.indexOf(name)

    if (idIndex < 0) {
      this.filesToDelete.push(name)
    } else {
      this.filesToDelete.splice(idIndex, 1)
    }
  }

  public download(name: string): void {
    const body = { parameter: name }
    this.accountStatementsService.download(body).subscribe((resp) => {
      if (name.substring(name.length - 3).toUpperCase() == 'XLS') {
        this.downloadFile(resp, 'statements.xls')
      } else {
        this.downloadFile(resp, 'statements.pdf')
      }
    })
  }

  private downloadFile(blob, name: string): void {
    if (blob !== null) {
      const blobObject = blob
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blobObject, name)
      } else {
        const downloadUrl = URL.createObjectURL(blobObject)
        const link = document.createElement('a')
        link.download = name
        link.href = downloadUrl
        document.body.appendChild(link)
        link.click()
      }
    }
  }

  list(dataTableEvent): void {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    dataTableEvent.offset + 1
    this.accountStatementsService.list().subscribe(
      (data) => {
        this.viewMolFilesPage = data.listStatement
      },
      (err) => {
        //console.log(err);
      },
    )
  }

  onSelect({ selected }) {
    this.tableSelected = []
    this.tableSelected.splice(0, selected.length)
    this.tableSelected.push(...selected)
    return this.tableSelected
  }

  deleteFiles() {
    const files = []
    for (let i = 0; i < this.tableSelected.length; ++i) {
      files.push(this.tableSelected[i].element)
    }
    const subscription = this.accountStatementsService
      .delete(files)
      .subscribe((response) => {
        subscription.unsubscribe()
        if (response === null) {
        } else {
          this.tableSelected = []
          this.list(null)
        }
      })
  }

  getId(row) {
    return row['element']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }
}
