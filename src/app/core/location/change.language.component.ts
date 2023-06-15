import { HttpClient } from '@angular/common/http'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'

// WILL MANAGE LANGUAGES, NEED TO EXPLORE
export function HttpLoaderFactory(httpclient: HttpClient) {
  return new TranslateHttpLoader(httpclient, 'app/Config/i18n/', '.json')
}
