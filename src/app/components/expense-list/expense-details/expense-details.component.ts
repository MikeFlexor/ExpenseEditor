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
      this.category === undefined ||
      this.price === undefined;
  }
  get canDelete() {
    return this.config.data !== null;
  }
  get addNewCategoryDisabled() {
    return this.newCategoryName.length === 0;
  }

  get category(): Category | null {
    if (this._category) {
      return this._category;
    } else if (this.dataService.useLastSelectedCategory) {
      return this.dataService.lastSelectedCategory;
    }
    return null;
  }
  set category(category: Category) {
    this._category = category;
    this.dataService.lastSelectedCategory = category;
  }

  get date(): Date | null {
    if (this._date) {
      return this._date;
    } else if (this.dataService.useLastSelectedDate) {
      return this.dataService.lastSelectedDate;
    }
    return null;
  }
  set date(date: Date) {
    this._date = date;
    this.dataService.lastSelectedDate = date;
  }

  newCategoryName: string = '';
  price: number | undefined;
  subscription: Subscription = new Subscription();

  private _category: Category | null = null;
  private _date: Date | null = null;

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
          const foundCategory = categories
            .find((i) => i.id === item.category.id);
          if (foundCategory) {
            this.category = foundCategory;
          }
        })
      );
      this.price = item.price;
    }
  }

  onAcceptClick(): void {
    if (this.category && this.date) {
      this.dialogRef.close({
        expense: {
          date: this.date,
          category: this.category,
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
