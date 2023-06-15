import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup, ValidatorFn,
    Validators,
} from '@angular/forms'
import { companyEtradeFunctionList, eTradePrivilege } from 'app/Application/Model/eTradePrivilege/eTradePrivilege'
import { userEtrade } from 'app/Application/Model/eTradePrivilege/userEtrade'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../../../core/config/config.resource.local'
import { StorageService } from '../../../../../../../core/storage/storage.service'
import { DateFormatPipe } from '../../../../../../Components/common/Pipes/date-format-pipe'
import { Exception } from '../../../../../../Model/exception'
import { AbstractService } from '../../../../Services/Abstract/abstract.service'

@Injectable()
export class CompanyAdminUserManagementEditFormService extends AbstractService {
  public mobileNumberValidatorPattern = '(\\+9665|05|[+]*[0-9]{1,4})[0-9]{8,8}$'
  public mobileNumberTextPattern = '05xxxxxxxx,+9665xxxxxxxx or +xxxxxxxxx'
  public mobileNumberFormatPattern = '05xxxxxxxx/+9665xxxxxxxx/+xxxxxxxxx'

  public notEditableGroups = [
    {
      key: 'AlertsUserGroup',
      getValue: (data) => data['containsCUAlertsGroup'],
    },
  ]

  servicesUrl: string

  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
    protected fb: FormBuilder,
    protected injector: Injector,
    @Inject(LOCALE_ID) private _locale: string,
    private storage: StorageService,
  ) {
    super(http, config)
  }

  //-------------------------

  public createUserForm(
    data,
    forNew = false,
    userTypeRequired = false,
  ): FormGroup {
    const form = this.fb.group(
      {
        userImage: [null],
        userImageUrl: [null],

        userId: [null, [Validators.required, Validators.maxLength(30)]],
        userName: [null, [Validators.required, Validators.maxLength(30)]],
        userNameArabic: [
          null,
          [Validators.maxLength(30), this.getValidatorForArabicName],
        ],
        nickname: [null, [Validators.maxLength(50)]],

        empRef: [null, [Validators.required, Validators.maxLength(15)]],
        department: [null, [Validators.maxLength(20)]],
        type: [null, userTypeRequired ? [Validators.required] : []],
        userStatus: [null, []],

        idIqama: [
          null,
          [
            Validators.required,
            Validators.maxLength(10),
            this.getValidatorForSAID,
            Validators.pattern('^[0-9]*$'),
          ],
        ],
        expiryDate: [null, [Validators.maxLength(30)]],
        preferedLanguage: [null, [Validators.maxLength(30)]],

        city: [null, [Validators.required, Validators.maxLength(15)]],
        region: [null, [Validators.required, Validators.maxLength(15)]],

        birthDate: [null, []],
        nationality: [null, []],
        passport: [null, [Validators.maxLength(10)]],

        mobile: [
          null,
          [
            Validators.required,
            Validators.maxLength(15),
            Validators.pattern(this.mobileNumberValidatorPattern),
          ],
        ],
        secondMobile: [
          null,
          [
            Validators.maxLength(15),
            Validators.pattern(this.mobileNumberValidatorPattern),
          ],
        ],
        email: [
          null,
          [
            Validators.required,
            this.getValidatorForMailFormat,
            Validators.maxLength(40),
          ],
        ],
        secondEmail: [
          null,
          [this.getValidatorForMailFormat, Validators.maxLength(40)],
        ],

        socialTwitter: [null, [Validators.maxLength(30)]],
        socialLinkedin: [null, [Validators.maxLength(30)]],
        socialFacebook: ['', [Validators.maxLength(30)]],
        socialInstagram: [null, [Validators.maxLength(30)]],

        limit: [
          '0.00',
          [
            Validators.required,
            Validators.maxLength(9),
            Validators.pattern('^[0-9]*.?[0-9]*$'),
              this.companyDailyLimitValidator(this.storage.retrieve('company').companyLimits)
          ],
        ],
        billPaymentLimit: [
          '0.00',
          [
            Validators.required,
            Validators.maxLength(9),
            Validators.pattern('^[0-9]*.?[0-9]*$'),
          ],
        ],
        governmentPaymentLimit: [
          '0.00',
          [
            Validators.required,
            Validators.maxLength(9),
            Validators.pattern('^[0-9]*.?[0-9]*$'),
          ],
        ],
        ownacclimit: [
          '0.00',
          [
            Validators.required,
            Validators.maxLength(9),
            Validators.pattern('^[0-9]*.?[0-9]*$'),
          ],
        ],
        sadadInvoiceHubLimit: [
          '0.00',
          [
            Validators.required,
            Validators.maxLength(9),
            Validators.pattern('^[0-9]*.?[0-9]*$'),
          ],
        ],
        withinlimit: [
          '0.00',
          [
            Validators.required,
            Validators.maxLength(9),
            Validators.pattern('^[0-9]*.?[0-9]*$'),
          ],
        ],
        locallimit: [
          '0.00',
          [
            Validators.required,
            Validators.maxLength(9),
            Validators.pattern('^[0-9]*.?[0-9]*$'),
          ],
        ],
        qtlLimit: [
          '0.00',
          [
            Validators.required,
            Validators.maxLength(9),
            Validators.pattern('^[0-9]*.?[0-9]*$'),
          ],
        ],
        internationallimit: [
          '0.00',
          [
            Validators.required,
            Validators.maxLength(9),
            Validators.pattern('^[0-9]*.?[0-9]*$'),
          ],
        ],
        bulkLimit: [
          '0.00',
          [
            Validators.required,
            Validators.maxLength(9),
            Validators.pattern('^[0-9]*.?[0-9]*$'),
          ],
        ],

        accessLimited: ['false', [Validators.required]],
        userAuthenticationType: [null, [Validators.required]],
        tokenSerial: [null],
        tokenLanguage: [null],
        passwordDelivery: [null],
        oldMobile: [null],
        oldTokenSerial: [null],
        oldTokenStatus: [null],
        saturday: [false],
        sunday: [false],
        monday: [false],
        tuesday: [false],
        wednesday: [false],
        thursday: [false],
        friday: [false],
        accessHour: this.fb.group(
          {
            accessFrom: [null],
            accessTo: [null],
          },
          {
            validator: this.getValidatorForAcceptedTime(),
          },
        ),
        accountList: this.fb.array([]),
        backEndAccountPrivileges: this.fb.array([]),
        eTradePrivileges: this.fb.array([]),
        vaPermissions: [null],
        unlockTokenChallengeNumber: [
            null,
            [
               Validators.maxLength(7),
               Validators.pattern('^[0-9]{7}$')
            ]
        ],
      },
      {
        validator: this.getValidatorForRequiredOneDay(),
      },
    )

    this.setDataToForm(form, data, forNew)

    return form
  }

  protected setDataToForm(form: FormGroup, data, forNew = false) {
    const user = data.companyUserDetails

    if (!user) {
      return
    }

    if (user.qtlLimit) {
      form.controls['qtlLimit'].patchValue(user.qtlLimit)
    }

    if (data.userImage) {
      if (data.userImage.constructor.name.toLowerCase() == 'string') {
        form.controls['userImageUrl'].patchValue(data.userImage)
      } else if (data.userImage instanceof Object) {
        form.controls['userImageUrl'].patchValue(
          data.userImage.changingThisBreaksApplicationSecurity,
        )
      }
    }

    form.controls['userImage'].patchValue(form.controls['userImageUrl'].value)

    form.controls['userId'].patchValue(user.userId)
    form.controls['userName'].patchValue(user.userName)
    form.controls['userNameArabic'].patchValue(user.userNameArabic)
    form.controls['nickname'].patchValue(user.nickname)

    form.controls['empRef'].patchValue(user.empRef)
    form.controls['department'].patchValue(user.department)
    form.controls['type'].patchValue(user.type)
    form.controls['userStatus'].patchValue(user.userStatus)

    form.controls['idIqama'].patchValue(user.idIqama)

    form.controls['expiryDate'].patchValue(
      user.expiryDate
        ? new DateFormatPipe(this.injector, this._locale).transform(
            user.expiryDate,
            'dd/MM/yyyy',
          )
        : '',
    )
    form.controls['preferedLanguage'].patchValue(user.preferedLanguage)

    form.controls['city'].patchValue(user.city)
    form.controls['region'].patchValue(user.region)

    form.controls['birthDate'].patchValue(
      user.birthDate
        ? new DateFormatPipe(this.injector, this._locale).transform(
            user.birthDate,
            'dd/MM/yyyy',
          )
        : '',
    )

    form.controls['nationality'].patchValue(user.nationality)
    form.controls['passport'].patchValue(user.passport)

    form.controls['mobile'].setValue(user.mobile)
    form.controls['secondMobile'].patchValue(user.secondMobile)
    form.controls['email'].patchValue(user.email)
    form.controls['secondEmail'].patchValue(user.secondEmail)

    form.controls['socialFacebook'].patchValue(user.socialFacebook)
    form.controls['socialInstagram'].patchValue(user.socialInstagram)
    form.controls['socialLinkedin'].patchValue(user.socialLinkedin)
    form.controls['socialTwitter'].patchValue(user.socialTwitter)

    form.controls['limit'].patchValue(user.limit ? user.limit : 0)

    form.controls['billPaymentLimit'].patchValue(
      user.billPaymentLimit ? user.billPaymentLimit : 0,
    )
    form.controls['governmentPaymentLimit'].patchValue(
      user.governmentPaymentLimit ? user.governmentPaymentLimit : 0,
    )
    form.controls['ownacclimit'].patchValue(
      user.ownacclimit ? user.ownacclimit : 0,
    )
    form.controls['sadadInvoiceHubLimit'].patchValue(
      user.sadadInvoiceHubLimit ? user.sadadInvoiceHubLimit : 0,
    )

    form.controls['withinlimit'].patchValue(
      user.withinlimit ? user.withinlimit : 0,
    )
    form.controls['locallimit'].patchValue(
      user.locallimit ? user.locallimit : 0,
    )
    form.controls['internationallimit'].patchValue(
      user.internationallimit ? user.internationallimit : 0,
    )
    form.controls['bulkLimit'].patchValue(user.bulkLimit ? user.bulkLimit : 0)

    form.controls['accessLimited'].patchValue(
      user.accessLimited == null || user.accessLimited == false
        ? 'false'
        : 'true',
    )

    // form.controls["userAuthenticationType"].patchValue(user.authenticationMethod);
    form.controls['userAuthenticationType'].patchValue(
      this.normalizeAuthenticationType(
        user.authenticationMethod
          ? user.authenticationMethod.toUpperCase()
          : '',
      ),
    )

    //form.controls["type"].patchValue(user.type);

    if (Array.isArray(user.vaPermissions) && user.vaPermissions.length > 0) {
      form.controls['vaPermissions'].patchValue(
        user.vaPermissions[0].permissionId,
      )
    }
    //form.controls['userAuthenticationType'].patchValue("Static");

    form.controls['tokenSerial'].patchValue(user.tokenSerial)
    form.controls['tokenLanguage'].patchValue(user.tokenLanguage)
    form.controls['passwordDelivery'].patchValue(user.passDelivery)

    form.controls['oldMobile'].patchValue(
      user.mobile != '' ? user.mobile : null,
    ) //data.oldMobile
    form.controls['oldTokenSerial'].patchValue(
      user.tokenSerial != '' ? user.tokenSerial : null,
    ) //data.oldTokenSerial
    form.controls['oldTokenStatus'].patchValue(
      user.tokenStatus != '' ? user.tokenStatus : null,
    ) //data.oldTokenStatus

    this.setDaysOfWeeksToForm(form, user.daysOfWeek)
    ;(form.controls['accessHour'] as FormGroup).controls[
      'accessFrom'
    ].patchValue(user.accessFrom)
    ;(form.controls['accessHour'] as FormGroup).controls['accessTo'].patchValue(
      user.accessTo,
    )

    const accountList = data.accountList
      ? data.accountList
      : data.checkaccountlist
    this.setAccountListToForm(form, accountList)

    const backEndAccountPrivileges = data.backEndAccountPrivileges
    this.setBackEndAccountPrivilegesToForm(form, backEndAccountPrivileges)
    const companyEtradePrivilege = data.eTradePrivileges
    const usertEtradePrivileges = data.userEtradeFunctions
    this.setEtradeListToForm(form, companyEtradePrivilege, usertEtradePrivileges)

    this.createGroupsFormIfNotExists(form, data)
    const privileges = data.selectPrivilegeIndex
      ? data.selectPrivilegeIndex
      : data.privileges
    this.setGroupsPrivilegesToForm(form, privileges)
  }

  protected setDaysOfWeeksToForm(form: FormGroup, daysOfWeek) {
    if (!Array.isArray(daysOfWeek)) {
      return
    }
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < daysOfWeek.length; i++) {
      switch (daysOfWeek[i].dayValue) {
        case 7:
          form.controls['saturday'].patchValue(true)
          break
        case 1:
          form.controls['sunday'].patchValue(true)
          break
        case 2:
          form.controls['monday'].patchValue(true)
          break
        case 3:
          form.controls['tuesday'].patchValue(true)
          break
        case 4:
          form.controls['wednesday'].patchValue(true)
          break
        case 5:
          form.controls['thursday'].patchValue(true)
          break
        case 6:
          form.controls['friday'].patchValue(true)
          break
      }
    }
  }

  protected setAccountListToForm(form: FormGroup, accountList) {
    if (!Array.isArray(accountList)) {
      return
    }
    const accountControl = form.controls['accountList'] as FormArray
    accountList.forEach((account: any) => {
      accountControl.push(
        this.fb.group({
          inquiry: account.inquiry,
          l1: account.accountLevels[0],
          l2: account.accountLevels[1],
          l3: account.accountLevels[2],
          l4: account.accountLevels[3],
          l5: account.accountLevels[4],
          account: account.fullAccountNumber,
          accountLabel: this.getAccountLabel(account),
        }),
      )
    })
  }

  protected setEtradeListToForm(form: FormGroup, etradePrivilege: companyEtradeFunctionList[], userEtradePrivileges: userEtrade) {
    if (!Array.isArray(etradePrivilege)) {
      return
    }
    const eTradePrivileges = form.controls['eTradePrivileges'] as FormArray

    if (!Array.isArray(userEtradePrivileges)) {
      etradePrivilege.forEach((privilege: companyEtradeFunctionList) => {
        eTradePrivileges.push(
          this.fb.group({
            privilegePk: privilege.etradeFunction.etradeFunctionPk,
            functionId: privilege.etradeFunction.functionId,
            active: privilege.etradeFunction.active,
            initiator: false,
            l1: false,
            l2: false,
            l3: false,
            l4: false,
            l5: false,
            descriptionAr: privilege.etradeFunction.descriptionAr,
            descriptionEn: privilege.etradeFunction.descriptionEn,
          }),
        )
      })
    } else {
      etradePrivilege.forEach((privilege: companyEtradeFunctionList) => {
        let l1 = false
        let l2 = false
        let l3 = false
        let l4 = false
        let l5 = false
        let userPrivilege = new userEtrade()
        userPrivilege = userEtradePrivileges.find((user: userEtrade) => user.etradeFunction.etradeFunctionPk == privilege.etradeFunction.etradeFunctionPk)
        if (userPrivilege) {
          switch (userPrivilege.level) {
            case 1:
              l1 = true
              break;
            case 2:
              l1 = true
              l2 = true
              break;
            case 3:
              l1 = true
              l2 = true
              l3 = true
              break;
            case 4:
              l1 = true
              l2 = true
              l3 = true
              l4 = true
              break;
            case 5:
              l1 = true
              l2 = true
              l3 = true
              l4 = true
              l5 = true
              break;
          }
          eTradePrivileges.push(
            this.fb.group({
              privilegePk: privilege.etradeFunction.etradeFunctionPk,
              functionId: privilege.etradeFunction.functionId,
              active: userPrivilege.etradeFunction.active,
              initiator: userPrivilege.initiator,
              l1: l1,
              l2: l2,
              l3: l3,
              l4: l4,
              l5: l5,
              descriptionAr: privilege.etradeFunction.descriptionAr,
              descriptionEn: privilege.etradeFunction.descriptionEn,
            }),
          )
        } else {
          eTradePrivileges.push(
            this.fb.group({
              privilegePk: privilege.etradeFunction.etradeFunctionPk,
              active: privilege.etradeFunction.active,
              functionId: privilege.etradeFunction.functionId,
              initiator: false,
              l1: false,
              l2: false,
              l3: false,
              l4: false,
              l5: false,
              descriptionAr: privilege.etradeFunction.descriptionAr,
              descriptionEn: privilege.etradeFunction.descriptionEn,
            }),
          )
        }
      })
    }
  }

  getAccountLabel(account) {
    return (
      account.fullAccountNumber +
      (account.alias != '' ? ' - ' + account.alias : '')
    )
  }

  protected setBackEndAccountPrivilegesToForm(
    form: FormGroup,
    privileges: any,
  ) {
    if (!privileges) {
      return
    }
    if (form.controls['backEndAccountPrivileges'] == null) {
      form.addControl('backEndAccountPrivileges', this.fb.array([]))
    }

    const backEndAccountPrivileges = form.controls[
      'backEndAccountPrivileges'
    ] as FormArray

    const privilegesConfigKeys = Object.keys(privileges).filter((p) => {
      if (
        p.startsWith('privileges') &&
        typeof privileges[p] === 'object' &&
        privileges[p] !== null
      ) {
        const privilegeKey = p.replace('privileges', '')
        const allowedKey =
          privilegeKey.charAt(0).toLowerCase() +
          privilegeKey.substring(1) +
          'Privilege'
        return privileges[allowedKey] && privileges[allowedKey] == true
      }
      return false
    })
    //.map((p) => p.replace('privileges', ''))

    privilegesConfigKeys.forEach((pck) => {
      backEndAccountPrivileges.push(
        this.addPrivilegesListLineToForm(pck, privileges[pck]),
      )
    })
  }

  protected addPrivilegesListLineToForm(name: string, privileges: boolean[]) {
    return this.fb.group({
      privilege: name,
      label: name,
      l1: privileges[0],
      l2: privileges[1],
      l3: privileges[2],
      l4: privileges[3],
      l5: privileges[4],
    })
  }

  protected createGroupsFormIfNotExists(form: FormGroup, data: any) {
    if (!data) {
      return
    }

    data.realGroup = []

    const groupsKeys = Object.keys(data).filter(
      (k) =>
        k.startsWith('groupList') &&
        data[k] !== null &&
        typeof data[k] === 'object' &&
        Object.keys(data[k]).length > 0,
    )

    const allSubGroupsKeys = []

    // --------------------------------------------

    groupsKeys.forEach((gk) => {
      const groupData = data[gk]

      const subGroupsKeys = Object.keys(groupData).filter(
        (sgk) =>
          typeof groupData[sgk] === 'object' &&
          Object.keys(groupData[sgk]).length > 0,
      )
      subGroupsKeys.forEach((sgk) => {
        allSubGroupsKeys.push(sgk)
      })
    })

    // --------------------------------------------

    groupsKeys.forEach((gk) => {
      const groupData = data[gk]

      const subGroupsKeys = Object.keys(groupData).filter(
        (sgk) =>
          typeof groupData[sgk] === 'object' &&
          Object.keys(groupData[sgk]).length > 0,
      )

      if (subGroupsKeys.length > 0) {
        const groupDataControls = {
          key: gk,
          controls: [],
        }

        data.realGroup.push(groupDataControls)

        subGroupsKeys.forEach((sgk) => {
          if (form.controls[sgk] == null) {
            const ctr = this.fb.control(false)
            form.addControl(sgk, ctr)
            groupDataControls.controls.push({
              editable: true,
              group: sgk,
              control: ctr,
              description: sgk,
              groupPk: groupData[sgk].groupPk,
              groupId: groupData[sgk].groupId,
              groupData: groupData[sgk],
            })
          }
        })

        // add group from selectPrivilegeIndex to Others List Group
        if (gk === 'groupListOthers') {
          /*
                                        const selectPrivilegeIndex = data['selectPrivilegeIndex'] ? data['selectPrivilegeIndex'] : [];
                                        selectPrivilegeIndex.forEach((spi) => {
                                            const find = allSubGroupsKeys.find((item) => item === spi);
                                            if (find === null || find === undefined) {
                                                if (form.controls[spi] == null) {
                                                    const ctr = this.fb.control(true);
                                                    form.addControl(spi, ctr);
                                                    groupDataControls.controls.push({
                                                        editable: false,
                                                        group: spi,
                                                        control: ctr,
                                                        description: spi,
                                                        groupPk: null,
                                                        groupId: null,
                                                        groupData: null
                                                    });
                                                }
                                            }
                                        });
                                        */
          const notEditableGroups = this.getNotEditableGroups()
          notEditableGroups.forEach((neg) => {
            const find = allSubGroupsKeys.find((item) => item === neg.key)
            if (find === null || find === undefined) {
              if (form.controls[neg.key] == null) {
                const value = neg.getValue(data)
                const ctr = this.fb.control(value)
                form.addControl(neg.key, ctr)
                groupDataControls.controls.push({
                  editable: false,
                  group: neg.key,
                  control: ctr,
                  description: neg.key,
                  groupPk: null,
                  groupId: null,
                  groupData: null,
                })
              }
            }
          })
        }
      }
    })
  }

  protected setGroupsPrivilegesToForm(form: FormGroup, privileges) {
    if (!Array.isArray(privileges)) {
      return
    }
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < privileges.length; i++) {
      if (form.controls[privileges[i]]) {
        form.controls[privileges[i]].patchValue(true)
      }
    }
  }

  protected normalizeAuthenticationType(type) {
    if (type === 'STATIC') {
      return 'OTP'
    }
    if (type === 'SOFT' || type === 'CHALLENGE') {
      return 'CHALLENGE'
    }
    return type ? type.toUpperCase() : ''
  }

  protected getValidatorForSAID(control: FormControl): any {
    if (
      control === null ||
      control === undefined ||
      control.value === null ||
      control.value === undefined
    ) {
      return null
    }
    let id = control.value
    id = id ? id.trim() : ''
    if (Number(id) === null) {
      return { 'incorrecId-Iqama': true }
    }
    if (id.length !== 10) {
      return { 'incorrecId-Iqama': true }
    }
    const _type = id.substr(0, 1)
    if (_type !== '2' && _type !== '1') {
      return { 'incorrecId-Iqama': true }
    }
    let sum = 0
    for (let i = 0; i < 10; i++) {
      if (i % 2 === 0) {
        const ZFOdd = String('00' + String(Number(id.substr(i, 1)) * 2)).slice(
          -2,
        )
        sum += Number(ZFOdd.substr(0, 1)) + Number(ZFOdd.substr(1, 1))
      } else {
        sum += Number(id.substr(i, 1))
      }
    }
    // result equal 1 is Saudi ID
    // result equal 2 is Iqama ID
    const value = parseInt(sum % 10 !== 0 ? -1 : _type, 10)
    return value > 0 ? null : { 'incorrecId-Iqama': true }
  }

  protected getValidatorForMailFormat(control: FormControl): any {
    if (
      control === null ||
      control === undefined ||
      control.value === null ||
      control.value === undefined
    ) {
      return null
    }
    const EMAIL_REGEXP =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (
      control.value != '' &&
      (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))
    ) {
      return { incorrectMailFormat: true }
    }
    return null
  }

  protected getValidatorForAcceptedTime() {
    return (group: FormGroup) => {
      const time1 = group.controls['accessFrom'].value
      const time2 = group.controls['accessTo'].value
      if (group.parent) {
        const accessLimit = group.parent.controls['accessLimited']
        if (accessLimit.value === 'true') {
          if (time1 && time2 && time1 >= time2) {
            return group.controls['accessTo'].setErrors({
              notAcceptedTime: true,
            })
          } else if (time1 && time2) {
            return group.controls['accessTo'].setErrors(null)
          } else {
            return
          }
        }
      }
      return group.controls['accessTo'].setErrors(null)
    }
  }

  protected getValidatorForRequiredOneDay() {
    return (group: FormGroup) => {
      if (group.controls['accessLimited'].value === 'true') {
        const selectedDay =
          group.controls['saturday'].value ||
          group.controls['sunday'].value ||
          group.controls['monday'].value ||
          group.controls['tuesday'].value ||
          group.controls['wednesday'].value ||
          group.controls['thursday'].value ||
          group.controls['friday'].value
        if (!selectedDay) {
          return group.controls['friday'].setErrors({ selectOneDay: true })
        } else {
          group.controls['friday'].setErrors(null)
        }
      }
    }
  }

  protected getValidatorForArabicName(control: FormControl): any {
    if (
      control === null ||
      control === undefined ||
      control.value === null ||
      control.value === undefined
    ) {
      return null
    }
    let value: string = control.value
    if (value === null || value === undefined || value === '') {
      return null
    }
    if (value.length > 0) {
      value = value.replace(/\r?\n|\r/g, '')
    }
    const arabicAlphabetDigits =
      /[\u0600-\u06ff]|[\u0750-\u077f]|[\ufb50-\ufc3f]|[\ufe70-\ufefc]|[\u0200]|[\u00A0]/
    for (let i = 0; i < value.length; i++) {
      const char = value.charAt(i)
      // const keynum = value.charCodeAt(i);
      // if (char != " " && !(keynum <= 1791 && keynum >= 1536)) {
      const allowedCharater = [' ']
      if (!(allowedCharater.indexOf(char) !== -1)) {
        if (!arabicAlphabetDigits.test(char)) {
          return { onlyArabic: true }
        }
      }
    }
    return null
  }

  public isArabicChar(keynum) {
    return keynum <= 1791 && keynum >= 1536
  }

  public getVaPermissions(company: any = null): Observable<any> {
    if (company) {
      const params = { profileNumber: company.profileNumber }
      return this.http.post(
        this.servicesUrl + '/managementCompanyAdmin/vaPermissions',
        params,
      )
    } else {
      return this.http.get(this.servicesUrl + '/userManagement/vaPermissions')
    }
  }

  //-------------------------

  public setFormModelToData(data, formModel: FormGroup, userData, userPk) {
    data['companyUser'] = userData.companyUserDetails
    const user = data['companyUser']
    user.userPk = userPk
    user.qtlLimit = formModel.controls['qtlLimit']
      ? formModel.controls['qtlLimit'].value
      : null
    user.userImage =
      formModel.controls['userImage'].value != ''
        ? formModel.controls['userImage'].value
        : null

    user.userId =
      formModel.controls['userId'].value != ''
        ? formModel.controls['userId'].value
        : null
    user.userName =
      formModel.controls['userName'].value != ''
        ? formModel.controls['userName'].value
        : null
    user.userNameArabic =
      formModel.controls['userNameArabic'].value != ''
        ? formModel.controls['userNameArabic'].value
        : null
    user.nickname =
      formModel.controls['nickname'].value != ''
        ? formModel.controls['nickname'].value
        : null

    user.empRef =
      formModel.controls['empRef'].value != ''
        ? formModel.controls['empRef'].value
        : null
    user.department =
      formModel.controls['department'].value != ''
        ? formModel.controls['department'].value
        : null
    user.type =
      formModel.controls['type'].value != ''
        ? formModel.controls['type'].value
        : null
    //user.userStatus = this.formModel.controls['userStatus'].value;

    user.idIqama =
      formModel.controls['idIqama'].value != ''
        ? formModel.controls['idIqama'].value
        : null
    user.expiryDate = formModel.controls['expiryDate'].value
      ? new DateFormatPipe(this.injector, this._locale).transform(
          formModel.controls['expiryDate'].value,
          'yyyy-MM-dd',
        )
      : ''

    user.preferedLanguage =
      formModel.controls['preferedLanguage'].value != ''
        ? formModel.controls['preferedLanguage'].value
        : null

    user.city =
      formModel.controls['city'].value != ''
        ? formModel.controls['city'].value
        : null
    user.region =
      formModel.controls['region'].value != ''
        ? formModel.controls['region'].value
        : null

    user.birthDate = formModel.controls['birthDate'].value
      ? new DateFormatPipe(this.injector, this._locale).transform(
          formModel.controls['birthDate'].value,
          'yyyy-MM-dd',
        )
      : ''

    user.nationality =
      formModel.controls['nationality'].value != ''
        ? formModel.controls['nationality'].value
        : null
    user.passport =
      formModel.controls['passport'].value != ''
        ? formModel.controls['passport'].value
        : null

    user.mobile =
      formModel.controls['mobile'].value != ''
        ? formModel.controls['mobile'].value
        : null
    user.secondMobile =
      formModel.controls['secondMobile'].value != ''
        ? formModel.controls['secondMobile'].value
        : null
    user.email =
      formModel.controls['email'].value != ''
        ? formModel.controls['email'].value
        : null
    user.secondEmail =
      formModel.controls['secondEmail'].value != ''
        ? formModel.controls['secondEmail'].value
        : ''

    user.socialFacebook =
      formModel.controls['socialFacebook'].value != ''
        ? formModel.controls['socialFacebook'].value
        : null
    user.socialTwitter =
      formModel.controls['socialTwitter'].value != ''
        ? formModel.controls['socialTwitter'].value
        : null
    user.socialLinkedin =
      formModel.controls['socialLinkedin'].value != ''
        ? formModel.controls['socialLinkedin'].value
        : null
    user.socialInstagram =
      formModel.controls['socialInstagram'].value != ''
        ? formModel.controls['socialInstagram'].value
        : null

    user.limit =
      formModel.controls['limit'].value != ''
        ? formModel.controls['limit'].value
        : null

    user.billPaymentLimit =
      formModel.controls['billPaymentLimit'].value != ''
        ? formModel.controls['billPaymentLimit'].value
        : null
    user.governmentPaymentLimit =
      formModel.controls['governmentPaymentLimit'].value != ''
        ? formModel.controls['governmentPaymentLimit'].value
        : null
    user.ownacclimit =
      formModel.controls['ownacclimit'].value != ''
        ? formModel.controls['ownacclimit'].value
        : null
    user.sadadInvoiceHubLimit =
      formModel.controls['sadadInvoiceHubLimit'].value != ''
        ? formModel.controls['sadadInvoiceHubLimit'].value
        : null

    user.withinlimit =
      formModel.controls['withinlimit'].value != ''
        ? formModel.controls['withinlimit'].value
        : null
    user.locallimit =
      formModel.controls['locallimit'].value != ''
        ? formModel.controls['locallimit'].value
        : null
    user.internationallimit =
      formModel.controls['internationallimit'].value != ''
        ? formModel.controls['internationallimit'].value
        : null
    user.bulkLimit =
      formModel.controls['bulkLimit'].value != ''
        ? formModel.controls['bulkLimit'].value
        : null

    user.accessLimited =
      formModel.controls['accessLimited'].value != ''
        ? formModel.controls['accessLimited'].value
        : null

    user.daysOfWeek = this.getDaysOfWeeksOfForm(formModel)
    user.accessFrom = (formModel.controls['accessHour'] as FormGroup).controls[
      'accessFrom'
    ].value
    user.accessTo = (formModel.controls['accessHour'] as FormGroup).controls[
      'accessTo'
    ].value

    user['authenticationMethod'] =
      formModel.controls['userAuthenticationType'].value.toUpperCase()
    user.userAuthenticationType =
      formModel.controls['userAuthenticationType'].value.toUpperCase()
    if (user.authenticationMethod == 'OTP') {
      //user.password = formModel.controls['password'].value;
      //user.secondPwd = formModel.controls['authorizationPassword'].value;
      user.tokenSerial = null
      user.tokenLanguage = null
      user.passDelivery = null
    } else if (user.authenticationMethod == 'CHALLENGE') {
      user.password = null
      user.secondPwd = null
      user.tokenSerial = formModel.controls['tokenSerial'].value
      user.tokenLanguage = formModel.controls['tokenLanguage'].value
      user.passDelivery = formModel.controls['passwordDelivery'].value
    }

    if (
      formModel.controls['vaPermissions'] &&
      formModel.controls['vaPermissions'].value
    ) {
      user['vaPermissions'] = [
        {
          permissionId: formModel.controls['vaPermissions'].value,
          permissionPk:
            userData.companyUserDetails &&
            Array.isArray(userData.companyUserDetails.vaPermissions) &&
            userData.companyUserDetails.vaPermissions.length > 0
              ? userData.companyUserDetails.vaPermissions[0].permissionPk
              : null,
          active: 'Y',
        },
      ]
    } else {
      user['vaPermissions'] = []
    }

    //data['oldMobile'] = userData.oldMobile;
    //data['oldTokenSerial'] = userData.oldTokenSerial;

    data['listWebSCIC'] = [] // TODO

    data['selectedGroupList'] = this.getSelectedGroupsPrivilegesOfForm(
      formModel,
      userData,
    )

    data['containsCUAlertsGroup'] = userData.containsCUAlertsGroup

    const accountList = userData.checkaccountlist
      ? userData.checkaccountlist
      : userData.accountList
    this.getModifiedAccountListOfForm(accountList, formModel)
    data['listAccount'] = accountList

    data['backEndAccountPrivileges'] = userData.backEndAccountPrivileges
    const backEndAccountPrivilegesData = data['backEndAccountPrivileges']
    this.getBackEndAccountPrivilegesOfForm(
      backEndAccountPrivilegesData,
      formModel,
    )
    data['backEndAccountPrivileges'] = backEndAccountPrivilegesData

    data['userEtradeFunctions'] = userData.userEtradeFunctions
    let eTradePrivilege = data['userEtradeFunctions']
    eTradePrivilege = this.getEtradePrivilegesOfForm(eTradePrivilege, formModel)

    data['userEtradeFunctions'] = eTradePrivilege

    // TODO for pass validation of dates fields
    user.lastLoginDate = null
    user.lastLoginTime = null
    user.dateLimitReset = null
  }

  protected getDaysOfWeeksOfForm(form: FormGroup) {
    const daysOfWeek = []
    if (form.controls['accessLimited'].value == 'true') {
      if (form.controls['saturday'].value) {
        daysOfWeek.push({ dayValue: 7 })
      }
      if (form.controls['sunday'].value) {
        daysOfWeek.push({ dayValue: 1 })
      }
      if (form.controls['monday'].value) {
        daysOfWeek.push({ dayValue: 2 })
      }
      if (form.controls['tuesday'].value) {
        daysOfWeek.push({ dayValue: 3 })
      }
      if (form.controls['wednesday'].value) {
        daysOfWeek.push({ dayValue: 4 })
      }
      if (form.controls['thursday'].value) {
        daysOfWeek.push({ dayValue: 5 })
      }
      if (form.controls['friday'].value) {
        daysOfWeek.push({ dayValue: 6 })
      }
    }
    return daysOfWeek
  }

  protected getSelectedGroupsPrivilegesOfForm(form: FormGroup, userData): any {
    const privileges = []
    // tslint:disable-next-line:prefer-for-of
    for (let g = 0; g < userData.realGroup.length; g++) {
      const groupControls = userData.realGroup[g]
      for (let i = 0; groupControls.controls.length > i; i++) {
        if (groupControls.controls[i].control.value == true) {
          if (
            groupControls.controls[i].editable &&
            groupControls.controls[i].groupData
          ) {
            privileges.push(groupControls.controls[i].groupData)
          }
        }
      }
    }

    return privileges
  }

  protected getModifiedAccountListOfForm(data, form: FormGroup) {
    const accountControl = form.controls['accountList'] as FormArray
    accountControl.controls.forEach((group: FormGroup) => {
      //const value = group.controls['account'].value;
      this.getUpdatedAccountDataOfForm(data, group)
    })
  }

  protected getUpdatedAccountDataOfForm(data, group) {
    if (!Array.isArray(data)) {
      return
    }
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < data.length; i++) {
      if (data[i].fullAccountNumber == group.controls['account'].value) {
        data[i].inquiry = group.controls['inquiry'].value
        data[i].accountLevels[0] = group.controls['l1'].value
        data[i].accountLevels[1] = group.controls['l2'].value
        data[i].accountLevels[2] = group.controls['l3'].value
        data[i].accountLevels[3] = group.controls['l4'].value
        data[i].accountLevels[4] = group.controls['l5'].value
        break
      }
    }
  }

  protected getBackEndAccountPrivilegesOfForm(
    privileges: any,
    form: FormGroup,
  ) {
    const backEndAccountPrivilegesControls = form.controls[
      'backEndAccountPrivileges'
    ] as FormArray

    backEndAccountPrivilegesControls.controls.forEach((group: FormGroup) => {
      const privilegeKey = group.controls['privilege'].value

      const privilegesConfigData = privileges[privilegeKey]

      privilegesConfigData[0] = group.controls['l1'].value
      privilegesConfigData[1] = group.controls['l2'].value
      privilegesConfigData[2] = group.controls['l3'].value
      privilegesConfigData[3] = group.controls['l4'].value
      privilegesConfigData[4] = group.controls['l5'].value
    })
  }

  protected getEtradePrivilegesOfForm(
    privileges: any,
    form: FormGroup,
  ) {
    const eTradePrivilegesControls = form.controls[
      'eTradePrivileges'
    ] as FormArray

    let userPrivilege: userEtrade[] = []

    eTradePrivilegesControls.controls.forEach((group: FormGroup) => {
      if (group.controls['initiator'].value ||
        group.controls['l1'].value ||
        group.controls['l2'].value ||
        group.controls['l3'].value ||
        group.controls['l4'].value ||
        group.controls['l5'].value) {
        const level = (group.controls['l5'].value ? 5 :
          (group.controls['l4'].value ? 4 :
            (group.controls['l3'].value ? 3 :
              (group.controls['l2'].value ? 2 :
                (group.controls['l1'].value ? 1 : 0
                )
              )
            )
          )
        )
        userPrivilege.push(
          {
            userEtradeFunctionsPk: null,
            etradeFunction: {
              etradeFunctionPk: group.controls['privilegePk'].value,
              functionId: group.controls['functionId'].value,
              active: group.controls['active'].value,
              descriptionAr: group.controls['descriptionAr'].value,
              descriptionEn: group.controls['descriptionEn'].value,
              status: null,
              process: null,
            },
            level: level,
            initiator: group.controls['initiator'].value,
          }
        )
      }
    })
    return userPrivilege;
  }

  public getCompanyAuthenticationMethod(company: any = null) {
    if (company) {
      return company.authenticationMethod
    } else {
      const storageVal = this.storage.retrieve('currentuser')
      if (!storageVal) {
        return
      }
      const userTemp = JSON.parse(storageVal)
      return userTemp.company && userTemp.company.authenticationMethod
        ? userTemp.company.authenticationMethod
        : 'BOTH'
    }
    return null
  }

  public getNotEditableGroups() {
    return this.notEditableGroups
  }

  modifyUserToken(values: any) {
    return this.createModifyUserTokenRequest(values).pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  protected createModifyUserTokenRequest(values: any): Observable<any> {
    const data = {
      challegeNumber: values.challengeNumber,
      companyUserDSO: values.companyUserDSO,
      tokenModifyFlow: values.tokenModifyFlow,
    }

    return this.http.put(this.servicesUrl + '/userManagement/token', data).pipe(
      map((response: any) => {
        const body = response
        if (response.errorCode !== '0') {
          const errorService: Exception = new Exception(
            body.errorCode,
            body.errorDescription,
          )
          //console.log('Error en el servicio');
          return errorService
        } else {
          return body
        }
      }),
      catchError(this.handleError),
    )
  }

  public getCompanyEtradePrivilege(profileNumber: string) {
    return this.companyEtradePrivilegeRequest(profileNumber).pipe(
      map((response: eTradePrivilege) => response),
      catchError(this.handleError),
    )
  }

  protected companyEtradePrivilegeRequest(profileNumber: string) {
    const data = {
      profileNumber: profileNumber
    }

    return this.http.get(this.servicesUrl + '/eTrade/companyDetails').pipe(
      map((response: any) => {
        const body = response
        if (response.errorCode !== '0') {
          const errorService: Exception = new Exception(
            body.errorCode,
            body.errorDescription,
          )
          //console.log('Error en el servicio');
          return errorService
        } else {
          return body.companyDetails
        }
      }),
      catchError(this.handleError),
    )
  }

     companyDailyLimitValidator(companyLimit: number): ValidatorFn | null{
        return (control) => {
            return (control.value > companyLimit) ? {limitCICExceeded: true} : null
        }
    }
}
