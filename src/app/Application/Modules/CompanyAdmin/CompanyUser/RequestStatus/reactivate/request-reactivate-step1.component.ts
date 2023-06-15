import { Component, EventEmitter, Input, OnInit, Output, OnChanges, } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RequestReactivateService } from "./request-reactivate.service";

@Component({
  selector: 'app-request-reactivate-step1',
  templateUrl: './request-reactivate-step1.component.html',
  styleUrls: ['./request-reactivate.component.scss']
})
export class RequestReactivateStep1Component implements OnInit {
  @Input() formModel: any

  @Input() user: any = null

  @Input() userData: any = null

  @Input() combosData: any = {}

  @Input() messageError: any = {}

  
  @Output() onInit = new EventEmitter<Component>();
  public selectedAccountIndex: number;
  constructor(private fb: FormBuilder, public service: RequestReactivateService) {
  }

  ngOnInit() {
    this.onInit.emit(this as Component);
  }

  valid(): boolean {

    return this.formModel ? this.formModel.valid : null;

  }
}