import { TemplatePortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PortalService {
  templatePortal$ = new Subject<TemplatePortal>();

  setTemplatePortal(portal: TemplatePortal): void {
    this.templatePortal$.next(portal);
  }
}
