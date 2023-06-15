import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router'

@Injectable()
export class AuthGuardDashboard
  implements CanActivate, CanActivateChild, CanLoad
{
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    return true //TODO: se devuelve true durante las pruebas. cambiar a la gestion de permisos oportuna
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    return true //TODO: se devuelve true durante las pruebas. cambiar a la gestion de permisos oportuna
  }

  canLoad(route: Route): boolean {
    return true //TODO: se devuelve true durante las pruebas. cambiar a la gestion de permisos oportuna
  }
}
