import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router, UrlSegment } from '@angular/router'
//import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { TranslateService } from '@ngx-translate/core'
import { Subject } from 'rxjs'
import { take, takeUntil } from 'rxjs/operators'
import {
  Mail,
  MailBuilder,
} from '../../../../Components/dashboard-layout/mail-model'
import { AppResponse } from '../../../../Model/app.response'
import { MailCCDTO, MailsService } from '../Services/mails.service'

@Component({
  templateUrl: '../View/mail.component.html',
})
export class MailComponent implements OnInit, OnDestroy {
  static prependText(original: string, prependText: string): string {
    const originalValues: string[] = original.split(/\r\n|\r|\n/g)
    const returnValue: string[] = []
    for (const value of originalValues) {
      returnValue.push(prependText + value)
    }
    return returnValue.join('\n')
  }
  // public Editor = ClassicEditor;
  ckConfigAr = {
    readOnly: false,
    language: 'ar',
    toolbarGroups: [
      { name: 'clipboard', groups: ['clipboard', 'undo'] },
      { name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
      { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
      { name: 'paragraph', groups: ['list', 'blocks', 'align', 'bidi'] },
      { name: 'styles', groups: ['heading'] },
    ],
    height: '800px',
  }

  ckConfigEn = {
    readOnly: false,
    language: 'en',
    toolbarGroups: [
      { name: 'clipboard', groups: ['clipboard', 'undo'] },
      { name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
      { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
      { name: 'paragraph', groups: ['list', 'blocks', 'align', 'bidi'] },
      { name: 'styles', groups: ['heading'] },
    ],
    height: '800px',
  }

  editor = null
  ViewType = ViewType
  ConfirmType = ConfirmType
  view: ViewType
  confirmType: ConfirmType
  mail: Mail

  ccList: MailCCDTO[] = []

  ccSelected: MailCCDTO = null
  mailFolder: any
  maxChars = 1000

  private onDestroy$: Subject<void> = new Subject<void>()

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mailsService: MailsService,
    public translate: TranslateService,
  ) {
    this.confirmType = ConfirmType.NO_CONFIRM
    this.mailFolder = this.mailsService.getMailFolder()
  }

  ngOnInit() {
    const urlSegments: UrlSegment[] = this.route.snapshot.url
    if (!urlSegments || urlSegments.length == 0) {
      this.backToList()
    }
    switch (urlSegments[0].path) {
      case ViewType.DETAIL:
        this.initDetailView()
        break
      case ViewType.COMPOSE:
        this.initComposeView()
        break
      case ViewType.REPLY:
        this.initReplyView()
        break
      default:
        this.backToList()
        break
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next()
    this.onDestroy$.complete()
  }

  initComposeView() {
    this.view = ViewType.COMPOSE
    this.enableCKEditor()
    this.mail = new MailBuilder()
      .withContent('')
      .withSubject('')
      .withTo('')
      .withToName('')
      .build()
    this.mailsService
      .listCCDTO()
      .pipe(take(1))
      .subscribe((ccList: MailCCDTO[]) => {
        this.ccList = ccList
      })
  }

  private updateCKEditorSatus(status: boolean) {
    this.ckConfigAr.readOnly = status
    this.ckConfigEn.readOnly = status
  }

  enableCKEditor() {
    this.updateCKEditorSatus(false)
  }
  disableCKEditor() {
    this.updateCKEditorSatus(true)
  }

  initDetailView() {
    this.view = ViewType.DETAIL
    this.disableCKEditor()

    this.mailsService
      .observeSelectedMail()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((mail: Mail) => {
        this.mail = mail
        //Mark the mail has read.
        if (this.mail && this.mail.status == 'N') {
          this.mailsService.markMailAsRead(this.mail).pipe(take(1)).subscribe()
        }
      })
  }

  initReplyView() {
    this.view = ViewType.REPLY
    this.enableCKEditor()
    const origin: Mail = this.mailsService.getSelectedMail()
    if (origin) {
      this.mail = new MailBuilder()
        .withToName(origin.fromName)
        .withTo(origin.from)
        .withSubject(MailComponent.prependText(origin.subject, 'Re: '))
        .withContent(MailComponent.prependText(origin.content, '> '))
        .build()
    } else {
      this.backToList()
    }
  }

  backToList() {
    this.router.navigate(['/myprofile/mails/'])
  }

  sendMail() {
    if (this.view == ViewType.COMPOSE) {
      this.mail.to = this.ccSelected.mailAddress
      this.mail.toName = this.ccSelected.userName
    }
    this.mailsService
      .sendMail(this.mail)
      .pipe(take(1))
      .subscribe((result: AppResponse) => {
        this.setConfirmation(ConfirmType.SEND)
        this.view = ViewType.DETAIL
        this.disableCKEditor()
        this.editor.setReadOnly(true)
      })
  }

  getMsgLength() {
    return this.mail.content.replace(/<[^>]*>|\s/g, '').replace(/&nbsp;/g, '')
      .length
  }

  setConfirmation(conf: ConfirmType) {
    this.confirmType = conf
  }

  getMails(): Mail[] {
    return Array.of(this.mail)
  }

  onCKeditorReady(ev) {
    this.editor = ev.editor
  }
}

export enum ViewType {
  DETAIL = 'detail',
  COMPOSE = 'compose',
  REPLY = 'reply',
}

export enum ConfirmType {
  NO_CONFIRM = 'no_confirm',
  SEND = 'send',
  DELETE = 'delete',
}
