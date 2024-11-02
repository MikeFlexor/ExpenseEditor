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
import { Category, CategoryChange } from '../../../models/models';
import { MessageService } from 'primeng/api';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ColoredCategoryItemComponent } from '../../colored-category-item/colored-category-item.component';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ListboxModule,
    InputTextModule,
    ButtonModule,
    ColorPickerModule,
    ColoredCategoryItemComponent
  ],
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryEditComponent {
  @Input() categories: Category[] = [];
  @Output() categoryAdd = new EventEmitter<CategoryChange>();
  categoryColor: string | null = null;
  categoryName: string = '';
  @Output() categoryChange = new EventEmitter<Category>();
  selectedCategory: Category | null = null;

  constructor(private messageService: MessageService) {}

  onAddClick(): void {
    this.checkForExistingName(this.categoryName, () => {
      this.categoryAdd.emit({
        name: this.categoryName,
        color: this.categoryColor
      } as CategoryChange);
      this.categoryColor = null;
    });
  }

  onColorChange(): void {
    if (this.selectedCategory) {
      if (this.categoryColor) {
        this.selectedCategory.color = this.categoryColor;
      }
      this.categoryChange.emit(this.selectedCategory);
    }
  }

  onRenameClick(): void {
    this.checkForExistingName(this.categoryName, () => {
      if (this.selectedCategory) {
        this.categoryChange.emit({
          id: this.selectedCategory.id,
          name: this.categoryName,
          color: this.selectedCategory.color
        } as Category);
      }
    });
  }

  onSelectedCategoryChange(): void {
    if (this.selectedCategory) {
      this.categoryName = this.selectedCategory.name;
      this.categoryColor = this.selectedCategory.color;
    }

    if (!this.selectedCategory) {
      this.categoryName = '';
      this.categoryColor = null;
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
