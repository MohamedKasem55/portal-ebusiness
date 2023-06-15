import { Component } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DownloadTemplatesService } from './download-templates.service'
import {saveAs} from "file-saver";
@Component({
  templateUrl: './downloadTemplate.component.html',
  styleUrls: ['./downloadTemplate.component.scss'],
})
export class DownloadTemplateComponent {
  constructor(
    public translate: TranslateService,
    private downloadTemplatesService: DownloadTemplatesService,
  ) {}

  emitFile(file): void {
    this.downloadTemplatesService.getFile(file).subscribe((res) => {
      saveAs(res.file, res.fileName)
    })
  }
}
