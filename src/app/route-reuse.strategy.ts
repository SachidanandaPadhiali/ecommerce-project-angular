import {
    ActivatedRouteSnapshot,
    DetachedRouteHandle,
    RouteReuseStrategy
} from '@angular/router';

export class NoReuseStrategy implements RouteReuseStrategy {
    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return false;
    }

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return false;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void { }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return false;
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        return null;
    }
}
