import { Component } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DownloadTemplatesService } from './download-templates.service'
import {saveAs} from "file-saver";
@Component({
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss'],
})
export class ModuleComponent {
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
