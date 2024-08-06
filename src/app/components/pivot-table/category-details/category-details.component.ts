import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Expense } from '../../../models/models';

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [
    CommonModule,
    TableModule
  ],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDetailsComponent {
  @Input() items: Expense[] = [];
}
