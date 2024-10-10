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
import { MessageService } from 'primeng/api';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryEditComponent {
  @Input() categories: Category[] = [];
  @Output() categoryRename = new EventEmitter<Category>();
  @ViewChild(Listbox) listbox: Listbox | undefined;
  selectedCategory: Category | null = null;

  constructor(private messageService: MessageService) {}

  onRenameClick(name: string): void {
    const existCategory = this.categories.find((i) => i.name === name);

    // Если уже есть категория с таким именем
    if (existCategory) {
      this.messageService.add({
        severity: 'warn',
        detail: `Категория "${name}" уже существует. Введите другое имя`
      });
    } else {
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
}
