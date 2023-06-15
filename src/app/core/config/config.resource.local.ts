import { DOCUMENT } from '@angular/common'
import { Inject, Injectable } from '@angular/core'
import { ConfigService } from '@ngx-config/core'
import { environment } from 'environments/environment'

@Injectable()
export class ConfigResourceService {
  url = ''

  constructor(
    private readonly config: ConfigService,
    @Inject(DOCUMENT) private document,
  ) {
    this.url =
      this.document.location.protocol +
      '//' +
      this.document.location.hostname +
      '/'
  }

   public getDomain(): string {
    if (environment.production) {
      return this.url
    } else {
      return this.config.getSettings('system.domain')
    }
  }

  private getBusinessHubDomain(): string {
    if (environment.production) {
      return this.url
    } else {
      return this.config.getSettings('system.businessHubDomain')
    }
  }

  getServicesUrl(): string {
    return this.getDomain() + this.config.getSettings('system.servicesUrl')
  }
  getPayrollUrl(): string {
    return this.getDomain() + this.config.getSettings('system.payrollUrl')
  }

  getBusinessHubServicesUrl(): string {
    return this.getBusinessHubDomain() + this.config.getSettings('system.servicesUrl')
  }

  getDocumentUrl(): string {
     return this.getDomain() + this.config.getSettings('system.docUrl')
  }

  getPassword(): string {
    return environment.secret
  }

  getApplicationUrl(): string{
    return this.getDomain() + this.config.getSettings('system.applicationUrl')
  }

  get businessHubServicesUrl(): string {
      return this.getBusinessHubServicesUrl() + this.config.getSettings('system.businessHubServicesUrl')
  }
}

