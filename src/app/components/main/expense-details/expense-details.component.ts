import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CategoryItem, ExpenseDetailsData, ExpenseItem } from '../../../models/models';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-expense-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    DropdownModule,
    InputNumberModule,
    InputTextModule,
    InputGroupModule
  ],
  templateUrl: './expense-details.component.html',
  styleUrl: './expense-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseDetailsComponent implements OnInit {
  get buttonDisabled() {
    return this.date === undefined ||
      this.selectedCategory === undefined ||
      this.price === undefined;
  }
  get canDelete() {
    return this.config.data !== undefined;
  }
  get addNewCategoryDisabled() {
    return this.newCategoryName.length === 0;
  }
  date: Date | undefined;
  newCategoryName: string = '';
  price: number | undefined;
  selectedCategory: CategoryItem | undefined;

  constructor(
    public dataService: DataService,
    private config: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    const item: ExpenseItem = this.config.data;
    if (item !== undefined) {
      this.date = new Date(item.date);
      this.selectedCategory = this.dataService.categories$.value
        .find((i) => i.id === item.category.id);
      this.price = item.price;
    }
  }

  onAcceptClick(): void {
    if (this.selectedCategory !== undefined && this.date) {
      this.dialogRef.close({
        expense: {
          date: this.date,
          category: this.selectedCategory,
          price: this.price
        },
        delete: false
      } as ExpenseDetailsData);
    }
  }

  onDeleteClick(): void {
    this.dialogRef.close({
      expense: undefined,
      delete: true
    } as ExpenseDetailsData);
  }

  onAddCategoryClick(): void {
    this.dataService.addCategory(this.newCategoryName);
    this.newCategoryName = '';
  }
}
