import { Component } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { ModuleService } from './module-service'
import {saveAs} from "file-saver";

@Component({
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss'],
})
export class ModuleComponent {
  constructor(
    public translate: TranslateService,
    public moduleService: ModuleService,
  ) {}

  emitSalaryFile(): void {
    this.moduleService.getFileSalary().subscribe((res) => {
      saveAs(res.file, res.fileName)
    })
  }

  emitEmployeeFile(): void {
    this.moduleService.getFileEmployee().subscribe((res) => {
      saveAs(res.file, res.fileName)
    })
  }
}
