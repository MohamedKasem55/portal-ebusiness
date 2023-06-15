import {
  Component,
  Inject,
  Injector,
  LOCALE_ID,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { TranslateService } from '@ngx-translate/core'
import { interval } from 'rxjs'
import { Exception } from '../../../../../Model/exception'
import { AbstractAppComponent } from '../../../../Common/Components/Abstract/abstract-app.component'
import { StaticService } from '../../../../Common/Services/static.service'
import { CashManagementSweepingDetailService } from './cash-management-sweeping-detail.service'
declare let jsPDF: any

declare namespace Html2Canvas {
  interface Html2CanvasOptionsBeta {
    /** Whether to allow cross-origin images to taint the canvas */
    allowTaint?: boolean

    /** Canvas background color, if none is specified in DOM. Set undefined for transparent */
    background?: string

    /** Define the heigt of the canvas in pixels. If null, renders with full height of the window. */
    height?: number

    /** Whether to render each letter seperately. Necessary if letter-spacing is used. */
    letterRendering?: boolean

    /** Whether to log events in the console. */
    logging?: boolean

    /** Url to the proxy which is to be used for loading cross-origin images. If left empty, cross-origin images won't be loaded. */
    proxy?: string

    /** Whether to test each image if it taints the canvas before drawing them */
    taintTest?: boolean

    /** Timeout for loading images, in milliseconds. Setting it to 0 will result in no timeout. */
    timeout?: number

    /** Define the width of the canvas in pixels. If null, renders with full width of the window. */
    width?: number

    /** Whether to attempt to load cross-origin images as CORS served, before reverting back to proxy. */
    useCORS?: boolean

    /** Use svg powered rendering where available (FF11+). */
    svgRendering?: boolean

    /** Necesario añadirlo para la version beta y no tener que tocar el modulo */
    async?: boolean
  }
}

type Html2CanvasStaticBeta = (
  element: HTMLElement,
  options?: Html2Canvas.Html2CanvasOptionsBeta,
) => Html2CanvasPromise<HTMLCanvasElement>

interface Html2CanvasThenable<R> {
  then<U>(
    onFulfilled?: (value: R) => U | Html2CanvasThenable<U>,
    onRejected?: (error: any) => U | Html2CanvasThenable<U>,
  ): Html2CanvasThenable<U>
  // tslint:disable-next-line: unified-signatures
  then<U>(
    onFulfilled?: (value: R) => U | Html2CanvasThenable<U>,
    onRejected?: (error: any) => void,
  ): Html2CanvasThenable<U>
}

interface Html2CanvasPromise<R> extends Html2CanvasThenable<R> {
  then<U>(
    onFulfilled?: (value: R) => U | Html2CanvasThenable<U>,
    onRejected?: (error: any) => U | Html2CanvasThenable<U>,
  ): Html2CanvasPromise<U>
  then<U>(
    onFulfilled?: (value: R) => U | Html2CanvasThenable<U>,
    onRejected?: (error: any) => void,
  ): Html2CanvasPromise<U>
  catch<U>(
    onRejected?: (error: any) => U | Html2CanvasThenable<U>,
  ): Html2CanvasPromise<U>
}

declare var html2canvas: Html2CanvasStaticBeta

@UntilDestroy()
@Component({
  templateUrl: './cash-management-sweeping-detail.component.html',
  styleUrls: ['./cash-management-sweeping-detail.component.scss'],
  providers: [{ provide: 'Window', useValue: window }],
})
export class CashManagementSweepingDetailComponent
  extends AbstractAppComponent
  implements OnInit, OnDestroy
{
  structure: any = {}

  structureModified: boolean

  structureAction: string
  structureActionRequested: boolean
  structureActionConfirmed: boolean

  treeItems: any[] = []

  liquidityAccList: any[] = []

  sweepingChildAccountList: any[] = []

  public print = false

  constructor(
    public fb: FormBuilder,
    public service: CashManagementSweepingDetailService,
    public translate: TranslateService,
    public router: Router,
    public staticService: StaticService,
    @Inject('Window') private window: Window,
    @Inject(LOCALE_ID) private _locale: string,
    private injector: Injector,
  ) {
    super(translate)
  }

  ngOnInit() {
    super.ngOnInit()
    interval(1000).pipe(untilDestroyed(this)).subscribe()

    this.structure = this.service.getSelectedStructure()

    if (this.structure == null) {
      this.onFinish()
    } else {
      this.subscriptions.push(
        this.service.initStructure({}).subscribe((response) => {
          this.structureModified = false

          this.structureAction = null
          this.structureActionRequested = false
          this.structureActionConfirmed = false

          this.liquidityAccList = response.liquidityAccList
          this.sweepingChildAccountList = response.sweepingChildAccountList
        }),
      )

      this.subscriptions.push(
        this.service.getTreeItemsObserver().subscribe((treeItems) => {
          this.treeItems = treeItems
        }),
      )
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy()
  }

  onItemsUpdated(items) {
    this.structureModified = true
  }

  onAllFieldsCreated(event) {
    const form = event.form
    this.subscriptions.push(
      form.valueChanges.subscribe((values) => {
        if (
          form.controls['_child_id'] &&
          form.controls['currency'] &&
          form.controls['currency_name']
        ) {
          const value = form.controls['_child_id']
            ? form.controls['_child_id'].value
            : null
          this.liquidityAccList.forEach((account) => {
            const currency = this.service.getCurrencyText(account['currency'])
            if (
              account['liquidityAccountNumber'] === value &&
              form.controls['currency'].value !== currency
            ) {
              form.controls['currency'].setValue(currency)
              form.controls['currency_name'].setValue(currency)
            }
          })
        }
      }),
    )
  }

  onFinish() {
    this.router.navigate(['/cashManagement/sweeping/list'])
  }

  onRemoveStructure() {
    this.structureAction = 'REMOVE'
    this.structureActionRequested = true
  }

  onSaveStructure() {
    this.subscriptions.push(
      this.service
        .validateStructure({
          structureId: this.structure ? this.structure.structureId : null,
          nodeList: this.treeItems,
        })
        .subscribe((resultV) => {
          this.structureAction = 'SAVE'
          this.structureActionRequested = true
        }),
    )
  }

  onCancelAction() {
    this.structureAction = null
    this.structureActionRequested = false
  }

  onConfirmAction() {
    switch (this.structureAction) {
      case 'REMOVE':
        this.subscriptions.push(
          this.service
            .removeStructure({
              structureId: this.structure ? this.structure.structureId : null,
            })
            .subscribe((resultR) => {
              if (resultR instanceof Exception || resultR.errorCode !== '0') {
                this.onError(resultR)
                return
              } else {
                this.structureActionRequested = false
                this.structureActionConfirmed = true
              }
            }),
        )
        break
      case 'SAVE':
        this.subscriptions.push(
          this.service
            .saveStructure({
              structureId: this.structure ? this.structure.structureId : null,
              nodeList: this.treeItems,
            })
            .subscribe((resultS) => {
              if (resultS instanceof Exception || resultS.errorCode !== '0') {
                this.onError(resultS)
                return
              } else {
                this.structureActionRequested = false
                this.structureActionConfirmed = true
              }
            }),
        )
        break
      default:
        this.structureActionConfirmed = true
        break
    }
  }

  printFile(blob, name) {
    if (blob === null) {
    } else {
      const doc = blob
      const urlBlob = URL.createObjectURL(blob)
      const url = window.location.href
      const docURL =
        url.replace('#' + this.router.url, '') +
        'viewer/viewer.html?file=' +
        urlBlob
      const x = window.open(docURL)
      x.document.body.onload = function () {
        x.document.addEventListener('pagerendered', () =>
          setTimeout(function (e) {
            x.document.getElementById('print').click()
          }, 1000),
        )
      }
    }
  }

  printPdf(event) {
    const canvasToImageSuccess = function (canvas) {
      const pdf: any = new jsPDF('p', 'pt', 'a4')
      const pdfInternals: any = pdf.internal
      const pdfPageSize: any = pdfInternals.pageSize
      const pdfScaleFactor: number = pdfInternals.scaleFactor
      const pdfPageWidth: number = pdfPageSize.width
      const pdfPageHeight: number = pdfPageSize.height
      const totalPdfHeight = 0
      const htmlPageHeight: number =
        canvas.height / (pdfPageWidth * pdfScaleFactor)
      const htmlScaleFactor: number =
        canvas.width / (pdfPageWidth * pdfScaleFactor)

      const p: Promise<any> = new Promise(
        function (resolve, reject) {
          const newCanvas: HTMLCanvasElement = document.createElement('canvas')
          newCanvas.height = canvas.height
          newCanvas.width = canvas.width
          const ctx: CanvasRenderingContext2D = newCanvas.getContext('2d')
          ctx.fillStyle = 'rgb(255,255,255)'
          ctx.fillRect(0, 0, newCanvas.width, newCanvas.height)
          const img: HTMLImageElement = new Image()
          img.onload = function () {
            ctx.drawImage(img, 0, 0, img.width, img.height)
            pdf.addImage(
              newCanvas,
              'jpg',
              0,
              0,
              pdfPageWidth,
              img.height * (pdfPageWidth / img.width),
              null,
              'NONE',
            )
            ////console.log('imagen generada');
            //document.body.appendChild(newCanvas);
            resolve()
          }
          const dataURL: any = canvas.toDataURL('image/jpg')
          img.src = dataURL
        }.bind(this),
      )
      p.then(
        function () {
          //pdf.autoPrint();
          const file = pdf.output('blob')
          this.printFile(file, 'statics.pdf')
        }.bind(this),
      )
    }.bind(this)

    const css: any[] = []
    //for (let i = 0; i < document.styleSheets.length; i++) {
    //  const sheet: CSSStyleSheet = <CSSStyleSheet>document.styleSheets[i];
    //  const rules: CSSRuleList = sheet.cssRules;
    //  if (rules) {
    //    css.push('\n/* Stylesheet : ' + (sheet.href || '[inline styles]') + ' */');
    //    for (let j = 0; j < rules.length; j++) {
    //      const rule: CSSRule = <CSSRule>rules[j];
    //      css.push(rule.cssText.replace("../", window.location.href + "/../../"));
    //    }
    //  }
    //}
    const cssInline: string = css.join('\n') + '\n' + '.print {display:none}'
    const head: HTMLHeadElement =
      <HTMLHeadElement>document.head || document.getElementsByTagName('head')[0]
    const style: HTMLStyleElement = <HTMLStyleElement>(
      document.createElement('style')
    )

    style.type = 'text/css'
    style.appendChild(document.createTextNode(cssInline))

    //var doc = <HTMLDocument> document.cloneNode(true);
    //doc.head.appendChild(style);
    document.body.appendChild(style)
    const userHeight: number = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight,
    )
    html2canvas(document.body, {
      height: userHeight,
      width: document.defaultView.innerWidth,
      logging: true,
      async: false,
    }).then(function (canvas) {
      canvasToImageSuccess(canvas)
      document.body.removeChild(style)
    })
  }

  isPrint() {
    return this.print
  }
}
