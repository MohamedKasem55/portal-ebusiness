import {Injectable} from '@angular/core'

@Injectable()
export class SelectedUserAlertDataService {

    users: any
    account: any
    datos: any
    confirm: any
    isSoleProperty : any;

    getUsers() {
        return this.users
    }

    setUsers(_users) {
        this.users = _users
    }

    setAccount(_account) {
        this.account = _account
    }

    getAccount() {
        return this.account
    }

    getDatos() {
        return this.datos
    }

    setDatos(_datos) {
        this.datos = _datos
    }

    setConfirm(_confirm) {
        this.confirm = _confirm
    }

    getConfirm() {
        return this.confirm
    }

    getSoleProperty(): boolean {
        return this.isSoleProperty;
    }

    setSoleProperty(value: boolean) {
        this.isSoleProperty = value;
    }

    clear() {
        this.datos = null
        this.users = null
        this.account = null
        this.isSoleProperty = null
    }

}
