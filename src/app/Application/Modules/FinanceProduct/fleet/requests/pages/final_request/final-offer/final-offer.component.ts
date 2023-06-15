import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Breadcrumb } from 'app/Application/Modules/FinanceProduct/shared/models/common';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { OfferRejectComponent } from '../../../components/offer-reject/offer-reject.component';

@Component({
  selector: 'arb-final-offer',
  templateUrl: './final-offer.component.html',
  styleUrls: ['./final-offer.component.scss']
})
export class FinalOfferComponent implements OnInit {
  breadCrumb: Breadcrumb[] = [] ;
  modalRef: BsModalRef;

  @ViewChild('errorModal', { static: true }) errorModal: ModalDirective

  constructor(private translate: TranslateService,
              private modalService: BsModalService,
    ) { }

  ngOnInit(): void {
    this.translate.get('fleet').subscribe((data:any)=>{
      this.breadCrumb = [
        { txt: data.newRequest.Finance, active: false },
        { txt: data.newRequest.NoteligibleTitle, active: true },
      ]
    })
  }
  openModal() {
    this.modalService.show(OfferRejectComponent);
 }

}
