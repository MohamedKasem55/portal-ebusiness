import { HttpClient } from '@angular/common/http'
import { ConfigLoader } from '@ngx-config/core'
import { ConfigHttpLoader } from '@ngx-config/http-loader'

export function configFactoryLocal(http: HttpClient): ConfigLoader {
  return new ConfigHttpLoader(http, 'app/Config/config.json')
}
