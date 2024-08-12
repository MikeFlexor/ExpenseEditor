import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { Category, ExpenseDetailsData, Expense } from '../../../models/models';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { DataService } from '../../../services/data.service';
import { Subscription } from 'rxjs';

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
export class ExpenseDetailsComponent implements OnDestroy, OnInit {
  get buttonDisabled() {
    return this.date === undefined ||
      this.selectedCategory === undefined ||
      this.price === undefined;
  }
  get canDelete() {
    return this.config.data !== null;
  }
  get addNewCategoryDisabled() {
    return this.newCategoryName.length === 0;
  }
  date: Date | undefined;
  newCategoryName: string = '';
  price: number | undefined;
  selectedCategory: Category | undefined;
  subscription: Subscription = new Subscription();

  constructor(
    public dataService: DataService,
    private config: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    const item: Expense = this.config.data;
    if (item !== null) {
      this.date = new Date(item.date);
      this.subscription.add(
        this.dataService.categories$.subscribe((categories) => {
          this.selectedCategory = categories.find((i) => i.id === item.category.id);
        })
      );
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
