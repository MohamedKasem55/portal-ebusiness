import { Injectable } from '@angular/core'
import { FinanceModule } from './module-module';

@Injectable({
  providedIn: 'root'
})
export class FinanceProductCodeService {

  public MRCC_PRODUCT_CODE() {
    return 'MSB_REVOLVING_CREDIT_CARD'
  }

  public POS_PRODUCT_CODE() {
    return 'POS_FINANCING'
  }

  public BIF_PRODUCT_CODE() {
    return 'BIF_FINANCING'
  }

  public Ecommerce_PRODUCT_CODE() {
    return 'ECOMMERCE_FINANCING'
  }


  public FLEET_FINANCE_COMMERCIAL_VEHICLE() {
    return 'FLEET_FINANCE_COMMERCIAL_VEHICLE'
  }

  public DOSSIER_TYPE_CRL(){
    return 'CRL';
  }
  public ALL_BRANCHES(){
    return 'allBranches'
  }

}
