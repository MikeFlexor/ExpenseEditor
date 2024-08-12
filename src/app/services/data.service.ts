import { Injectable } from '@angular/core';
import { Category, Expense, TotalsItem } from '../models/models';
import { BehaviorSubject } from 'rxjs';
import { TemplatePortal } from '@angular/cdk/portal';
import { Db } from '../db/db';
import { liveQuery } from 'dexie';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  categories$ = liveQuery(async () => await this.db.categories.toArray());
  categoryExpenses$ = new BehaviorSubject<Expense[]>([]);
  db = new Db('db');
  expenses$ = liveQuery(async () => await this.db.expenses.toArray());
  selectedDate$ = new BehaviorSubject<Date | null>(null);
  selectedTabId$ = new BehaviorSubject<number>(0);
  templatePortal$ = new BehaviorSubject<TemplatePortal | null>(null);
  totals$ = new BehaviorSubject<TotalsItem[]>([]);
  totalsSelectedCategory$ = new BehaviorSubject<TotalsItem | null>(null);

  private defaultCategories: Category[] = [
    { id: 0, name: 'Еда' },
    { id: 1, name: 'Коммунальные платежи' },
    { id: 2, name: 'Одежда' },
    { id: 3, name: 'Аптека' },
    { id: 4, name: 'Машина' },
    { id: 5, name: 'Бытовая химия' },
    { id: 6, name: 'Для дома' },
  ];

  constructor() {
    this.db.categories.count().then((count) => {
      if (count === 0) {
        for (const category of this.defaultCategories) {
          this.db.categories.add(category);
        }
      }
    });
  }

  addExpense(expense: Expense): void {
    this.db.expenses.add(expense);
  }

  changeExpense(expense: Expense): void {
    this.db.expenses.update(expense.id, expense);
  }

  deleteExpense(expense: Expense): void {
    this.db.expenses.delete(expense.id);
  }

  addCategory(name: string): void {
    this.db.categories.add({ name } as Category);
  }

  updateCategoryExpenses(totalsItem?: TotalsItem, date?: Date): void {
    if (totalsItem && date) {
      const startDate = new Date(date);
      const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));
      this.db.expenses
        .filter((i) => i.category.id === totalsItem.category.id &&
          i.date.getTime() >= startDate.getTime() &&
          i.date.getTime() < endDate.getTime())
        .toArray()
        .then((categoryExpenses) => {
          this.categoryExpenses$.next(categoryExpenses);
        });
      this.totalsSelectedCategory$.next(totalsItem);
    } else {
      this.categoryExpenses$.next([]);
      this.totalsSelectedCategory$.next(null);
    }
  }

  setSelectedTabId(id: number): void {
    this.selectedTabId$.next(id);
  }

  setTemplatePortal(portal: TemplatePortal | null): void {
    this.templatePortal$.next(portal);
  }

  setSelectedDate(date: Date): void {
    this.selectedDate$.next(date);
    this.countTotals();
    this.updateCategoryExpenses();
  }

  updateCategory(category: Category): void {
    this.db.categories.update(category.id, category);
  }

  private countTotals(): void {
    if (!this.selectedDate$.value) {
      return;
    }

    const startDate = new Date(this.selectedDate$.value);
    const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));
    this.db.expenses
      .filter((i) =>
        i.date.getTime() >= startDate.getTime() && i.date.getTime() < endDate.getTime()
      )
      .toArray()
      .then((expenses) => {
        const items: TotalsItem[] = [];

        for (const expense of expenses) {
          const foundItem = items.find((i) => i.category.id === expense.category.id);
          if (foundItem) {
            foundItem.total += expense.price;
          } else {
            items.push({
              category: expense.category,
              total: expense.price
            } as TotalsItem);
          }
        }
    
        this.totals$.next(items);
      });
  }
}
