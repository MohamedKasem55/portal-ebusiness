import {
    Component,
    EventEmitter,
    Inject,
    Injector,
    Input,
    LOCALE_ID,
    OnChanges,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup, NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { StaticService } from '../../Services/static.service'
import { AbstractAppComponent } from '../Abstract/abstract-app.component'
import { DomSanitizer } from '@angular/platform-browser'
import { DateFormatPipe } from '../../../../Components/common/Pipes/date-format-pipe'
import { NgbDateCustomParserFormatter } from 'app/core/alt-calendar/date-custom-parse-formatter'
import {
    NgbCalendar,
    NgbCalendarIslamicCivil,
    NgbDatepickerI18n,
    NgbDateParserFormatter
} from '@ng-bootstrap/ng-bootstrap'
import { NgbdDatepickerCalendars } from 'app/core/alt-calendar/datepicker-calendars'
import { IslamicCivilI18n } from 'app/core/alt-calendar/IslamicCivilianI18n'

@Component({
    selector: 'app-dynamic-simple-extras-form-fields',
    templateUrl: './dynamic-simple-extras-form-fields.component.html',
    styleUrls: ['./dynamic-simple-extras-form-fields.component.scss'],
    providers: [
        { provide: NgbCalendar, useClass: NgbCalendarIslamicCivil },
        { provide: NgbDatepickerI18n, useClass: IslamicCivilI18n },
        { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: NgbdDatepickerCalendars,
            multi: true,
        },
    ],
})
export class DynamicSimpleExtrasFormFieldsComponent
    extends AbstractAppComponent
    implements OnInit, OnChanges, OnDestroy {
    @Input() fieldsConfigs: any[]

    @Input() combosData: any[]

    @Input() formModel: FormGroup

    @Input() translate_prefix: string

    @Input() custom_fields_templates: any = {}

    @Output() onFieldCreated: EventEmitter<any> = new EventEmitter<any>()

    @Output() onFieldRemoved: EventEmitter<any> = new EventEmitter<any>()

    @Output() onAllFieldsCreated: EventEmitter<any> = new EventEmitter<any>()

    @Output() onInit = new EventEmitter<Component>()

    _internalFieldsConfigs: any[] = []

    _fieldsVisibleStatus: any[] = []

    _fieldsDisabledDefaultStatus: any[] = []

    _internalSelectCombosDataByField: any = {}

    _internalSelectCombosSelfAdded: any[] = []

    _internalRowsForPrint: any[] = []
    @ViewChild('exportPrinterUtility') exportPrinterUtility: any

    public bsConfigEN = {
        showWeekNumbers: false,
        containerClass: 'theme-dark-blue',
        isAnimated: true,
        locale: 'en',
        dateInputFormat: 'DD/MM/YYYY'
    }

    public bsConfigAR = {
        showWeekNumbers: false,
        containerClass: 'theme-dark-blue',
        isAnimated: true,
        locale: 'ar',
        dateInputFormat: 'DD/MM/YYYY'
    }

    public ckConfigAr = {
        readOnly: false,
        language: 'ar',
        toolbarGroups: [
            { name: 'clipboard', groups: ['clipboard', 'undo'] },
            { name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
            { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
            { name: 'paragraph', groups: ['list', 'blocks', 'align', 'bidi'] },
            { name: 'styles', groups: ['heading'] }
        ],
        height: '400px',
        wordcount: {
            showParagraphs: false,
            showWordCount: false,
            showCharCount: true,
            maxCharCount: 1000,
        }
    }

    public ckConfigEn = {
        readOnly: false,
        language: 'en',
        toolbarGroups: [
            { name: 'clipboard', groups: ['clipboard', 'undo'] },
            { name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
            { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
            { name: 'paragraph', groups: ['list', 'blocks', 'align', 'bidi'] },
            { name: 'styles', groups: ['heading'] }
        ],
        height: '400px',
        wordcount: {
            showParagraphs: false,
            showWordCount: false,
            showCharCount: true,
            maxCharCount: 1000,
        }
    }

    hijriDate: NgbDateCustomParserFormatter

    defaultValidatorsByField: any = {};

    constructor(
        public fb: FormBuilder,
        public staticService: StaticService,
        public translate: TranslateService,
        protected injector: Injector,
        @Inject(LOCALE_ID) private _locale: string,
        public sanitizer: DomSanitizer,
        public calendar: NgbCalendar,
        @Optional() @Inject(NG_VALIDATORS) private validators: any[],
        @Optional() @Inject(NG_ASYNC_VALIDATORS) private asyncValidators: any[],
    ) {
        super(translate)
        this.hijriDate = new NgbDateCustomParserFormatter()
    }

    ngOnInit() {
        super.ngOnInit()
        this.onInit.emit(this as Component)
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes)
    }

    refreshData() {
        super.refreshData()
        this.initExtraFormFields(this.fieldsConfigs)
    }

    initExtraFormFields(fieldsConfigs: any[] = []): FormGroup {
        const oldData = this.formModel.getRawValue()
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this._internalFieldsConfigs.length; i++) {
            const field = this._internalFieldsConfigs[i]
            this.formModel.removeControl(field['key'])
            this.onFieldRemoved.emit({ field })
        }

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this._internalSelectCombosSelfAdded.length; i++) {
            const comboKey = this._internalSelectCombosSelfAdded[i]
            this.combosData[comboKey] = null
        }

        // adicionando los nuevos controles a partir de las definiciones

        // tslint:disable-next-line:prefer-for-of
        this.defaultValidatorsByField = {};

        for (let i = 0; i < fieldsConfigs.length; i++) {
            const field = fieldsConfigs[i]

            const defaultValidators: any[] = [...(field['validators'] ? field['validators'] : [])]

            if (field['required']) {
                defaultValidators.push(Validators.required)
            }

            let initialValue =
                field['default'] !== '' &&
                    field['default'] !== null &&
                    field['default'] !== undefined
                    ? field['default']
                    : (field['type'] === 'date' ? null : '')
            if (
                initialValue &&
                initialValue.constructor.name.toLowerCase() == 'string'
            ) {
                initialValue = this.getUnescapedStr(initialValue)
            }

            if (initialValue && field['type'] == 'date' && field['widget']) {
                if (
                    field['widget'] == 'datepicker' ||
                    field['widget'] == 'datepicker-gr'
                ) {
                    initialValue = new Date(
                        new DateFormatPipe(this.injector, this._locale).transform(
                            initialValue,
                            'yyyy-MM-dd',
                        ),
                    )
                } else if (
                    field['widget'] == 'datepicker-ar' &&
                    initialValue.constructor.name.toLowerCase() == 'string'
                ) {
                    let splittedValue = null
                    if (initialValue.indexOf('/')) {
                        splittedValue = initialValue.split('/').reverse()
                    } else if (initialValue.indexOf('-')) {
                        splittedValue = initialValue.split('-')
                    }
                    if (splittedValue && splittedValue.length == 3) {
                        initialValue = {
                            year: Number.parseInt(splittedValue[0], 10),
                            month: Number.parseInt(splittedValue[1], 10),
                            day: Number.parseInt(splittedValue[2], 10),
                        }
                    }
                }
            }

            this.defaultValidatorsByField[field['key']] = defaultValidators;

            this.formModel.addControl(
                field['key'],
                this.fb.control(initialValue, {
                    validators: defaultValidators,
                    updateOn: field['updateOn'] ? field['updateOn'] : 'change',
                }),
            )
            this.formModel.get(field['key'])['__KEY__'] = field['key']
            this.formModel.get(field['key'])['__EXTRAS__'] = field['extras']
                ? field['extras']
                : {}

            if (field['disabled'] && field['disabled'] === true) {
                this.formModel.get(field['key']).disable()
                this._fieldsDisabledDefaultStatus[field['key']] = true
            } else {
                this._fieldsDisabledDefaultStatus[field['key']] = false
            }
        }

        this.formModel.patchValue(oldData)

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < fieldsConfigs.length; i++) {
            const field = fieldsConfigs[i]

            if (field['type'] == 'custom-code') {
                continue
            }

            this._fieldsVisibleStatus[field['key']] =
                typeof this._fieldsVisibleStatus[field['key']] !== 'undefined'
                    ? this._fieldsVisibleStatus[field['key']]
                    : true

            if (field['mask_fields_to_show']) {
                this.formModel.get(field['key']).valueChanges.subscribe((value) => {
                    this.initShowFieldsByMaskField(field, value)
                })

                this.initShowFieldsByMaskField(
                    field,
                    this.formModel.get(field['key']).value,
                )
            }

            if (field['mask_fields_to_hide']) {
                this.formModel.get(field['key']).valueChanges.subscribe((value) => {
                    this.initHideFieldsByMaskField(field, value)
                })

                this.initHideFieldsByMaskField(
                    field,
                    this.formModel.get(field['key']).value,
                )
            }
        }

        this._internalFieldsConfigs = fieldsConfigs

        this.checkValidatorsLimitsMinAndMaxBetweenFields(true);

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < fieldsConfigs.length; i++) {
            const field = fieldsConfigs[i]

            this.onFieldCreated.emit({
                field,
                control: this.formModel.get(field['key']),
            })
        }

        // para cada control select, agregar los eventos necesarios para su actualizacion

        const select_combo_keys_to_associate: any[] = []
        const select_fields_to_associate: any[] = []
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < fieldsConfigs.length; i++) {
            const field = fieldsConfigs[i]

            if (field['type'] == 'date') {
                select_combo_keys_to_associate.push('hijraDate')
                select_fields_to_associate.push(field)
            }

            if (
                field['type'] == 'select' ||
                field['type'] == 'checkboxGroup' ||
                field['type'] == 'radioGroup'
            ) {
                const select_combo_key = this.getSelectComboKeyBySelectKey(field)
                select_combo_keys_to_associate.push(select_combo_key)
                select_fields_to_associate.push(field)
                if (field['select_dependent'] == true) {
                    const parents_names = field['select_parent'].split(',')
                    // que en el on change de cada parent asociado, se actualicen los datos del combo necesario
                    // tslint:disable-next-line:prefer-for-of
                    for (let j = 0; j < parents_names.length; j++) {
                        this.subscriptions.push(
                            this.formModel
                                .get(parents_names[j])
                                .valueChanges.subscribe((value: any) => {
                                    this.formModel.get(field['key']).setValue('')
                                    const select_combo_key_by_parent =
                                        this.getSelectComboKeyByParentsValues(field)
                                    this.addSelectKeyToComboData(
                                        [select_combo_key_by_parent],
                                        [field],
                                    )
                                }),
                        )
                    }
                }
            }
        }
        this.addSelectKeyToComboData(
            select_combo_keys_to_associate,
            select_fields_to_associate,
        )

        this.onAllFieldsCreated.emit({ form: this.formModel })

        return this.formModel
    }

    protected initShowFieldsByMaskField(field, value) {
        const fieldsToShowOrHide = {}

        const maskValues = Object.keys(field['mask_fields_to_show'])

        maskValues.forEach((maskValue) => {
            const maskFieldsH = field['mask_fields_to_show'][maskValue]
            maskFieldsH.forEach((maskFieldH) => {
                fieldsToShowOrHide[maskFieldH] = false
            })
        })

        const maskFieldsS = field['mask_fields_to_show']['' + value]

        if (maskFieldsS) {
            maskFieldsS.forEach((maskFieldS) => {
                fieldsToShowOrHide[maskFieldS] = true
            })
        }

        Object.keys(fieldsToShowOrHide).forEach((key) => {
            if (fieldsToShowOrHide[key] == false) {
                this._fieldsVisibleStatus[key] = false
                this.formModel.get(key).disable()
                if (field['mask_fields_dont_reset'] !== true) {
                    this.formModel.get(key).setValue(null)
                }
            } else {
                this._fieldsVisibleStatus[key] = true
                if (!this._fieldsDisabledDefaultStatus[key]) {
                    this.formModel.get(key).enable()
                }
            }
        })
    }

    protected initHideFieldsByMaskField(field, value) {
        const fieldsToShowOrHide = {}

        const maskValues = Object.keys(field['mask_fields_to_hide'])

        maskValues.forEach((maskValue) => {
            const maskFieldsS = field['mask_fields_to_hide'][maskValue]
            maskFieldsS.forEach((maskFieldS) => {
                fieldsToShowOrHide[maskFieldS] = true
            })
        })

        const maskFieldsH = field['mask_fields_to_hide']['' + value]

        if (maskFieldsH) {
            maskFieldsH.forEach((maskFieldH) => {
                fieldsToShowOrHide[maskFieldH] = false
            })
        }

        Object.keys(fieldsToShowOrHide).forEach((key) => {
            if (fieldsToShowOrHide[key] == false) {
                this._fieldsVisibleStatus[key] = false
                this.formModel.get(key).disable()
                if (field['mask_fields_dont_reset'] !== true) {
                    this.formModel.get(key).setValue(null)
                }
            } else {
                this._fieldsVisibleStatus[key] = true
                if (!this._fieldsDisabledDefaultStatus[key]) {
                    this.formModel.get(key).enable()
                }
            }
        })
    }

    addSelectKeyToComboData(select_combo_keys: any[], fields: any[]): void {
        const combosKeys = select_combo_keys
            // remove null
            .filter(
                (test, index, array) =>
                    test !== null && test !== '' && test !== undefined
            )
            // remove duplicated
            .filter(
                (test, index, array) =>
                    index === array.findIndex((find) => find === test)
            )
            // remove existing in combosData
            .filter((test, index, array) => !this.combosData[test])

        if (combosKeys.length > 0) {
            this.subscriptions.push(
                this.staticService
                    .getAllCombosAsArrays(combosKeys, true)
                    .subscribe((resultC) => {
                        if (resultC === null) {
                            this.onError(resultC)
                        } else {
                            const data: any = resultC
                            combosKeys.forEach((key) => {
                                this.combosData[key] = data[key] ? data[key] : []
                                this.combosData['_' + key] = data[key] ? data[key] : []
                                this._internalSelectCombosSelfAdded.push(key)
                            })
                            select_combo_keys.forEach((select_combo_key, i) => {
                                const field = fields[i]
                                this.associateComboKeyToField(select_combo_key, field)
                            })
                        }
                    })
            )
        } else {
            select_combo_keys.forEach((select_combo_key, i) => {
                const field = fields[i]
                this.associateComboKeyToField(select_combo_key, field)
            })
        }
    }

    associateComboKeyToField(select_combo_key, field) {
        if (field !== null) {
            if (
                select_combo_key !== null &&
                select_combo_key !== '' &&
                select_combo_key !== undefined &&
                this.combosData[select_combo_key]
            ) {
                this._internalSelectCombosDataByField[field['key']] =
                    this.combosData[select_combo_key]
            } else {
                this._internalSelectCombosDataByField[field['key']] = []
            }
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe()
        })
        this.subscriptions = []
    }

    getSelectComboKeyBySelectKey(field) {
        let select_combo_key = field['select_combo_key']

        if (field['type'] == 'select' && field['select_dependent']) {
            select_combo_key = this.getSelectComboKeyByParentsValues(field)
        }

        return select_combo_key
    }

    getSelectComboKeyByParentsValues(field): string {
        let select_combo_key = field['select_combo_key_by_parent_value']

        const parents_names = field['select_parent'].split(',')

        let are_all_parents_nulls = true
        // tslint:disable-next-line:prefer-for-of
        for (let k = 0; k < parents_names.length; k++) {
            const parentk_value = this.formModel.get(parents_names[k]).value
            if (
                parentk_value !== null &&
                parentk_value !== undefined &&
                parentk_value !== ''
            ) {
                are_all_parents_nulls = false
            }
        }
        if (are_all_parents_nulls && typeof select_combo_key == 'string') {
            return field['select_combo_key']
        }
        for (let k = 0; k < parents_names.length; k++) {
            let parentk_value = this.formModel.get(parents_names[k]).value
            if (parentk_value === null || parentk_value === undefined) {
                parentk_value = ''
            }
            if (typeof select_combo_key == 'string') {
                if (k == 0) {
                    select_combo_key = select_combo_key.replace(
                        '[%value%]',
                        parentk_value,
                    )
                }
                select_combo_key = select_combo_key.replace(
                    '[%value' + k + '%]',
                    parentk_value,
                )
            } else if (typeof select_combo_key == 'object') {
                return select_combo_key['' + parentk_value]
            }
        }
        return select_combo_key
    }

    onError(result) {
    }

    getFieldErrorsAsArray(fieldKey: any = null) {
        if (!this.formModel.get(fieldKey) || !this.formModel.get(fieldKey).errors) {
            return []
        }

        const errors = this.formModel.get(fieldKey).errors
        const keys = Object.keys(errors)
        const errorsArray = []
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] != 'bsDate' && keys[i] != 'ngbDate') {
                //dtabpicker duplicate error
                switch (keys[i]) {
                    case 'min':
                        errorsArray.push({
                            code: keys[i],
                            params: {
                                min:
                                    typeof errors[keys[i]] == 'object'
                                        ? errors[keys[i]].min
                                        : '',
                            },
                        });
                        break;
                    case 'max':
                        errorsArray.push({
                            code: keys[i],
                            params: {
                                max:
                                    typeof errors[keys[i]] == 'object'
                                        ? errors[keys[i]].max
                                        : '',
                            },
                        });
                        break;
                    default:
                        errorsArray.push({
                            code: keys[i],
                            params: {
                                size:
                                    typeof errors[keys[i]] == 'object'
                                        ? errors[keys[i]].requiredLength
                                        : '',
                            },
                        });
                        break;
                }
            }
        }
        return errorsArray
    }

    changeComboDataAssignedToField(
        fieldName: string,
        comboKey: string,
        comboData: any[],
    ) {
        this._internalSelectCombosDataByField[fieldName] = comboData
        this.combosData[comboKey] = comboData
    }

    getGregorianDateToHijraDate(date) {
        if (date == null || date == '' || date == undefined) {
            return null
        }
        let subject = ''
        let translated = null
        if (this.combosData['hijraDate']) {
            if (date.constructor.name.toLowerCase() == 'string') {
                subject = date
            } else {
                subject =
                    ('0' + date.day).slice(-2) +
                    '/' +
                    ('0' + date.month).slice(-2) +
                    '/' +
                    date.year
            }
            this.combosData['hijraDate'].forEach((item) => {
                if (item.key == subject) {
                    translated = item.value
                }
            })
        }
        return translated
    }

    getHijraDateObjectToHijraDate(date: any) {
        if (date == null || date == '' || date == undefined) {
            return null
        }
        let subject = ''
        if (date.constructor.name.toLowerCase() == 'string') {
            subject = date
        } else {
            subject =
                ('0' + date.day).slice(-2) +
                '/' +
                ('0' + date.month).slice(-2) +
                '/' +
                date.year
        }
        return subject
    }

    getHijraDateToGregorianDate(date: any) {
        if (date == null || date == '' || date == undefined) {
            return null
        }
        let subject = ''
        let translated = null
        if (this.combosData['hijraDate']) {
            if (date.constructor.name.toLowerCase() == 'string') {
                subject = date
            } else {
                subject =
                    ('0' + date.day).slice(-2) +
                    '/' +
                    ('0' + date.month).slice(-2) +
                    '/' +
                    date.year
            }
            this.combosData['hijraDate'].forEach((item) => {
                if (item.value == subject) {
                    translated = item.key
                }
            })
        }
        return translated
    }

    openCloseHijraDatepickerTooltip(field, openClose) {
        /*if (openClose === false || (this.formModel.get(field).value !== '' && this.formModel.get(field).value !== null && this.formModel.get(field).value !== undefined)) {
                field['_tooltip-visible'] = openClose;
            }*/
        field['_tooltip-visible'] = openClose
    }

    getDateValue(date: any) {
        if (date === true) {
            return new Date()
        } else if (date === false) {
            return date
        }
        return this.formModel.get(date).value
    }

    getDateValueAR(date: any) {
        if (date === true) {
            return new Date()
        } else if (date === false) {
            return date
        }
        const hijra = this.formModel.get(date).value
        return hijra
    }

    onChangeInput($event, field) {

        this.checkValidatorsLimitsMinAndMaxBetweenFields();

        if (field['widget_event_on_change']) {
            return field.widget_event_on_change(
                $event,
                field,
                this.combosData,
                this.formModel,
            )
        }

        return null
    }

    checkValidatorsLimitsMinAndMaxBetweenFields(isFirstTime: boolean = true): void {
        for (let i = 0; i < this.fieldsConfigs.length; i++) {
            const field = this.fieldsConfigs[i]
            if (field['fieldLimitMax'] && this.formModel.contains(field['fieldLimitMax'])) {
                const maxValue = this.formModel.get(field['fieldLimitMax']).value;
                this.formModel.get(field['key']).clearValidators();
                if (maxValue != null && maxValue != undefined && maxValue != '') {
                    this.formModel.get(field['key']).setValidators(
                        Validators.compose([
                            ...this.defaultValidatorsByField[field['key']],
                            Validators.max(maxValue)
                        ])
                    )
                } else {
                    this.formModel.get(field['key']).setValidators(
                        Validators.compose([
                            ...this.defaultValidatorsByField[field['key']]
                        ])
                    )
                }
                this.formModel.get(field['key']).updateValueAndValidity();
            }

            if (field['fieldLimitMin'] && this.formModel.contains(field['fieldLimitMin'])) {
                const minValue = this.formModel.get(field['fieldLimitMin']).value;
                this.formModel.get(field['key']).clearValidators();
                if (minValue != null && minValue != undefined && minValue != '') {
                    this.formModel.get(field['key']).setValidators(
                        Validators.compose([
                            ...this.defaultValidatorsByField[field['key']],
                            Validators.min(minValue)
                        ])
                    )
                } else {
                    this.formModel.get(field['key']).setValidators(
                        Validators.compose([
                            ...this.defaultValidatorsByField[field['key']]
                        ])
                    )
                }
                this.formModel.get(field['key']).updateValueAndValidity();
            }
        }
    }

    canShowSelectPlaceHolder(field) {
        if (
            this.formModel.get(field['key']).disabled ||
            field['readonly'] === true
        ) {
            return false
        }
        if (
            this.formModel.get(field['key']).value == '' ||
            this.formModel.get(field['key']).value == null ||
            this.formModel.get(field['key']).value == undefined
        ) {
            return true
        }
        if (
            field['multiple'] === true &&
            this.formModel.get(field['key']).value == []
        ) {
            return true
        }
        return false
    }

    isDisabled(field) {
        if (
            this.formModel.get(field['key']).disabled ||
            field['readonly'] === true
        ) {
            return true
        }
        return false
    }

    isValueInCheckBoxGroup(value, field) {
        if (!Array.isArray(this.formModel.get(field['key']).value)) {
            return false
        }
        return (this.formModel.get(field['key']).value as any[]).find(
            (item) => item == value,
        )
            ? true
            : false
    }

    onChangeInputCheckBoxGroup($event, field, i) {
        if (field['type'] === 'checkboxGroup') {
            if (
                !this.formModel.get(field['key']).value ||
                !Array.isArray(this.formModel.get(field['key']).value)
            ) {
                this.formModel.get(field['key']).setValue([])
            }
            if ($event.target.checked) {
                const arrayValue = this.formModel.get(field['key']).value as any[]
                arrayValue.push(
                    this._internalSelectCombosDataByField[field['key']][i].key,
                )
                this.formModel.get(field['key']).setValue(arrayValue)
            } else {
                const key = this._internalSelectCombosDataByField[field['key']][i].key
                let arrayValue = this.formModel.get(field['key']).value as any[]
                arrayValue = arrayValue.filter((item) => item != key)
                this.formModel.get(field['key']).setValue(arrayValue)
            }
        }
        return this.onChangeInput($event, field)
    }

    public onChangeInputFile($event: any | null, field): void {
        if ($event === null || $event === undefined) {
            this.formModel.get(field['key']).patchValue(null)
            return this.onChangeInput($event, field)
        }
        if ($event.target.files && $event.target.files[0]) {
            const _file = $event.target.files[0]
            const _reader = new FileReader()
            _reader.readAsDataURL(_file)
            _reader.onload = (e: any) => {
                this.formModel.get(field['key']).patchValue({
                    name: _file.name,
                    file: _file,
                    data: _reader.result,
                    url: e.target.result
                })
                return this.onChangeInput($event, field)
            }
        }
    }

    isEmpty(field) {
        return (
            this.formModel.get(field['key']).value === '' ||
            this.formModel.get(field['key']).value === null ||
            this.formModel.get(field['key']).value === undefined ||
            this.formModel.get(field['key']).value === []
        )
    }

    getFileWidgetCustomRender(field) {
        if (field['widget_custom_render']) {
            return this.getTrustedHtml(
                field['widget_custom_render'](field, this.combosData, this.formModel),
            )
        } else {
            return !this.isEmpty(field) &&
                this.formModel.get(field['key']).value['name']
                ? this.formModel.get(field['key']).value['name']
                : this.formModel.get(field['key']).value
        }
    }

    getTrustedHtml(str) {
        return this.sanitizer.bypassSecurityTrustHtml(str)
    }

    getCustomFieldTemplateContent(field) {
        //const key = field['key'];
        if (field['widget_template_name']) {
            return this.custom_fields_templates
                ? this.custom_fields_templates[field['widget_template_name']]
                : null
        }
        if (field['widget_template']) {
            return field['widget_template']
        }
        return null
    }

    getTextareaFieldCkEditorOptions(field) {
        let ckConfig = {}
        if (this.translate.currentLang == 'en') {
            if (field['widget_ckeditor_config_en']) {
                ckConfig = field['widget_ckeditor_config_en']
            } else if (field['widget_ckeditor_config']) {
                ckConfig = field['widget_ckeditor_config']
            } else {
                ckConfig = this.ckConfigEn
            }
        } else {
            if (field['widget_ckeditor_config_ar']) {
                ckConfig = field['widget_ckeditor_config_ar']
            } else if (field['widget_ckeditor_config']) {
                return field['widget_ckeditor_config']
            } else {
                ckConfig = this.ckConfigAr
            }
        }
        return Object.assign({}, ckConfig, { readOnly: this.isDisabled(field) })
    }

    print() {
        const formModelData = []
        this._internalFieldsConfigs
            .filter(
                (field) =>
                    field['type'] != 'custom-code' &&
                    field['type'] != 'hidden' &&
                    this._fieldsVisibleStatus[field['key']],
            )
            .forEach((field) => {
                //console.log(field);
                let fieldValue = ''
                if (
                    field['type'].startsWith('select') ||
                    field['type'].startsWith('checkboxGroup') ||
                    field['type'].startsWith('radioGroup')
                ) {
                    this._internalSelectCombosDataByField[field['key']].forEach(
                        (subitem) => {
                            if (
                                field['type'].startsWith('checkboxGroup') ||
                                field['multiple'] === true
                            ) {
                                if (
                                    this.formModel.get(field['key']).value &&
                                    Array.isArray(this.formModel.get(field['key']).value)
                                ) {
                                    if (
                                        this.formModel
                                            .get(field['key'])
                                            .value.filter((key) => key == subitem.key).length > 0
                                    ) {
                                        fieldValue =
                                            (field['translate_rendered_text'] === true
                                                ? this.translate.instant(subitem['value'])
                                                : subitem['value']) + '\n'
                                    }
                                }
                            } else {
                                if (subitem.key == this.formModel.get(field['key']).value) {
                                    fieldValue =
                                        field['translate_rendered_text'] === true
                                            ? this.translate.instant(subitem['value'])
                                            : subitem['value']
                                }
                            }
                        },
                    )
                } /*else if (field['type'].startsWith('textarea')) {

                } else if (field['type'].startsWith('file')) {

                } else if (field['type'].startsWith('number')) {

                }*/ else if (
                    field['type'].startsWith('radio') ||
                    field['type'].startsWith('checkbox')
                ) {
                    fieldValue = this.formModel.get(field['key']).value
                        ? this.translate.instant('public.yes')
                        : this.translate.instant('public.no')
                } else if (field['type'].startsWith('date')) {
                    fieldValue =
                        this.formModel.get(field['key']).value &&
                            typeof this.formModel.get(field['key']).value == 'object'
                            ? new DateFormatPipe(this.injector, this._locale).transform(
                                this.formModel.get(field['key']).value,
                                'dd/MM/yyyy HH:mm:ss',
                            )
                            : this.formModel.get(field['key']).value
                } else {
                    fieldValue = this.formModel.get(field['key']).value
                }

                let div = document.createElement('div')
                div.innerHTML = fieldValue
                let nonHtmlValue = div.textContent || div.innerText || ''

                formModelData.push({
                    key:
                        field['translate'] === false
                            ? ''
                            : this.translate.instant(
                                (field['translate_use_prefix'] === false
                                    ? ''
                                    : this.translate_prefix + '.') + field['translate'],
                            ),
                    value: nonHtmlValue,
                })
            })
        this._internalRowsForPrint = formModelData
        setTimeout(() => {
            this.exportPrinterUtility.printPdf()
        }, 500)
    }
}
