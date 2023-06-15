import { Injectable } from '@angular/core'
import { SessionStorageService } from 'ngx-webstorage'
import { Observable } from 'rxjs'
import { LogService } from '../log/log.service'

// A LAYER ABOVE LOCALSTORAGE, WHY??
// BECAUSE WE COULD NEED A GLOBALSTORAGE !!
@Injectable()
export class StorageService {
  constructor(
    private logService: LogService,
    private sessionStorage: SessionStorageService,
  ) {}

  store(key: string, value: any): void {
    this.sessionStorage.store(key, value)
  }
  retrieve(key: string): any {
    return this.sessionStorage.retrieve(key)
  }
  clear(key?: string): void {
    this.sessionStorage.clear(key)
  }
  observe(key: string): Observable<any> {
    return this.sessionStorage.observe(key)
  }

  clearAll(): void {
    this.logService.log.info('StorageService -> clearAll')
    const lang = this.sessionStorage.retrieve('currentLanguage')
    this.sessionStorage.clear()
    this.sessionStorage.store('currentLanguage', lang)
  }
}
