import { DatePipe } from '@angular/common'
import {
  Component,
  Inject,
  Injector,
  Input,
  LOCALE_ID,
  OnInit,
} from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { saveAs } from 'file-saver'
import { SimpleMQ } from 'ng2-simple-mq'
import pdfMake from 'pdfmake/build/pdfmake'
import { Observable, of, Subject } from 'rxjs'
import { distinctUntilChanged, takeUntil } from 'rxjs/operators'
import * as XLSX from 'xlsx'
import { AmountCurrencyPipe } from '../../../../../../Components/common/Pipes/amount-currency.pipe'
import { DateFormatPipe } from '../../../../../../Components/common/Pipes/date-format-pipe'
import { HijraDateFormatPipe } from '../../../../../../Components/common/Pipes/hijra-date-format-pipe'
import { TranslateDatePipe } from '../../../../../../Components/common/Pipes/hijra-date-pipe'
import { ModelPipe } from '../../../../../../Components/common/Pipes/model-pipe'
import { StatusPipe } from '../../../../../../Components/common/Pipes/status-pipe'
import { AbstractAppComponent } from '../../../../../Common/Components/Abstract/abstract-app.component'
import { PayrollsService } from '../../payrolls.service'
import { PDFMakeConstants } from '../../../../../../../core/config/PDFMakeConstants'

