import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
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
  @Output() categoryAdd = new EventEmitter<string>();
  categoryName: string = '';
  @Output() categoryRename = new EventEmitter<Category>();
  selectedCategory: Category | null = null;

  constructor(private messageService: MessageService) {}

  onAddClick(name: string): void {
    this.checkForExistingName(name, () => {
      this.categoryAdd.emit(name);
    });
  }

  onRenameClick(name: string): void {
    this.checkForExistingName(name, () => {
      if (this.selectedCategory) {
        this.categoryRename.emit({
          id: this.selectedCategory.id,
          name
        } as Category);
      }
    });
  }

  onSelectedCategoryChange(): void {
    if (this.selectedCategory && this.selectedCategory.name) {
      this.categoryName = this.selectedCategory.name;
    }
  }

  private checkForExistingName(name: string, code: () => void): void {
    const existCategory = this.categories.find((i) => i.name === name);

    // Если уже есть категория с таким именем
    if (existCategory) {
      this.messageService.add({
        severity: 'warn',
        detail: `Категория "${name}" уже существует. Введите другое имя`
      });
    // Если категории с таким именем нет, то выполняем переданный код
    } else {
      code();
      this.categoryName = '';
      this.selectedCategory = null;
    }
  }
}
