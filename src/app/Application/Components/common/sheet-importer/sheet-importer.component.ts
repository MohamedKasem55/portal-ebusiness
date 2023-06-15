import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
    selector: 'sheet-import',
    templateUrl: './sheet-importer.component.html',
    styleUrls: ['./sheet-importer.component.scss']
})
export class SheetImporterComponent implements OnInit {

    constructor() {
    }

    @Input() columns: string[]
    @Input() label = ''
    @Input() file: any = {name: ''}
    @Output() fileUploaded = new EventEmitter<Component>()

    TempFile: any

    ngOnInit(): void {
    }

    fileUpload(eventT: any) {
        this.file = eventT.target.files[0];

        this.fileUploaded.emit(this.file)
    }

    getJson() {
        const file = this.file
        const columns = this.columns
        return new Promise(function (resolve, reject) {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);
            fileReader.onload = (event) => {
                if (event.target != null) {
                    let binaryData = event.target.result;
                    let workBook = XLSX.read(binaryData, {type: 'binary'});
                    workBook.SheetNames.forEach(
                        (sheet: any) => {
                            const jsonData = XLSX.utils.sheet_to_json(workBook.Sheets[sheet], {header: columns}) //replace file header with input columns
                            jsonData.splice(0, 1) //remove file header
                            resolve(jsonData)
                        }
                    )
                }
                reject()
            }
        })
    }

    deleteFile() {
        this.TempFile = null
    }

}