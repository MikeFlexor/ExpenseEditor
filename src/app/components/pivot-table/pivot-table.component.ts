import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';

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
export class PivotTableComponent {
  date: Date | undefined;
  get summaryTotal() {
    let total = 0;
    for (const item of this.dataService.totals$.value) {
      total += item.total;
    }
    return total;
  }

  constructor(public dataService: DataService) {}

  onFormClick(): void {
    if (!this.date) {
      return;
    }
    this.dataService.countTotals(this.date);
  }
}
