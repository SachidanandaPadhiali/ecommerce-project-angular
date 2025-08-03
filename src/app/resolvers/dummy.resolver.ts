import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DummyResolver implements Resolve<boolean> {
  resolve() {
    return of(true);
  }
}
