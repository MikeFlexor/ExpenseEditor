import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Listbox, ListboxModule } from 'primeng/listbox';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Category } from '../../../models/models';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ListboxModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryEditComponent {
  @Input() categories: Category[] = [];
  @Output() categoryRename = new EventEmitter<Category>();
  @ViewChild(Listbox) listbox: Listbox | undefined;
  selectedCategory: Category | null = null;

  onRenameClick(name: string): void {
    if (this.selectedCategory) {
      this.categoryRename.emit({
        id: this.selectedCategory.id,
        name
      } as Category);
    }

    if (this.listbox) {
      this.listbox.updateModel(this.categories);
    }
  }
}
