import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Category } from '../../models/models';

@Component({
  selector: 'app-colored-category-item',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './colored-category-item.component.html',
  styleUrl: './colored-category-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColoredCategoryItemComponent {
  @Input() category: Category | null = null;
}
