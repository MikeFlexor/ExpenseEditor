import { TemplatePortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigateService {
  selectedTabId$ = new BehaviorSubject<number>(0);
  templatePortal$ = new BehaviorSubject<TemplatePortal | null>(null);

  setSelectedTabId(id: number): void {
    this.selectedTabId$.next(id);
  }

  setTemplatePortal(portal: TemplatePortal | null): void {
    this.templatePortal$.next(portal);
  }
}
