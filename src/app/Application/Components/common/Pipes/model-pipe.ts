import { Injector, OnDestroy, Pipe, PipeTransform } from '@angular/core'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Observable, Subscription } from 'rxjs'
import { ModelService } from '../model.service'

@Pipe({ name: 'modelPipe', pure: false })
export class ModelPipe implements PipeTransform, OnDestroy {
  private firstCall = true

  private result: any[] = []

  private subscriptions: Subscription[] = []

  constructor(private injector: Injector) {}

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }

  transform(prop: string, key: any): any {
    if (this.firstCall) {
      this.result = []
      this.injector
        .get(TranslateService)
        .onLangChange.subscribe((event: LangChangeEvent) => {
          this.result = []
          this.callService(prop)
        })
      this.firstCall = false
    }

    this.callService(prop)

    if ('__KEY_VALUE_LIST__' == key) {
      return this.result
    } else if (key) {
      let value = this.injector
        .get(ModelService)
        .retrieveValue(this.result, key)
      if (!value) {
        value = '???.' + key
      }
      return value
    } else {
      return key
    }
  }

  protected callService(prop: string): void {
    const currentLang = this.injector.get(TranslateService).currentLang
    const call = this.injector.get(ModelService).getModel(currentLang, prop)

    if (call instanceof Observable) {
      call.subscribe((result) => (this.result = result))
    } else {
      this.result = call
    }
  }
}
