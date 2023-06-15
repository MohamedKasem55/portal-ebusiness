import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'

@Injectable()
export class DownloadTemplatesService {
  servicesUrl: string

  constructor(private http: HttpClient, private config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  getFile(name) {
    const output = {
      file: new Blob(),
      fileName: '',
    }

    const data = {
      name,
    }

    return this.http
      .post(this.servicesUrl + '/template/download', data, {
        responseType: 'blob',
      })
      .pipe(
        map((res) => {
          output.file = res
          output.fileName = data.name

          //

          return output
        }),
      )
  }
}
