import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {DocumentStatusDetailsService} from "./document-status-details.service";
import { saveAs } from 'file-saver'

@Component({
  selector: 'app-document-status-details',
  templateUrl: './document-status-details.component.html',
  styleUrls: ['./document-status-details.component.scss']
})
export class DocumentStatusDetailsComponent implements OnInit {

  statusDetails: any = {}

  constructor(
      public router: Router,
      public service: DocumentStatusDetailsService,
  ) {
    if(this.router.getCurrentNavigation().extras?.state?.statusDetails){
      this.statusDetails = this.router.getCurrentNavigation().extras.state.statusDetails
    }
  }

  ngOnInit(): void {
  }

  goToStatus(){
    this.router.navigateByUrl('/accounts/customerDocuments/viewDocumentsStatus')
  }

  downloadDocument(isView: boolean){

    if(this.statusDetails?.fileNetRef) {

      this.service.downloadDocument(this.statusDetails.fileNetRef, 'REQUEST_DOCUMENTS_ONLINE').subscribe(result => {
        if(result .errorCode == '0'){

          if (isView){
            this.viewFile(result)
          } else {
            this.saveFile(result)
          }
        }
      })
    }
  }

  getFile(data){
      const sliceSize = 512
      const byteCharacters = atob(data.fileContent)
      const byteArrays = []

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize)

        const byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }

      return  new Blob(byteArrays, { type: data.mime })
  }

  saveFile(data){
    const blob = this.getFile(data)

    saveAs(blob, data.fileName)
  }

  viewFile(data){
    const blob = this.getFile(data)
    const url= window.URL.createObjectURL(blob);

    window.open(url);
  }

  isDownloadDisabled(){
    return this.statusDetails.fileNetRef == null || this.statusDetails.fileNetRef == ''
  }
}
