import {Component, OnInit} from '@angular/core';
import {AbstractWizardComponent} from "../../../Common/Components/Abstract/abstract-wizard.component";
import {FormBuilder, FormGroup} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {AppAgreementFileUploadService} from "./app-agreement-file-upload.service";

@Component({
    selector: 'app-app-agreement-file-upload',
    templateUrl: './app-agreement-file-upload.component.html',
    styleUrls: ['./app-agreement-file-upload.component.scss']
})
export class AppAgreementFileUploadComponent extends AbstractWizardComponent implements OnInit {

    fieldsConfigs = []
    combosData = [];

    constructor(public fb: FormBuilder,
                public translate: TranslateService,
                public router: Router,
                private appAgreementService: AppAgreementFileUploadService) {

        super(fb, translate, router);
        this.formModel = this.fb.group({})
    }

    ngOnInit(): void {
        this.wizardStep = 1
        this.appAgreementService.regions().subscribe((result) => {
            const regions = result.props
            this.combosData['regions'] = []
            for (const property in regions) {
                this.combosData['regions'].push({
                    key: property,
                    value: regions[property],
                })
                this.fieldsConfigs = AppAgreementFileUploadComponent.buildForm();
            }
        })

    }

    back() {
        this.wizardStep--;
        if (this.wizardStep == 1) {
            this.formModel.enable()
        }
        if (this.wizardStep == 0) {
            this.router.navigate(['app-agreement/' + this.router.url.split('/').pop()])
        }
    }

    getWizardStepsCount() {
        return 3
    }

    isDisabled() {
    }

    isBackAllowed() {
        return this.wizardStep > 1
    }

    next() {
        switch (this.wizardStep) {
            case 1:
                this.formModel.disable()
                super.markNextWizardStep();
                break
            case 2:
                const formData = new FormData()
                formData.append('file', this.formModel.get('file').value.file)
                formData.append('agreement', this.router.url.split('/').pop())
                formData.append('region', this.formModel.get('region').value)

                this.appAgreementService.uploadAgreement(formData).subscribe((res) => {
                    if (res['errorCode'] == '0') {
                        super.markNextWizardStep();
                    }
                })
                break
        }

    }

    onInitStep(step, events) {
    }

    valid() {
    }

    private static buildForm(): any[] {
        return [
            {
                key: 'region',
                title: 'region',
                translate: 'regions',
                type: 'select',
                required: true,
                default: '',
                validators: [],
                widget: '',
                select_combo_key: 'regions',
                widget_container_class: 'col-xs-12 col-sm-4',
                widget_container_init_row: false,
                widget_container_end_row: false,
                updatable: true,
                isFormField: true,
                isForValidate: true,
                isForConfirm: true,
            },
            {
                key: 'file',
                title: 'file',
                translate: 'upload-file',
                type: 'file',
                required: true,
                default: '',
                validators: [],
                widget: '',
                widget_file_accept: '.pdf',
                widget_container_class: 'col-xs-12 col-sm-8',
                widget_container_init_row: false,
                widget_container_end_row: true,
                updatable: true,
                isFormField: true,
                isForValidate: true,
                isForConfirm: true,
            }

        ]
    }

}
