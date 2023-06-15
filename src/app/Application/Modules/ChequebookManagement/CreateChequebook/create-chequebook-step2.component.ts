import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { CreateChequebookService } from './create-chequebook.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-step2',
  templateUrl: './create-chequebook-step2.component.html',
  styleUrls: ['./create-chequebook.component.scss'],
})
export class CreateChequebookStep2Component implements OnInit, OnDestroy {
  @Input() form: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Output() onInit = new EventEmitter<Component>()
  @ViewChild('authorization', { static: true }) authorization: any

  constructor(
    private fb: FormBuilder,
    public service: CreateChequebookService,
  ) {}

  ngOnInit() {
    this.onInit.emit(this as Component)
  }

  ngOnDestroy() {}
}
