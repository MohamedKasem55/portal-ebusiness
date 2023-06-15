import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { FormBuilder } from '@angular/forms'
import { Component, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { merge } from 'rxjs'
import { AbstractDatatableMobileComponent } from 'app/Application/Modules/Common/Components/Abstract/abstract-datatable-mobile.component'
import { PagedData } from 'app/Application/Model/paged-data'
import { Router } from '@angular/router'
import { AuthenticationService } from 'app/core/security/authentication.service'
import { distinctUntilChanged } from 'rxjs/operators'
import { DynamicSimpleExtrasFormFieldsComponent } from '../../../../Common/Components/DynamicFormFields/dynamic-simple-extras-form-fields.component'
import { LockboxUsersBulkShiftingService } from './lockbox-users-bulk-shifting.service'

@Component({
  selector: 'app-lockbox-users-bulk-shifting',
  templateUrl: './lockbox-users-bulk-shifting.component.html',
  styleUrls: ['./lockbox-users-bulk-shifting.component.scss'],
})
export class LockboxUsersBulkShiftingComponent
  extends AbstractDatatableMobileComponent
  implements OnInit
{
  routes: any[] = [
    ['dashboard.lockbox'],
    ['lockbox.cdmUsers.menu', ['/lockbox/cdm-users/list']],
    ['lockbox.cdmUsers.bulkShifting.menu'],
  ]

  form: FormGroup
  wizardStep: number
  entityProperties: any
  translatePrefix = 'lockbox.cdmUsers'
  combosData: any
  terminalCombo: any
  elementsPage: PagedData<any>
  dynamicFormComponent: DynamicSimpleExtrasFormFieldsComponent

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public translate: TranslateService,
    public authService: AuthenticationService,
    public service: LockboxUsersBulkShiftingService,
  ) {
    super(fb, translate, authService, router)
    this.wizardStep = 1
    this.combosData = {}
    this.combosData['originTerminal'] = []
    this.combosData['destinationTerminal'] = []
  }

  ngOnInit(): void {
    this.form = this.fb.group({})
    this.entityProperties = this.buildEntityProperties()
  }

  isStepVisible(step: number) {
    return this.wizardStep === step
  }

  isBackAllowed() {
    return this.wizardStep == 1
  }

  isPreviousAllowed() {
    return this.wizardStep > 1 && this.wizardStep < 3
  }

  isNextAllowed() {
    return this.wizardStep < 3
  }

  isFinishAllowed() {
    return this.wizardStep == 3
  }

  next() {
    switch (this.wizardStep + 1) {
      case 2:
        this.service
          .getInitiatorValidate(
            this.tableSelectedRows,
            this.form.get('terminalOrigin').value,
            this.form.get('terminalDestination').value,
          )
          .subscribe((result) => {
            if (result.errorCode == '0') {
              this.elementsPage.page.totalElements =
                this.tableSelectedRows.length
              this.elementsPage.data = this.tableSelectedRows
              this.elementsPage.page.size = 1
              this.elementsPage.page.totalPages = 1
              this.form.disable()
              this.wizardStep += 1
            }
          })
        break
      case 3:
        this.service
          .getInitiatorConfirm(
            this.tableSelectedRows,
            this.form.get('terminalOrigin').value,
            this.form.get('terminalDestination').value,
          )
          .subscribe((result) => {
            if (result.errorCode == 0) {
              this.wizardStep += 1
            }
          })
        break
    }
  }

  previous() {
    this.wizardStep -= 1

    if (this.wizardStep < 2) {
      this.search()
      this.form.enable({ emitEvent: false })
    }
  }

  back() {
    this.router.navigate(['/lockbox/users/list'])
  }

  finish() {
    this.wizardStep = 1
    this.cleanSearch()
  }

  getList(
    searchElement: any,
    order: any,
    orderType: any,
    offset: any,
    pageSize: any,
  ) {
    const terminalOrigin = this.form.get('terminalOrigin').value
    if (!!terminalOrigin) {
      this.service.getChangeTerminal(terminalOrigin).subscribe((result) => {
        if (result.errorCode == 0 && !!result.usersList) {
          this.elementsPage.page.totalElements = result.usersList.length
          this.elementsPage.data = result.usersList
          this.elementsPage.page.size = result.usersList.length
          this.elementsPage.page.totalPages = 1
        } else {
          this.elementsPage.page.totalElements = 0
          this.elementsPage.data = []
          this.elementsPage.page.size = 0
          this.elementsPage.page.totalPages = 0
        }
      })
    } else {
      this.elementsPage.page.totalElements = 0
      this.elementsPage.data = []
      this.elementsPage.page.size = 0
      this.elementsPage.page.totalPages = 0
    }
  }

  getId(row: any) {
    return row['userId']
  }

  buildEntityProperties() {
    return [
      // {
      //   key: "cic",
      //   title: "cic",
      //   translate: "cic",
      //   type: "text",
      //   required: true,
      //   default: "",
      //   validators: [],
      //   widget: "",
      //   widget_container_class: "col-xs-12 col-sm-3",
      //   widget_container_init_row: false,
      //   widget_container_end_row: false,
      //   updatable: false,
      //   isFormField: true,
      //   isForValidate: true,
      //   isForConfirm: true,
      //   updateOn: 'blur'
      // },
      {
        key: 'terminalOrigin',
        title: 'Origin Terminal',
        translate: 'originTerminal',
        type: 'select',
        select_combo_key: 'originTerminal',
        required: true,
        default: '',
        disabled: false,
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-3',
        widget_container_init_row: true,
        widget_container_end_row: false,
        updatable: false,
        isFormField: true,
        isForValidate: true,
        isForConfirm: true,
      },
      {
        key: 'terminalDestination',
        title: 'Destination Terminal',
        translate: 'destinationTerminal',
        type: 'select',
        select_combo_key: 'destinationTerminal',
        required: true,
        default: '',
        disabled: false,
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-3',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: false,
        isFormField: true,
        isForValidate: true,
        isForConfirm: true,
      },
    ]
  }

  onInitForm($event) {
    this.dynamicFormComponent = $event
  }

  onAllFieldsCreated($event) {
    if ($event) {
      const formModel = $event.form
      this.onTerminalChange(formModel)
    }
    this.searchTerminals()
  }

  onTerminalChange(formModel) {
    const terminalOriginControl = formModel.get('terminalOrigin')
    const terminalDestinationControl = formModel.get('terminalDestination')
    terminalOriginControl.valueChanges.subscribe((origin) => {
      if (this.form.enable && origin != '' && origin != null) {
        this.combosData.destinationTerminal.splice(
          0,
          this.combosData.destinationTerminal.length,
        )
        const newList = this.terminalCombo.filter((e) => e.key !== origin)
        newList.forEach((e) => this.combosData.destinationTerminal.push(e))

        if (terminalOriginControl.value === terminalDestinationControl.value) {
          terminalDestinationControl.setValue('', { emitEvent: false })
        }
        this.search()
      }
    })
  }

  cleanSearch() {
    this.entityProperties = this.buildEntityProperties()
    this.form.get('terminalOrigin').setValue('')
    this.form.get('terminalDestination').setValue('')
    this.form.get('terminalOrigin').markAsUntouched()
    this.form.get('terminalDestination').markAsUntouched()
    this.form.get('terminalOrigin').markAsPristine()
    this.form.get('terminalDestination').markAsPristine()
    this.form.get('terminalOrigin').updateValueAndValidity()
    this.form.get('terminalDestination').updateValueAndValidity()
    this.combosData = {}
    this.combosData['originTerminal'] = []
    this.combosData['destinationTerminal'] = []
    this.elementsPage.data = []
    this.form.enable()
  }

  searchTerminals() {
    const terminalOriginControl = this.form.get('terminalOrigin')
    const terminalDestinationControl = this.form.get('terminalDestination')

    this.service.getTerminalList().subscribe((result) => {
      if (result.errorCode == 0) {
        this.terminalCombo = result.terminalsList.map((t) => ({
          key: t.terminalID,
          value: t.terminalIDName,
        }))

        terminalOriginControl.enable({ emitEvent: false })
        this.combosData['originTerminal'].splice(
          0,
          this.combosData['originTerminal'].length,
        )
        this.terminalCombo.forEach((e) =>
          this.combosData.originTerminal.push(e),
        )

        terminalDestinationControl.enable({ emitEvent: false })
        this.combosData['destinationTerminal'].splice(
          0,
          this.combosData['destinationTerminal'].length,
        )
        this.terminalCombo.forEach((e) =>
          this.combosData.destinationTerminal.push(e),
        )
      }
    })
  }
}
