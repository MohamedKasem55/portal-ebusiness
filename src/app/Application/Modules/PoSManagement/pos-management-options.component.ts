import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  templateUrl: './pos-management-options.component.html',
})
export class PoSManagementOptionsComponent implements OnInit {
  constructor(public router: Router) {}

  ngOnInit() {}

  goPoSManagementUserList() {
    this.router.navigate(['/companyadmin/pos/user-list'])
  }

  goPoSManagementTerminalAsign() {
    this.router.navigate(['/companyadmin/pos/terminal-asign'])
  }
}
