import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sme-card',
  templateUrl: './sme-card.component.html',
  styleUrls: ['./sme-card.component.scss']
})
export class SmeCardComponent implements OnInit {
  constructor() { }
  @Input() headerIcon?:string = '';
  @Input() endTitle?:string = '';
  @Input() startTitle?:string ='';
  @Input() addRowClass?:boolean = false;
  @Input() headerFontSize?:string = "default"
  ngOnChanges(){
  }
  ngOnInit(): void {
  }

  onChangeTerms(){}
  openTermsAndConditions(){}
}
