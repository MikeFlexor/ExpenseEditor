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
import { MessageService } from 'primeng/api';

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
    } else if (this.dataService.settings$.value.useLastSelectedCategory &&
      this.dataService.settings$.value.lastSelectedCategory)
    {
      this._category = this.dataService.settings$.value.lastSelectedCategory;
      return this._category;
    }
    return null;
  }
  set category(category: Category) {
    this._category = category;
    this.dataService.updateSettings({
      ...this.dataService.settings$.value,
      lastSelectedCategory: category
    });
  }

  get date(): Date | null {
    if (this._date) {
      return this._date;
    } else if (this.dataService.settings$.value.useLastSelectedDate &&
      this.dataService.settings$.value.lastSelectedDate)
    {
      this._date = new Date(this.dataService.settings$.value.lastSelectedDate);
      return this._date;
    }
    return null;
  }
  set date(date: Date) {
    this._date = new Date(date);
    this.dataService.updateSettings({
      ...this.dataService.settings$.value,
      lastSelectedDate: new Date(date)
    });
  }

  newCategoryName: string = '';
  price: number | undefined;
  subscription: Subscription = new Subscription();

  private _categories: Category[] = [];
  private _category: Category | null = null;
  private _date: Date | null = null;

  constructor(
    public dataService: DataService,
    private config: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private messageService: MessageService
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription.add(
      this.dataService.categories$.subscribe((categories) => {
        this._categories = categories;

        const item: Expense = this.config.data;

        if (item !== null) {
          this.date = new Date(item.date);
          const foundCategory = this._categories
            .find((i) => i.id === item.category.id);
          if (foundCategory) {
            this.category = foundCategory;
          }
          this.price = item.price;
        }
      })
    );
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
    const existCategory = this._categories
      .find((i) => i.name === this.newCategoryName);

    // Если уже есть категория с таким именем
    if (existCategory) {
      this.messageService.add({
        severity: 'warn',
        detail: `Категория "${this.newCategoryName}" уже существует. Введите другое имя`
      });
    // Если категории с таким именем нет, то добавляем
    } else {
      this.dataService.addCategory(this.newCategoryName);
      this.newCategoryName = '';
    }
  }
}
