// Imports
import { HttpClient, HttpParams } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'

@Component({
  selector: 'my-profile-requested-files',
  templateUrl: '../View/my-profile-requested-files.component.html',
})

// Component class implementing OnInit
export class MyProfileRequestedFiles
  extends DatatableMobileComponent
  implements OnInit
{
  public rows: any[]
  public selected = []
  public servicesUrl
  public columns = []
  router: any
  constructor(
    private _http: HttpClient,
    public translate: TranslateService,
    public _config: ConfigResourceService,
  ) {
    super()
    this.servicesUrl = _config.getServicesUrl()
  }
  ngOnInit() {
    super.ngOnInit()
    const body: any = {
      order: 'string',
      orderType: 'string',
      page: 1,
      rows: 25,
    }

    this.columns = [{ prop: 'requested' }]
    this._http
      .post(this.servicesUrl + '/audit/report/list', body)
      .subscribe((res) => {
        if (res['errorCode'] === '0') {
          this.rows = []

          for (const row of res['auditReporfiles'].items) {
            this.rows.push({ requested: row })
          }
        }
      })
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length)
    this.selected.push(...selected)
  }

  test(a) {
    //console.log(a.bodyComponent.temp);
  }

  add() {
    this.selected.push(this.rows[1], this.rows[3])
  }

  update() {
    this.selected = [this.rows[1], this.rows[3]]
  }

  remove() {
    let listSelectedFiles: string[]
    listSelectedFiles = []
    for (const row of this.selected) {
      listSelectedFiles.push(row['requested'])
    }
    const data = {
      auditReporfiles: listSelectedFiles,
      errorCode: 'string',
      errorDescription: 'string',
      errorResponse: {
        arabicMessage: 'string',
        code: 'string',
        description: 'string',
        englishMessage: 'string',
      },
      size: 0,
      total: 0,
    }
    let _param: HttpParams = new HttpParams()
    _param = _param.append('deletebody', JSON.stringify(data))
    this._http
      .delete(this.servicesUrl + '/audit/report/delete', { params: _param })
      .subscribe((res: any) => {
        if (res['errorCode'] == '0') {
          const body: any = {
            order: 'string',
            orderType: 'string',
            page: 1,
            rows: 25,
          }
          this._http
            .post(this.servicesUrl + '/audit/report/list', body)
            .subscribe((res) => {
              if (res['errorCode'] === '0') {
                this.rows = []
                for (const row of res['auditReporfiles'].items) {
                  this.rows.push({ requested: row })
                }
              }
            })
        }
      })
  }

  download(value: string) {
    this._http
      .post(
        this.servicesUrl + '/audit/report/download',
        { parameter: <string>value },
        { responseType: 'blob' },
      )
      .subscribe((res: any) => {
        if (res === null) {
        } else {
          const blobObject = res
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

        // const downloadUrl = URL.createObjectURL(res);
        // const link = document.createElement('a');
        //link.download = value;
        //link.href = downloadUrl;
        //document.body.appendChild(link);
        // link.click();
      })
  }

  setPage(a) {}
}
