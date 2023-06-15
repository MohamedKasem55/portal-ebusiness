import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-add-claim-step1',
  templateUrl: './add-claim-step1.component.html',
  styleUrls: ['./add-claim.component.scss'],
})
export class AddClaimStep1Component implements OnInit, OnDestroy {
  @Input() form: FormGroup
  @Input() file: any

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {}

  removeElement(index) {
    const control = <FormArray>this.form.controls['elements']
    const indexFile = (<FormGroup>control.get(index)).controls['fileIndex']
      .value
    this.file['file'][indexFile] = null
    control.removeAt(index)
    if (control.length == 0) {
      this.router.navigate(['/posstatement/claims'])
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
    //console.log(res.error);
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  fileChange(event, i) {
    const fileList: FileList = event.target.files
    if (fileList.length > 0) {
      this.file['file'][
        (<FormGroup>(
          (<FormArray>this.form.controls['elements']).controls[i]
        )).controls['fileIndex'].value
      ] = fileList[0]
      ;(<FormGroup>(
        (<FormArray>this.form.controls['elements']).controls[i]
      )).controls['fileName'].patchValue(fileList[0].name)
    }
  }
}
