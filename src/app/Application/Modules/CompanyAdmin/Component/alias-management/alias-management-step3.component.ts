import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Router } from '@angular/router'
import { StorageService } from '../../../../../core/storage/storage.service'
import { AccountsList } from '../../../Accounts/Services/accounts-list-data.service'
import { AliasManagementService } from '../../Services/alias-management.service'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-alias-management-step3',
  templateUrl: './alias-management-step3.component.html',
  styleUrls: ['./alias-management.component.scss'],
})
export class AliasManagementStep3Component implements OnInit {
  @Input() aliasDetails: any

  constructor(
    private router: Router,
    private storageService: StorageService,
    private accountsListService: AccountsList,
    private aliasManagementService: AliasManagementService,
  ) {}

  ngOnInit(): void {}

  home() {
    this.router.navigateByUrl('/')
  }

  add() {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/companyadmin/alias-management']))
  }
}
