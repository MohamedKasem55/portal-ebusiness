import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core'
import { Router } from '@angular/router'
import { StorageService } from '../../../../../core/storage/storage.service'
import { AccountsList } from '../../../Accounts/Services/accounts-list-data.service'
import { AliasManagementService } from '../../Services/alias-management.service'
import { FormControl } from '@angular/forms'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-alias-management-step2',
  templateUrl: './alias-management-step2.component.html',
  styleUrls: ['./alias-management.component.scss'],
})
export class AliasManagementSte2Component implements OnInit {
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Input() aliasDetails: any
  @Output() action = new EventEmitter<any>()
  @ViewChild('authorization') authorization: any

  mensajeError: any = {}

  constructor(
    private router: Router,
    private storageService: StorageService,
    private accountsListService: AccountsList,
    private aliasManagementService: AliasManagementService,
  ) {}

  ngOnInit() {
    this.requestValidate.otp = ''
  }

  isDisabled(): boolean {
    if (this.authorization) {
      return this.authorization.valid()
    } else {
      return false
    }
  }
  ngOnDestroy() {}

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  next() {
    if (this.requestValidate) this.action.emit(this.requestValidate)
  }
  cancel() {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/companyadmin/alias-management']))
  }
}
