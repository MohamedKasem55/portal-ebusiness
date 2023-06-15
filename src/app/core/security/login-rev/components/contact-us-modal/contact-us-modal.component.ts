import { HttpClient } from '@angular/common/http'
import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { ConfigResourceService } from '../../../../config/config.resource.local'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-contact-us-modal',
  templateUrl: './contact-us-modal.component.html',
  styleUrls: ['./contact-us-modal.component.scss'],
})
export class ContactUsModalComponent implements OnInit {
  @Output()
  public close: EventEmitter<boolean>

  public contactUsForm: FormGroup
  private url: string
  constructor(
    private _fb: FormBuilder,
    private _http: HttpClient,
    private _config: ConfigResourceService,
    private _modal: BsModalRef,
    public translate: TranslateService,
  ) {
    this.url = this._config.getServicesUrl()
  }

  ngOnInit() {
    console.log('Init del contact-us modal')
    this.contactUsForm = this._fb.group({
      contactName: ['', [Validators.required]],
      comments: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern('(\\+9665|05)[0-9]{8,8}$'),
        ],
      ],
    })
  }

  public sendForm() {
    this._http
      .post(this.url + '/contactUs', this.contactUsForm.getRawValue())
      .subscribe((res) => {
        this._modal.hide()
      })
  }

  public closeForm() {
    this._modal.hide()
  }

  public resetForm() {
    this.contactUsForm.reset()
  }

  public formValidator() {}

  public infoContainerClass(): string {
    return this.translate.currentLang === 'en'
      ? 'info-container info-container-en'
      : 'info-container info-container-ar'
  }
}
