import { HttpErrorResponse, HttpResponse } from '@angular/common/http'
import { ErrorHandler, Injectable, Injector } from '@angular/core'
import { Router } from '@angular/router'
import { StorageService } from '..//storage/storage.service'
import { LogService } from '../log/log.service'

@Injectable()
export class CustomErrorHandler extends ErrorHandler {
  private router
  private storageService
  private smq

  constructor(private injector: Injector, private logService: LogService) {
    super()
  }

  public handleError(error) {
    if (this.router == null) {
      this.router = this.injector.get(Router)
    }

    if (this.storageService == null) {
      this.storageService = this.injector.get(StorageService)
    }
    console.log('error', error)
    this.logService.log.error(error)
    if (error instanceof HttpResponse) {
      if(error.status === 403){
        this.router.navigateByUrl(['/'])
      }
      else if (error.status === 401 ) {
        if (this.storageService) {
          this.storageService.clear('currentUser')
        }
        this.router.navigateByUrl('/login?exit=401').then(() => {
          window.location.reload();
        })
      } else {
        super.handleError(error)
      }
    } else {
      super.handleError(error)
      if (error instanceof HttpErrorResponse) {
        if(error.status === 403){
          this.router.navigateByUrl(['/'])
        }
        else if (error.status === 401 ) {
          if (this.storageService) {
            this.storageService.clear('currentUser')
          }
          this.router.navigateByUrl('/login?exit=401').then(() => {
            window.location.reload();
          })
        }
      }
      if (
        error.errorDescription &&
        error.errorDescription.indexOf('401') != -1
      ) {
        this.router.navigateByUrl('/login?exit=401').then(() => {
          window.location.reload();
        })
      }
      else if( error.errorDescription &&
        error.errorDescription.indexOf('403') != -1){
          this.router.navigateByUrl(['/'])
        }
    }
  }
}
