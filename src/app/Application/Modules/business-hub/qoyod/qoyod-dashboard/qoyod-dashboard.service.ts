import { Injectable } from '@angular/core';
import {forkJoin, Observable} from "rxjs";
import {ConfigResourceService} from "../../../../../core/config/config.resource.local";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, combineLatest, delayWhen, map} from "rxjs/operators";
import {AbstractService} from "../../../Common/Services/Abstract/abstract.service";

@Injectable({
  providedIn: 'root'
})
export class QoyodDashboardService extends AbstractService{

  public SYS_ID = "QOYOD"
  servicesUrl: string
  headers = new HttpHeaders({'IgnoreError': 'true'})

  constructor(
      public config: ConfigResourceService,
      protected http: HttpClient
  ) {
    super(http, config)
    this.servicesUrl = config.businessHubServicesUrl
  }

  loadAccounts(){

  }

  hasAccess(): Observable<any>{
    return this.http.get(this.servicesUrl + `/eBusinessHubStores/hasAccess/${this.SYS_ID}`).pipe(
        map((response: any) => response),
        catchError(this.handleError),
    )
  }

  login(data: any): Observable<any>{
    return this.http.post(this.servicesUrl + `/eBusinessHubStores/login`, data).pipe(
        map((response: any) => response),
        catchError(this.handleError)
    )
  }

  renewQoyodSubscription(data: any): Observable<any>{
    return this.http.post(this.servicesUrl + `/eBusinessHubStores/qoyodRenewSubscription`, data).pipe(
        map((response: any) => response),
        catchError(this.handleError)
    )
  }

  initiateInvoicing(){
    const observables: Observable<any>[] = [
      this.getInvoicesOverview(),
      this.getTopInvoiceCustomers(),
      this.getTopInvoices(),
      this.getInvoicingAgingSummary()
    ]

    return forkJoin(observables)
  }

  initiateBilling(){
    const observables: Observable<any>[] = [
      this.getBillsOverview(),
      this.getTopVendors(),
      this.getTopBills(),
      this.getBillsAgingSummary(),
    ]

    return forkJoin(observables)
  }

  // INVOICES

  getInvoicesOverview(): Observable<any>{
    return this.http.get(this.servicesUrl + `/eBusinessHubStores/qoyodInvoiceOverview`, {
      headers: this.headers
    }).pipe(
        map((response: any) => response),
        catchError(this.handleError)
    )
  }

  getTopInvoiceCustomers(): Observable<any>{
    return this.http.get(this.servicesUrl + `/eBusinessHubStores/qoyodOutstandingCustomers`, {
      headers: this.headers
    }).pipe(
        map((response: any) => response),
        catchError(this.handleError)
    )
  }

  getTopInvoices(): Observable<any>{
    return this.http.get(this.servicesUrl + `/eBusinessHubStores/qoyodTopInvoices`,{
      headers: this.headers
    }).pipe(
        map((response: any) => response),
        catchError(this.handleError)
    )
  }

  getInvoicingAgingSummary(): Observable<any>{
    return this.http.get(this.servicesUrl + `/eBusinessHubStores/qoyodAgedOpenInvoices`, {
      headers: this.headers
    }).pipe(
        map((response: any) => response),
        catchError(this.handleError)
    )
  }

  // BILLS

  getBillsOverview(): Observable<any>{
    return this.http.get(this.servicesUrl + `/eBusinessHubStores/qoyodBillOverview`, {
      headers: this.headers
    }).pipe(
        map((response: any) => response),
        catchError(this.handleError)
    )
  }

  getTopVendors(): Observable<any>{
    return this.http.get(this.servicesUrl + `/eBusinessHubStores/qoyodOutstandingVendors`, {
      headers: this.headers
    }).pipe(
        map((response: any) => response),
        catchError(this.handleError)
    )
  }

  getTopBills(): Observable<any>{
    return this.http.get(this.servicesUrl + `/eBusinessHubStores/qoyodTopBills`, {
      headers: this.headers
    }).pipe(
        map((response: any) => response),
        catchError(this.handleError)
    )
  }

  getBillsAgingSummary(): Observable<any>{
    return this.http.get(this.servicesUrl + `/eBusinessHubStores/qoyodAgedOpenBillsInq`, {
      headers: this.headers
    }).pipe(
        map((response: any) => response),
        catchError(this.handleError)
    )
  }

}
