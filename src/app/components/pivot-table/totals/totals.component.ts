import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DataService } from '../../../services/data.service';
import { TotalsItem } from '../../../models/models';

@Component({
  selector: 'app-totals',
  standalone: true,
  imports: [
    CommonModule,
    TableModule
  ],
  templateUrl: './totals.component.html',
  styleUrl: './totals.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalsComponent {
  @Input() date: Date | null = null;
  @Input() items: TotalsItem[] = [];
  get summaryTotal() {
    let total = 0;
    for (const item of this.items) {
      total += item.total;
    }
    return total;
  }

  constructor(public dataService: DataService) {}

  onRowSelect(item: TotalsItem): void {
    if (this.date) {
      this.dataService.updateCategoryExpenses(item, this.date);
    }
  }

  onRowUnselect(): void {
    this.dataService.updateCategoryExpenses();
  }
}
