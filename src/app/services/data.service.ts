import { Injectable } from '@angular/core';
import { Category, Expense, PivotTableItem, SavedData } from '../models/models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  categories$ = new BehaviorSubject<Category[]>([]);
  expenses$ = new BehaviorSubject<Expense[]>([]);
  totals$ = new BehaviorSubject<PivotTableItem[]>([]);

  private defaultCategories: Category[] = [
    { id: 0, name: 'Еда' },
    { id: 1, name: 'Коммунальные платежи' },
    { id: 2, name: 'Одежда' },
    { id: 3, name: 'Аптека' },
    { id: 4, name: 'Машина' },
    { id: 5, name: 'Бытовая химия' },
    { id: 6, name: 'Для дома' },
  ];
  private expenseMaxId: number = 0;
  private categoryMaxId: number = 0;

  constructor() {
    this.loadData();
  }

  addExpense(expense: Expense): void {
    this.expenseMaxId++;
    expense.id = this.expenseMaxId;
    this.expenses$.next([...this.expenses$.value, expense]);
  }

  changeExpense(expense: Expense): void {
    const foundItem = this.expenses$.value.find((i) => i.id === expense.id);
    if (foundItem !== undefined) {
      foundItem.date = expense.date;
      foundItem.category = expense.category;
      foundItem.price = expense.price;
    }
  }

  deleteExpense(expense: Expense): void {
    const index = this.expenses$.value.indexOf(expense);
    const newExpenses = [...this.expenses$.value];
    newExpenses.splice(index, 1);
    this.expenses$.next(newExpenses);
  }

  addCategory(categoryName: string): void {
    this.categoryMaxId++;
    const newCategory: Category = {
      id: this.categoryMaxId,
      name: categoryName
    };
    this.categories$.next([...this.categories$.value, newCategory]);
  }

  countTotals(date: Date): void {
    const startDate = new Date(date);
    const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));
    const expenses = this.expenses$.value.filter((i) => 
      i.date.getTime() >= startDate.getTime() && i.date.getTime() < endDate.getTime()
    );
    const items: PivotTableItem[] = [];

    for (const expense of expenses) {
      const foundItem = items.find((i) => i.category.id === expense.category.id);
      if (foundItem) {
        foundItem.total += expense.price;
      } else {
        items.push({
          category: expense.category,
          total: expense.price
        } as PivotTableItem);
      }
    }

    this.totals$.next(items);
  }

  async saveData(): Promise<void> {
    const data: SavedData = {
      categories: this.categories$.value,
      expenses: this.expenses$.value
    };
    const directoryHandle = await navigator.storage.getDirectory();
    const fileHandle = await directoryHandle
      .getFileHandle('data.txt', { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(data));
    await writable.close();
  }

  private async loadData(): Promise<void> {
    const directoryHandle = await navigator.storage.getDirectory();
    const fileHandle = await directoryHandle
      .getFileHandle('data.txt', { create: true });
    const file = await fileHandle.getFile();
    await file.text().then((dataString) => {
      // Если в файле были сохраненные данные
      if (dataString) {
        const data: SavedData = JSON.parse(dataString);
        if (data.categories && data.categories.length) {
          this.categories$.next(data.categories);
        } else {
          this.categories$.next(this.defaultCategories);
        }
        const categoryIds = data.expenses.map((i) => i.id);
        this.categoryMaxId = Math.max(...categoryIds);
        for (const expense of data.expenses) {
          expense.date = new Date(expense.date);
        }
        this.expenses$.next(data.expenses);
        const expenseIds = data.expenses.map((i) => i.id);
        this.expenseMaxId = Math.max(...expenseIds);
      // Если файл был пустой
      } else {
        this.categories$.next(this.defaultCategories);
        this.expenses$.next([]);
      }
    });
  }
}
