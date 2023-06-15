import {HttpClient} from '@angular/common/http'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs'
import {ConfigResourceService} from '../../../../../core/config/config.resource.local'
import {AbstractService} from "../../../Common/Services/Abstract/abstract.service";

@Injectable()
export class SalaryPaymentsService extends AbstractService {

    public constructor(protected http: HttpClient,
                       public config: ConfigResourceService,) {
        super(http, config);
    }

    public initSalaryPayment(): Observable<any> {
        return this.doGet(this.servicesUrl + '/payrollWPS/salaryPayment/init');
    }

    public validateSalaryPayments(account, salaryPaymentDetails, selectedEmployee): Observable<any> {
        const data = {
            accountNumber: account.value.fullAccountNumber,
            salaryPaymentDetails,
            selectedEmployeesList: selectedEmployee,
        }
        return this.doPost(this.servicesUrl + '/payrollWPS/salaryPayment/validate', data)
    }

    public confirmSalaryPayments(salaryPaymentDetails, selectedEmployee, requestValidate): Observable<any> {
        const data = {
            requestValidate,
            salaryPaymentDetails,
            selectedEmployeeList: selectedEmployee,
        }
        return this.doPost(this.servicesUrl + '/payrollWPS/salaryPayment/confirm', data)
    }
}
