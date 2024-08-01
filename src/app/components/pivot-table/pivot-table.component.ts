import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { TemplatePortal } from '@angular/cdk/portal';
import { PortalService } from '../../services/portal.service';

@Component({
  selector: 'app-pivot-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    TableModule
  ],
  templateUrl: './pivot-table.component.html',
  styleUrl: './pivot-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PivotTableComponent implements AfterViewInit {
  date: Date | undefined;
  get summaryTotal() {
    let total = 0;
    for (const item of this.dataService.totals$.value) {
      total += item.total;
    }
    return total;
  }
  @ViewChild('portalContent') portalContent: TemplateRef<unknown> | undefined;

  constructor(
    public dataService: DataService,
    private portalService: PortalService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngAfterViewInit(): void {
    if (this.portalContent) {
      this.portalService.setTemplatePortal(
        new TemplatePortal(this.portalContent, this.viewContainerRef)
      );
    }
  }

  onFormClick(): void {
    if (!this.date) {
      return;
    }
    this.dataService.countTotals(this.date);
  }
}
