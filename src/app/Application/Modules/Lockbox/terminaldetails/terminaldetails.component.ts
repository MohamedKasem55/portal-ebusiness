import { Component, OnInit } from '@angular/core'
import { CdmterminalService } from '../cdmterminal/cdmterminal.service'

@Component({
  selector: 'app-terminaldetails',
  templateUrl: './terminaldetails.component.html',
  styleUrls: ['./terminaldetails.component.scss'],
})
export class TerminaldetailsComponent implements OnInit {
  terminalDetailsData: any

  constructor(public cdmterminalservice: CdmterminalService) {}

  ngOnInit() {
    this.terminalDetailsData = this.cdmterminalservice.getTerminalDetails()
    //console.log(this.terminalDetailsData.terminalId);
  }
}
