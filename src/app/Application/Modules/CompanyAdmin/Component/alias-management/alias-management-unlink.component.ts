import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Router } from '@angular/router'
import { StorageService } from '../../../../../core/storage/storage.service'
import { AccountsList } from '../../../Accounts/Services/accounts-list-data.service'
import { AliasManagementService } from '../../Services/alias-management.service'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-alias-management-unlink',
  templateUrl: './alias-management-unlink.component.html',
  styleUrls: ['./alias-management.component.scss'],
})
export class AliasManagementUnlinkComponent implements OnInit {
  @Input() aliasDetails: any
  @Output() action = new EventEmitter<any>()

  selectedValue: number = 0
  otherReason: string = ''

  constructor(
    private router: Router,
    private storageService: StorageService,
    private accountsListService: AccountsList,
    private aliasManagementService: AliasManagementService,
  ) {}

  ngOnInit(): void {}

  selectReason(value) {
    this.selectedValue = value
  }

  unLink() {
    let reason = ''
    switch (this.selectedValue) {
      case 1:
        reason = 'Not satisfied with the Service'
        break
      case 2:
        reason = 'Privacy Concern'
        break
      case 3:
        reason = 'The Service is not User Friendly'
        break
      case 4:
        reason = this.otherReason
        break
    }
    this.action.emit(reason)
  }

  cancel() {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/companyadmin/alias-management']))
  }
}