@Component({
  selector: 'export-pa-payroll',
  templateUrl: './export-pa-payroll.html',
  providers: [{ provide: 'Window', useValue: window }],
})
export class ExportPAPayrollComponent
  extends AbstractAppComponent
  implements OnInit {
  arabicsubst = {
    1569: [65152],
    1570: [65153, 65154, 65153, 65154],
    1571: [65155, 65156, 65155, 65156],
    1572: [65157, 65158],
    1573: [65159, 65160, 65159, 65160],
    1574: [65161, 65162, 65163, 65164],
    1575: [65165, 65166, 65165, 65166],
    1576: [65167, 65168, 65169, 65170],
    1577: [65171, 65172],
    1578: [65173, 65174, 65175, 65176],
    1579: [65177, 65178, 65179, 65180],
    1580: [65181, 65182, 65183, 65184],
    1581: [65185, 65186, 65187, 65188],
    1582: [65189, 65190, 65191, 65192],
    1583: [65193, 65194, 65193, 65194],
    1584: [65195, 65196, 65195, 65196],
    1585: [65197, 65198, 65197, 65198],
    1586: [65199, 65200, 65199, 65200],
    1587: [65201, 65202, 65203, 65204],
    1588: [65205, 65206, 65207, 65208],
    1589: [65209, 65210, 65211, 65212],
    1590: [65213, 65214, 65215, 65216],
    1591: [65217, 65218, 65219, 65220],
    1592: [65221, 65222, 65223, 65224],
    1593: [65225, 65226, 65227, 65228],
    1594: [65229, 65230, 65231, 65232],
    1601: [65233, 65234, 65235, 65236],
    1602: [65237, 65238, 65239, 65240],
    1603: [65241, 65242, 65243, 65244],
    1604: [65245, 65246, 65247, 65248],
    1605: [65249, 65250, 65251, 65252],
    1606: [65253, 65254, 65255, 65256],
    1607: [65257, 65258, 65259, 65260],
    1608: [65261, 65262, 65261, 65262],
    1609: [65263, 65264, 64488, 64489],
    1610: [65265, 65266, 65267, 65268],
    1649: [64336, 64337],
    1655: [64477],
    1657: [64358, 64359, 64360, 64361],
    1658: [64350, 64351, 64352, 64353],
    1659: [64338, 64339, 64340, 64341],
    1662: [64342, 64343, 64344, 64345],
    1663: [64354, 64355, 64356, 64357],
    1664: [64346, 64347, 64348, 64349],
    1667: [64374, 64375, 64376, 64377],
    1668: [64370, 64371, 64372, 64373],
    1670: [64378, 64379, 64380, 64381],
    1671: [64382, 64383, 64384, 64385],
    1672: [64392, 64393],
    1676: [64388, 64389],
    1677: [64386, 64387],
    1678: [64390, 64391],
    1681: [64396, 64397],
    1688: [64394, 64395, 64394, 64395],
    1700: [64362, 64363, 64364, 64365],
    1702: [64366, 64367, 64368, 64369],
    1705: [64398, 64399, 64400, 64401],
    1709: [64467, 64468, 64469, 64470],
    1711: [64402, 64403, 64404, 64405],
    1713: [64410, 64411, 64412, 64413],
    1715: [64406, 64407, 64408, 64409],
    1722: [64414, 64415],
    1723: [64416, 64417, 64418, 64419],
    1726: [64426, 64427, 64428, 64429],
    1728: [64420, 64421],
    1729: [64422, 64423, 64424, 64425],
    1733: [64480, 64481],
    1734: [64473, 64474],
    1735: [64471, 64472],
    1736: [64475, 64476],
    1737: [64482, 64483],
    1739: [64478, 64479],
    1740: [64508, 64509, 64510, 64511],
    1744: [64484, 64485, 64486, 64487],
    1746: [64430, 64431],
    1747: [64432, 64433],
  }

  arabiclaasubst = {
    1570: [65269, 65270, 65269, 65270],
    1571: [65271, 65272, 65271, 65272],
    1573: [65273, 65274, 65273, 65274],
    1575: [65275, 65276, 65275, 65276],
  }
  arabicorigsubst = {
    1570: [65153, 65154, 65153, 65154],
    1571: [65155, 65156, 65155, 65156],
    1573: [65159, 65160, 65159, 65160],
    1575: [65165, 65166, 65165, 65166],
  }
  unicode_diacritics = {
    1612: 64606, // Shadda + Dammatan
    1613: 64607, // Shadda + Kasratan
    1614: 64608, // Shadda + Fatha
    1615: 64609, // Shadda + Damma
    1616: 64610, // Shadda + Kasra
  }
  alfletter = [1570, 1571, 1573, 1575]
  endedletter = [
    1569, 1570, 1571, 1572, 1573, 1575, 1577, 1583, 1584, 1585, 1586, 1608,
    1688,
  ]
  diacritics = [1612, 1613, 1614, 1615, 1616]
  base64logo =
    'data:image/png;base64,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'

  currentItem: any = null
  destroy$: Subject<boolean> = new Subject<boolean>()
  groupColumn: any
  result_model = {}
  @Input() header: string
  @Input() auxData: any = {}

  level_rows: any = []
  level_column: any = []
  employee_row: any = []
  employee_column: any = []

  constructor(
    public translate: TranslateService,
    public payrollService: PayrollsService,
    @Inject('Window') private window: Window,
    @Inject(LOCALE_ID) private _locale: string,
    public modelPipe: ModelPipe,
    private router: Router,
    private injector: Injector,
    public datePipe: DatePipe,
  ) {
    super(translate)
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.payrollService
        .getCurrentItemData()
        .pipe(distinctUntilChanged())
        .subscribe((result) => {
          this.currentItem = result
        }),
    )

    this.level_rows = this.currentItem['authorizationPage'].data
    this.level_column = [
      { title: this.translate.instant('payroll.level'), dataKey: 'level' },
      { title: this.translate.instant('public.status'), dataKey: 'status' },
      { title: this.translate.instant('public.userName'), dataKey: 'updater' },
      { title: this.translate.instant('public.date'), dataKey: 'updateDate' },
    ]

    this.employee_row = this.currentItem['employeeData'].data
    this.employee_column = [
      {
        title: this.translate.instant('payroll.employeeNumber'),
        dataKey: 'employeeReference',
      },
      {
        title: this.translate.instant('payroll.employeeName'),
        dataKey: 'name',
      },
      { title: this.translate.instant('public.bank'), dataKey: 'bankCode' },
      { title: this.translate.instant('public.account'), dataKey: 'account' },
      { title: this.translate.instant('payroll.salary'), dataKey: 'salary' },
    ]
  }

  getPdf() {
    const columns = []
    this.getRows(columns)
      .pipe(takeUntil(this.destroy$))
      .subscribe((rows) => {
        const doc = this.generatePdf2(columns, rows)
        if (this.header) {
          doc.download(this.header + '.pdf')
        } else {
          doc.download('report.pdf')
        }
      })
  }

  printPdf() {
    const columns = []

    this.getRows(columns)
      .pipe(takeUntil(this.destroy$))
      .subscribe((rows) => {
        const doc = this.generatePdf2(columns, rows).getBlob(
          (blob) => {
            const urlBlob = URL.createObjectURL(blob)
            const url = window.location.href
            const docURL =
              url.replace('#' + this.router.url, '') +
              'viewer/viewer.html?file=' +
              urlBlob
            //console.log(docURL);
            const x = window.open(docURL)
            //x.document.open();

            //const iframe = "<iframe id='pdf' type='application/pdf' width='100%' height='100%' frameborder='0' hspace='0' vspace='0' marginheight='0' marginwidth='0' scrolling='no' src='" + urlBlob + "' ></iframe>";
            //x.document.write(iframe);
            //x.document.body.style.margin= "0";
            //x.document.close();
          },
          { autoPrint: true },
        )
      })
  }

  getXlsx() {
    let columns = []
    // if (this.translate.currentLang == "ar") {
    //   columns = this.getColumns().reverse();
    // } else {
    //   columns = this.getColumns();
    // }
    this.getRows(columns)
      .pipe(takeUntil(this.destroy$))
      .subscribe((rows) => {
        let name = 'report'
        if (this.header) {
          name = this.header
        }
        const level_rows = this.prepareRows(this.level_column, this.level_rows)
        const employee_row = this.prepareRows(
          this.employee_column,
          this.employee_row,
        )

        const wb: XLSX.WorkBook = XLSX.utils.book_new()

        // const rows_data = [];
        // const column_level_data = [];
        // for (let i=0; i<this.level_column.length; i++){
        //     column_level_data.push(this.level_column[i].title);
        // }

        let tAlignment = 'left'
        if (this.isArabic(this.header)) {
          tAlignment = 'right'
        }

        const detail_rows = this.getTableDetail(tAlignment)
        const detail_rows_data = []
        for (let i = 0; i < detail_rows.length; i++) {
          const data = detail_rows[i]
          detail_rows_data.push({
            A: data[0].text,
            B: data[1].text,
            C: '',
            D: '',
            E: '',
            F: '',
          })
        }

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(detail_rows_data, {
          skipHeader: true,
        })
        // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(employee_row,{skipHeader: false});

        XLSX.utils.sheet_add_json(ws, level_rows, {
          skipHeader: false,
          origin: { r: 10, c: 0 },
        })
        XLSX.utils.sheet_add_json(ws, employee_row, {
          skipHeader: false,
          origin: { r: level_rows.length + 13, c: 0 },
        })

        this.changeHeaderTitle(ws, this.level_column, 11)
        this.changeHeaderTitle(ws, this.employee_column, level_rows.length + 14)

        XLSX.utils.book_append_sheet(wb, ws, name.substring(0, 30))
        const opts: XLSX.WritingOptions = { bookType: 'biff8', type: 'binary' }
        //const wbout = XLSXStyle.write(wb, opts);
        const wbout = XLSX.write(wb, opts)
        saveAs(
          new Blob([this.s2ab(wbout)], { type: 'application/vnd.ms-excel' }),
          name + '.xls',
        )
      })
  }

  private s2ab(s) {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xff
    }
    return buf
  }

  changeHeaderTitle(ws: any, columns: any, row_position) {
    let colLetter = 'A'
    for (const col of columns) {
      const position = colLetter + row_position + ''
      //console.log(position);
      ws[position].v = col['title']
      ws[position].s = {
        patternType: 'solid',
        border: '1px black dotted',
        fill: {
          fgColor: {
            rgb: 'FF1E46A0',
          },
        },
        font: {
          color: {
            rgb: 'FFFFFFFF',
          },
        },
      }
      colLetter = this.getNextLetter(colLetter)
    }
  }

  getNextLetter(char: string): string {
    let code: number = char.charCodeAt(0)
    code++
    return String.fromCharCode(code)
  }

  private getRows(columns): Observable<any> {
    return of([])
  }

  private generatePdf2(columns, rows) {
    pdfMake.vfs = {
      'Cairo.ttf': PDFMakeConstants.PDF_MAKE_VFS_EN,
    }
    pdfMake.fonts = {
      Cairo: {
        normal: 'Cairo.ttf',
        bold: 'Cairo.ttf',
      },
    }

    const date = new DateFormatPipe(this.injector, this._locale).transform(
      new Date(),
      PDFMakeConstants.PDF_MAKE_DATE_Formate,
    )


    const level_rows = this.prepareRows(this.level_column, this.level_rows)
    const employee_row = this.prepareRows(
      this.employee_column,
      this.employee_row,
    )


    let tAlignment = 'left'
    let tAlignmentR = 'right'
    let width = 'auto'

    let vheaders = [
      { text: this.header, margin: [100, 10, 10, 10], alignment: 'center' },
      { text: date, margin: [10, 10, 10, 10], alignment: tAlignmentR },
    ]
    let vbackground = {
      image: this.base64logo,
      width: '100',
      margin: [15, 10, 10, 10],
    }
    if (this.isArabic(this.header)) {
      tAlignment = 'right'
      tAlignmentR = 'left'
      width = '*'

      let lHeader = ''
      const rHeader = this.header.split(' ')
      for (let i = rHeader.length - 1; i >= 0; i--) {
        lHeader += rHeader[i] + ' '
      }

      vheaders = [
        { text: date, margin: [10, 10, 10, 10], alignment: tAlignmentR },
        { text: lHeader, margin: [100, 10, 10, 10], alignment: 'center' },
      ]
      vbackground = {
        image: this.base64logo,
        width: '100',
        margin: [730, 10, 10, 10],
      }
    }

    let pgCnt = 0
    const dd = {
      info: {
        title: this.header,
        author: 'eSME',
        subject: this.header,
        keywords: this.header,
      },
      pageOrientation: 'landscape',
      defaultStyle: {
        font: 'Cairo',
        align: 'right',
        fontSize: 10,
      },
      background: vbackground,
      header: {
        columns: vheaders,

        margin: [10, 10, 10, 10],
      },
      footer(pageCount) {
        pgCnt++
        return {
          columns: [
            { text: pgCnt, alignment: tAlignmentR, margin: [10, 10, 10, 10] },
          ],
        }
      },
      styles: {
        header: {
          fontSize: 14,
          bold: true,
        },
        bold: {
          fontSize: 10,
          bold: true,
        },
        bold2: {
          fontSize: 11,
          color: 'black',
          bold: true,
        },
      },
      content: [
        // {
        //     style: 'tableExample',
        //     table: {
        //         body: [
        //             ['Column 1', 'Column 2', 'Column 3'],
        //             ['One value goes here', 'Another one here', 'OK?']
        //         ]
        //     }
        // },
        {
          columns: [
            { width, text: '' },
            {
              width: 'auto',
              table: {
                headerRows: 1,
                body: this.getTableDetail(tAlignment),
              },
              layout: {
                defaultBorder: false,
                // fillColor(i, node) {
                //     return i % 2 === 0 ? [144, 153, 160] : null;
                // }
              },
            },
          ],
        },
        { text: '\n\n' },
        {
          columns: [
            { width, text: '' },
            {
              width: 'auto',
              table: {
                headerRows: 1,
                body: this.getTable(tAlignment, this.level_column, level_rows),
              },
              layout: {
                defaultBorder: false,
                fillColor(i, node) {
                  return i % 2 === 0 ? [144, 153, 160] : null
                },
              },
            },
          ],
        },
        { text: '\n\n' },
        {
          columns: [
            { width, text: '' },
            {
              width: 'auto',
              table: {
                headerRows: 1,
                body: this.getTable(
                  tAlignment,
                  this.employee_column,
                  employee_row,
                ),
              },
              layout: {
                defaultBorder: false,
                fillColor(i, node) {
                  return i % 2 === 0 ? [144, 153, 160] : null
                },
              },
            },
          ],
        },
      ],
    }

    return pdfMake.createPdf(dd)
  }

  isArabic(text): boolean {
    if (text == null) {
      return false
    }
    for (let i = 0; i < text.length; i += 1) {
      if (this.isArabicLetter(text[i])) {
        return true
      }
    }
    return false
  }

  isArabicLetter(letter): boolean {
    return (
      typeof letter === 'string' &&
      letter !== undefined &&
      this.arabicsubst[letter.charCodeAt(0)] !== undefined
    )
  }

  processArabic(text): string {
    text = text || ''
    text = text
    let result = ''
    let i = 0
    let currentLetter = ''
    let prevLetter = ''
    let nextLetter = ''
    if (!this.isArabic(text)) {
      return text
    }

    for (i = 0; i < text.length; i += 1) {
      currentLetter = text[i]
      prevLetter = text[i - 1]
      nextLetter = text[i + 1]
      let resultingLetter
      if (!this.isArabicLetter(currentLetter)) {
        result += currentLetter
      } else {
        if (
          prevLetter !== undefined &&
          prevLetter.charCodeAt(0) == 1604 &&
          this.arrayContainsElement(this.alfletter, currentLetter.charCodeAt(0))
        ) {
          const localPrevLetter = text[i - 2]
          const localCurrentLetter = currentLetter
          const localNextLetter = text[i + 1]
          const position1 = this.getCorrectForm(
            localCurrentLetter,
            localPrevLetter,
            localNextLetter,
            this.arabiclaasubst,
          )
          resultingLetter = String.fromCharCode(
            this.arabiclaasubst[currentLetter.charCodeAt(0)][position1],
          )
          result = result.substr(0, result.length - 1) + resultingLetter
        } else if (
          prevLetter !== undefined &&
          prevLetter.charCodeAt(0) == 1617 &&
          this.arrayContainsElement(
            this.diacritics,
            currentLetter.charCodeAt(0),
          )
        ) {
          const localPrevLetter = text[i - 2]
          const localCurrentLetter = currentLetter
          const localNextLetter = text[i + 1]
          const position2 = this.getCorrectForm(
            localCurrentLetter,
            localPrevLetter,
            localNextLetter,
            this.arabicorigsubst,
          )
          resultingLetter = String.fromCharCode(
            this.unicode_diacritics[currentLetter.charCodeAt(0)][position2],
          )
          result = result.substr(0, result.length - 1) + resultingLetter
        } else {
          const position3 = this.getCorrectForm(
            currentLetter,
            prevLetter,
            nextLetter,
            this.arabicorigsubst,
          )
          result += String.fromCharCode(
            this.arabicsubst[currentLetter.charCodeAt(0)][position3],
          )
        }
      }
    }
    return result
  }

  private arrayContainsElement(array, element): boolean {
    let iterator
    let result = false

    for (iterator = 0; iterator < array.length; iterator += 1) {
      if (array[iterator] === element) {
        result = true
      }
    }
    return result
  }

  getCorrectForm(currentChar, beforeChar, nextChar, arabicSubstition): number {
    const result = 0
    const isolatedForm = 0
    const finalForm = 1
    const initialForm = 2
    const middleForm = 3
    arabicSubstition = arabicSubstition || {}
    const _arabicSubst = Object.assign(this.arabicsubst, arabicSubstition)
    if (_arabicSubst[currentChar.charCodeAt(0)] === undefined) {
      return -1
    }

    //current arabic letter has only isolated form
    if (_arabicSubst[currentChar.charCodeAt(0)][finalForm] === undefined) {
      return isolatedForm
    }

    if (
      //current arabic letter has only final form
      _arabicSubst[currentChar.charCodeAt(0)][initialForm] === undefined ||
      ((nextChar === undefined ||
          _arabicSubst[nextChar.charCodeAt(0)] === undefined) &&
        beforeChar !== undefined &&
        _arabicSubst[beforeChar.charCodeAt(0)] !== undefined &&
        _arabicSubst[beforeChar.charCodeAt(0)][initialForm] !== undefined)
    ) {
      return finalForm
    }

    if (
      (beforeChar !== undefined && //beforeChar is given
        _arabicSubst[beforeChar.charCodeAt(0)] !== undefined && //beforeChar is arabic
        _arabicSubst[beforeChar.charCodeAt(0)][initialForm] === undefined) || //beforeChar has no initialForm
      beforeChar === undefined ||
      _arabicSubst[beforeChar.charCodeAt(0)] === undefined ||
      this.arrayContainsElement(this.endedletter, beforeChar.charCodeAt(0))
    ) {
      return initialForm
    }
    return middleForm
  }

  private getTable(talign, columns, rows) {
    const result = []
    let linea = []
    for (let i = 0; i < columns.length; i++) {
      let title = ''
      if (this.isArabic(columns[i]['title'])) {
        const rtitle = columns[i]['title'].split(' ')
        for (let l = rtitle.length - 1; l >= 0; l--) {
          title += rtitle[l] + ' '
        }
      } else {
        title = columns[i]['title']
      }
      linea.push({
        text: title,
        color: [256, 256, 256],
        fillColor: [30, 70, 160],
        alignment: talign,
      })
    }
    if (talign === 'right') {
      linea.reverse()
    }
    result.push(linea)
    //console.log(this.groupColumn);
    for (let j = 0; j < rows.length; j++) {
      linea = []
      //console.log(rows[j]);
      let nomore = false
      for (let k = 0; k < columns.length; k++) {
        //console.log(columns[k]);
        //console.log(rows[j][columns[k]["dataKey"]]);
        //186 192  217
        let row = ''
        // let value_transformed = ""
        // if(columns[k]["dataKey"] == 'status'){
        //     value_transformed = this.payrollService.retrieveValue(rows[j][columns[k]["dataKey"]]);
        // }
        // else{
        //     value_transformed = rows[j][columns[k]["dataKey"]];
        // }
        if (this.isArabic(rows[j][columns[k]['dataKey']])) {
          const rowR = rows[j][columns[k]['dataKey']].split(' ')
          for (let l = rowR.length - 1; l >= 0; l--) {
            row += rowR[l] + ' '
          }
        } else {
          row = rows[j][columns[k]['dataKey']]
        }

        if (this.groupColumn !== undefined) {
          if (columns[k]['dataKey'] === this.groupColumn) {
            if (rows[j][columns[k]['dataKey']] === '') {
              linea.push({ text: '', alignment: talign })
            } else {
              nomore = true
              linea.push({
                text: row,
                style: 'bold',
                colSpan: columns.length,
                alignment: talign,
              })
            }
          } else {
            if (!nomore) {
              linea.push({
                text: row,
                alignment: talign,
              })
            }
          }
        } else {
          linea.push({
            text: row,
            alignment: talign,
          })
        }
      }
      if (talign === 'right') {
        linea.reverse()
      }
      result.push(linea)
    }

    return result
  }

  getDetailTitle(title, talign) {
    let title_temp = ''
    if (this.isArabic(title_temp)) {
      const rtitle = title_temp.split(' ')
      for (let l = rtitle.length - 1; l >= 0; l--) {
        title_temp += rtitle[l] + ' '
      }
    } else {
      title_temp = title + ':'
    }

    const title_obj = {
      text: title_temp,
      //color: [256, 256, 256],
      // fillColor: [30, 70, 160],
      alignment: talign,
      style: 'bold2',
    }
    return title_obj
  }

  getDetailText(text, talign) {
    //console.log(text);
    let row = ''
    if (this.isArabic(text)) {
      const rowR = text.split(' ')
      for (let l = rowR.length - 1; l >= 0; l--) {
        row += rowR[l] + ' '
      }
    } else {
      row = text
    }
    return {
      text: row,
      alignment: talign,
    }
  }

  getLine(title, text, talign) {
    const linea = []
    linea.push(title)
    linea.push(text)
    if (talign === 'right') {
      linea.reverse()
    }
    return linea
  }

  private getTableDetail(talign) {
    const result = []

    if (this.currentItem['salaryPaymentItem'] != true) {
      const payrollUploadBatchDTO = this.currentItem['payrollUploadBatchDTO']
      result.push(
        this.getLine(
          this.getDetailTitle(
            this.translate.instant('payroll.fileReference'),
            talign,
          ),
          this.getDetailText(this.currentItem['customerReference'], talign),
          talign,
        ),
      )
      result.push(
        this.getLine(
          this.getDetailTitle(
            this.translate.instant('payroll.batchPayrollName'),
            talign,
          ),
          this.getDetailText(payrollUploadBatchDTO.batchName, talign),
          talign,
        ),
      )
      result.push(
        this.getLine(
          this.getDetailTitle(
            this.translate.instant('payroll.numberOfPayments'),
            talign,
          ),
          this.getDetailText(
            payrollUploadBatchDTO.payrollFileHeader.numberOfPayments,
            talign,
          ),
          talign,
        ),
      )
      result.push(
        this.getLine(
          this.getDetailTitle(
            this.translate.instant('payroll.totalAmount'),
            talign,
          ),
          this.getDetailText(
            payrollUploadBatchDTO.payrollFileHeader.totalAmount,
            talign,
          ),
          talign,
        ),
      )
      result.push(
        this.getLine(
          this.getDetailTitle(
            this.translate.instant('payroll.accountFrom'),
            talign,
          ),
          this.getDetailText(
            payrollUploadBatchDTO.payrollFileHeader.accountFrom,
            talign,
          ),
          talign,
        ),
      )
      const fileSendDate = new DateFormatPipe(
        this.injector,
        this._locale,
      ).transform(
        payrollUploadBatchDTO.payrollFileHeader.valueDate,
        'dd/MM/yyyy',
      )
      result.push(
        this.getLine(
          this.getDetailTitle(
            this.translate.instant('payroll.fileSendDate'),
            talign,
          ),
          this.getDetailText(fileSendDate, talign),
          talign,
        ),
      )
      const paymentDate = new DateFormatPipe(
        this.injector,
        this._locale,
      ).transform(payrollUploadBatchDTO.paymentDate, 'dd/MM/yyyy')
      result.push(
        this.getLine(
          this.getDetailTitle(
            this.translate.instant('payroll.paymentDate'),
            talign,
          ),
          this.getDetailText(paymentDate, talign),
          talign,
        ),
      )

      const status_str = this.payrollService.retrieveValue(
        this.currentItem['status'],
      )
      result.push(
        this.getLine(
          this.getDetailTitle(this.translate.instant('public.status'), talign),
          this.getDetailText(status_str, talign),
          talign,
        ),
      )
    } else {
      result.push(
        this.getLine(
          this.getDetailTitle(
            this.translate.instant('payroll.deduct-from-account'),
            talign,
          ),
          this.getDetailText(this.currentItem['accountFrom'], talign),
          talign,
        ),
      )
      result.push(
        this.getLine(
          this.getDetailTitle(
            this.translate.instant('payroll.customerCIC'),
            talign,
          ),
          this.getDetailText(this.currentItem['customerCIC'], talign),
          talign,
        ),
      )
      result.push(
        this.getLine(
          this.getDetailTitle(
            this.translate.instant('payroll.organizationName'),
            talign,
          ),
          this.getDetailText(this.currentItem['organizationName'], talign),
          talign,
        ),
      )
      const valuePaymentDate = new DateFormatPipe(
        this.injector,
        this._locale,
      ).transform(this.currentItem['paymentDate'], 'dd/MM/yyyy')
      result.push(
        this.getLine(
          this.getDetailTitle(
            this.translate.instant('payroll.paymentDate'),
            talign,
          ),
          this.getDetailText(valuePaymentDate, talign),
          talign,
        ),
      )
      result.push(
        this.getLine(
          this.getDetailTitle(
            this.translate.instant('payroll.batchPayrollName'),
            talign,
          ),
          this.getDetailText(this.currentItem['batchName'], talign),
          talign,
        ),
      )

      const valueInitiatonDate = new DateFormatPipe(
        this.injector,
        this._locale,
      ).transform(this.currentItem['initiationDate'], 'dd/MM/yyyy')
      result.push(
        this.getLine(
          this.getDetailTitle(
            this.translate.instant('payroll.management.initiatedDate'),
            talign,
          ),
          this.getDetailText(valueInitiatonDate, talign),
          talign,
        ),
      )
      const status_str = this.payrollService.retrieveValue(
        this.currentItem['status'],
      )
      result.push(
        this.getLine(
          this.getDetailTitle(this.translate.instant('public.status'), talign),
          this.getDetailText(status_str, talign),
          talign,
        ),
      )
    }
    return result
  }

  getStatusString(value) {
    if (value === 'I') {
      return this.translate.instant('status.initiate')
    } else if (value === 'P') {
      return this.translate.instant('status.pending')
    } else if (value === 'A') {
      return this.translate.instant('status.aprove')
    } else if (value === 'R') {
      return this.translate.instant('status.rejected')
    } else {
      return value
    }
  }

  private transformCellValue(row, key, value): string {
    if (value == null) {
      value = ''
    }
    if (key) {
      if (this.auxData[key]) {
        value = this.auxData[key][value]
      } else if (key === 'dateGroup') {
        if (value) {
          value = new DateFormatPipe(this.injector).transform(
            row['_groupColumn']['date'],
            'fullDate',
          )
          value +=
            ' - ' +
            new HijraDateFormatPipe(this.injector).transform(
              row['_groupColumn']['hijraDate'],
              'fullDate',
            )
        }
      } else if (key === 'lastPaymentDate' || key === 'nextPaymentDate') {
        if (value) {
          value = new DateFormatPipe(this.injector, this._locale).transform(
            value,
            'dd/MM/yyyy',
          )
        }
      } else if (
        key.indexOf('paymentDateG') !== -1 ||
        key.indexOf('paymentDateH') !== -1
      ) {
        if (value) {
          //console.log('key Date format',key);
          value = new DateFormatPipe(this.injector).transform(
            value,
            'dd/MM/yyyy',
          )
        }
      } else if (key.indexOf('paymentDate') !== -1) {
        if (value) {
          value = new DateFormatPipe(this.injector, this._locale).transform(
            value,
            'dd/MM/yyyy',
          )
        }
      } else if (key.indexOf('initiationDate') !== -1) {
        if (value) {
          value = new DateFormatPipe(this.injector).transform(
            value,
            'dd/MM/yyyy',
          )
        }
      } else if (key.indexOf('requestDate') !== -1) {
        if (value) {
          value = new DateFormatPipe(this.injector, this._locale).transform(
            value,
            'dd/MM/yyyy',
          )
        }
      } else if (key.indexOf('Date') !== -1) {
        if (value) {
          value = new DateFormatPipe(this.injector, this._locale).transform(
            value,
            'dd/MM/yyyy',
          )
        }
      } else if (key.indexOf('ijri') !== -1) {
        if (value) {
          value = new DateFormatPipe(this.injector, this._locale).transform(
            value,
            'short',
          )
        }
      } else if (key.indexOf('mount') !== -1) {
        value =
          value !== ''
            ? new AmountCurrencyPipe(this.injector, this._locale).transform(
              value,
              null,
            )
            : value
      } else if (key === 'averageNumber') {
        value =
          value !== ''
            ? new AmountCurrencyPipe(this.injector, this._locale).transform(
              value,
              null,
            )
            : value
      } else if (key.indexOf('alance') !== -1) {
        value =
          value !== ''
            ? new AmountCurrencyPipe(this.injector, this._locale).transform(
              value,
              null,
            )
            : value
      } else if (
        key === 'debit' ||
        key === 'credit' ||
        key === 'salary' ||
        key === 'salaryBasic' ||
        key === 'allowanceHousing' ||
        key === 'allowanceOther' ||
        key === 'deductions'
      ) {
        value =
          value !== ''
            ? new AmountCurrencyPipe(this.injector, this._locale).transform(
              value,
              null,
            )
            : value
      } else if (key === 'errorCode' || key === 'returnCode') {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'errors',
            <any>'errorTable.' + value,
          )
        }
      } else if (key === 'paymentPurpose') {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'payrollPaymentPurpose',
            value,
          )
        }
        if (value.indexOf('???.') !== -1) {
          value = new ModelPipe(this.injector).transform(
            'bulkFilePurpose',
            value.replace('???.', ''),
          )
        }
      } else if (key === 'currency') {
        if (value) {
          value = new ModelPipe(this.injector).transform('currencyIso', value)
        }
      } else if (key === 'currencyCode') {
        if (value) {
          value = new ModelPipe(this.injector).transform('currency', value)
        }
      } else if (key === 'channelType') {
        if (value) {
          value = new ModelPipe(this.injector).transform('channelType', value)
        }
      } else if (key === 'txCode') {
        if (value) {
          value = new ModelPipe(this.injector).transform('filterType', value)
        }
      } else if (
        key === 'bankCodePayroll' ||
        key === 'bankDirect' ||
        key === 'payerBankCode'
      ) {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'payrollBankCode',
            value,
          )
        }
        if (value.indexOf('???.') !== -1) {
          value = new ModelPipe(this.injector).transform(
            'bankCode',
            value.replace('???.', ''),
          )
        }
      } else if (key === 'bankCode') {
        if (value) {
          value = new ModelPipe(this.injector).transform('bankType', value)
        }
        if (value.indexOf('???.') !== -1) {
          value = new ModelPipe(this.injector).transform(
            'bankCode',
            value.replace('???.', ''),
          )
        }
        if (value.indexOf('???.') !== -1) {
          value = new ModelPipe(this.injector).transform(
            'payrollBankCode',
            value.replace('???.', ''),
          )
        }
      } else if (key === 'bankName') {
        //fix beneficiary list
        if (value) {
          value = value.replace(/\0/g, '')
        }
        if (value) {
          value = new ModelPipe(this.injector).transform('bankCode', value)
        }
        if (value) {
          value = value.replace('???.', '')
        }
      } else if (key.indexOf('country') !== -1) {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'backEndCountryCode',
            value,
          )
        }
        if (value.indexOf('???.') !== -1) {
          value = new ModelPipe(this.injector).transform(
            'countryName',
            value.replace('???.', ''),
          )
        }
      } else if (key === 'beneficiaryData.beneficiaryFullName') {
        value = row['beneficiaryData']['beneficiaryFullName']
      } else if (key === 'status') {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'batchSecurityLevelStatus',
            value,
          )
        } else if (value && row['cardHolderName']) {
          value = new ModelPipe(this.injector).transform(
            'positivePayStatus',
            value,
          )
        } else if (value.indexOf('???.') != -1) {
          value = new StatusPipe(this.injector).transform(
            value.replace('???.', ''),
          )
        } else {
          value = new StatusPipe(this.injector).transform(value)
        }
      } else if (key === 'statusIncentive') {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'incentiveCardsStatus',
            value,
          )
        }
      } else if (key === 'beneficiaryType') {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'beneficiaryType',
            value,
          )
        }
      } else if (key === 'operationCode' || key === 'operation') {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'payrollcardsOperations',
            value,
          )
        }
      } else if (key === 'operationLog') {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'activityOperationLog',
            value,
          )
        }
      } else if (key === 'region') {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'terminalRegion',
            value,
          )
        }
      } else if (key === 'serviceType') {
        value = new ModelPipe(this.injector).transform('eGovSadadType', value)
      } else if (key === 'category' || key === 'beneficiaryCategory') {
        if (value == 'I') {
          value = this.injector
            .get(TranslateService)
            .instant('beneficiaries.selectIndividual')
        } else if (value == 'C') {
          value = this.injector
            .get(TranslateService)
            .instant('beneficiaries.selectCompany')
        } else {
          value = value
        }
      } else if (key === 'fees') {
        //
        if (value.length) {
          let fees = ''
          for (let i = 0; value.length > i; i++) {
            fees =
              fees +
              (i == 0 ? '' : '\n ') +
              (value[i].feeAmount !== ''
                ? new AmountCurrencyPipe(this.injector, this._locale).transform(
                  value[i].feeAmount,
                  null,
                )
                : value[i].feeAmount)
          }
          value = fees
        } else {
          value = value
        }
      } else if (key === 'billProcess') {
        value = new ModelPipe(this.injector).transform('billProcess', value)
      } else if (key === 'billerName') {
        if (this.translate.currentLang == 'ar') {
          value = row['addDescriptionAr']
          if (value == undefined || value == null) {
            value = row['billerName']
          }
        } else {
          value = row['addDescriptionEn']
          if (value == undefined || value == null) {
            value = row['billerName']
          }
        }
      } else if (key === 'posRequestType') {
        value = new ModelPipe(this.injector).transform('posRequestType', value)
      } else if (key === 'posManagementRequestType') {
        value = new ModelPipe(this.injector).transform(
          'posManagementRequestType',
          value,
        )
      } else if (key === 'posMaintenanceRequestType') {
        value = new ModelPipe(this.injector).transform(
          'posMaintenanceRequestType',
          value,
        )
      } else if (key === 'posCRMStatusType') {
        value = new ModelPipe(this.injector).transform(
          'posCRMStatusType',
          value,
        )
      } else if (key === 'reasonCode') {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'payrollCardsReasonCodes',
            value,
          )
        }
      } else if (key === 'reasonCode') {
        if (
          value &&
          (value == 'over' || value == 'partial' || value == 'advanced')
        ) {
          value = new ModelPipe(this.injector).transform(
            'billPaymentType',
            value,
          )
        } else {
          const valueNew: any = 'payment'
          value = new ModelPipe(this.injector).transform(
            'billPaymentType',
            valueNew,
          )
        }
      } else if (key === 'rejectReasonText') {
        value = new ModelPipe(this.injector).transform(
          'claimFeedbackErrorCodes',
          value,
        )
      }
    }
    return value
  }

  private prepareRows(columns, result) {
    let lastGroup = ''
    //
    const rows: any = []
    const originalRows = result
    for (let i = 0; i < originalRows.length; i++) {
      const row = originalRows[i]
      //eliminar cabeceras de grupo por cambio de pagina
      if (this.groupColumn && row['_groupColumn']) {
        if (row[this.groupColumn] == lastGroup) {
          continue
        } else {
          lastGroup = row[this.groupColumn]
        }
      }
      const _row = {}
      const rowString = '{ '
      for (let j = 0; j < columns.length; j++) {
        const actualDataKey = columns[j].dataKey
        let actualValue = row[actualDataKey]
        if (actualDataKey === this.groupColumn && !row['_groupColumn']) {
          actualValue = ''
        } else if (actualValue == null) {
          actualValue = ''
        }
        _row[actualDataKey] = this.transformCellValue(
          row,
          actualDataKey,
          actualValue,
        )
      }

      rows.push(_row)
    }
    this.injector.get(SimpleMQ).publish('loader-mq', false)
    return rows
  }
}
