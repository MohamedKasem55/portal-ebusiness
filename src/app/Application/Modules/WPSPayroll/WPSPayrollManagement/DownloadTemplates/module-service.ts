import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'

@Injectable()
export class ModuleService {
  servicesUrl
  constructor(private http: HttpClient, public config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  getFileSalary() {
    const output = {
      file: new Blob(),
      fileName: '',
    }
    const data = {
      name: 'PSH_WPS_Payroll_Upload_File.xlsm',
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

  getFileEmployee() {
    const output = {
      file: new Blob(),
      fileName: '',
    }

    const data = {
      name: 'WPS_Payroll_employees_list.xlsm',
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
