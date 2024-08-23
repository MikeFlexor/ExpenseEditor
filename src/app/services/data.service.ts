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
  categories$ = liveQuery(async () => await (this.db ? this.db.categories.toArray() : []));
  categoryExpenses$ = new BehaviorSubject<Expense[]>([]);
  db: Db | null = null;
  dbNames$ = new BehaviorSubject<string[]>([]);
  expenses$ = liveQuery(async () => await (this.db ? this.db.expenses.toArray() : []));
  selectedDate$ = new BehaviorSubject<Date | null>(null);
  selectedTabId$ = new BehaviorSubject<number>(0);
  showDbNameEntering$ = new BehaviorSubject<boolean>(false);
  templatePortal$ = new BehaviorSubject<TemplatePortal | null>(null);
  totals$ = new BehaviorSubject<TotalsItem[]>([]);
  totalsSelectedCategory$ = new BehaviorSubject<TotalsItem | null>(null);

  // private defaultCategories: Category[] = [
  //   { id: 0, name: 'Еда' },
  //   { id: 1, name: 'Коммунальные платежи' },
  //   { id: 2, name: 'Одежда' },
  //   { id: 3, name: 'Аптека' },
  //   { id: 4, name: 'Машина' },
  //   { id: 5, name: 'Бытовая химия' },
  //   { id: 6, name: 'Для дома' },
  // ];

  constructor() {
    // this.db.categories.count().then((count) => {
    //   if (count === 0) {
    //     for (const category of this.defaultCategories) {
    //       this.db.categories.add(category);
    //     }
    //   }
    // });

    this.initDb();
  }

  addExpense(expense: Expense): void {
    this.db?.expenses.add(expense);
  }

  changeExpense(expense: Expense): void {
    this.db?.expenses.update(expense.id, expense);
  }

  deleteExpense(expense: Expense): void {
    this.db?.expenses.delete(expense.id);
  }

  addCategory(name: string): void {
    this.db?.categories.add({ name } as Category);
  }

  updateCategoryExpenses(totalsItem?: TotalsItem, date?: Date): void {
    if (totalsItem && date) {
      const startDate = new Date(date);
      const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));
      this.db?.expenses
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
    this.db?.categories.update(category.id, category);
  }

  setNewDbName(name: string): void {
    const dbNamesString = JSON.stringify([name]);
    localStorage.setItem('dbNames', dbNamesString);
    localStorage.setItem('selectedDbName', name);
    this.dbNames$.next([name]);
    this.db = new Db(name);
    this.showDbNameEntering$.next(false);
  }

  addDb(dbName: string): void {
    const dbNames = this.dbNames$.value;
    dbNames.push(dbName);
    localStorage.setItem('selectedDbName', dbName);
    localStorage.setItem('dbNames', JSON.stringify(dbNames));
    this.dbNames$.next(dbNames);
    this.db = new Db(dbName);
  }

  changeDb(dbName: string): void {
    localStorage.setItem('selectedDbName', dbName);
    this.db = new Db(dbName);
  }

  deleteDb(dbName: string): void {
    if (this.db) {
      const dbNames = this.dbNames$.value;
      this.db.delete();
      if (dbNames.length === 1) {
        localStorage.removeItem('selectedDbName');
        localStorage.removeItem('dbNames');
        this.showDbNameEntering$.next(true);
      } else {
        const deleteIndex = dbNames.indexOf(dbName);
        dbNames.splice(deleteIndex, 1);
        localStorage.setItem('selectedDbName', dbNames[0]);
        localStorage.setItem('dbNames', JSON.stringify(dbNames));
        this.dbNames$.next(dbNames);
        this.db = new Db(dbNames[0]);
      }
    }
  }

  private countTotals(): void {
    if (!this.selectedDate$.value) {
      return;
    }

    const startDate = new Date(this.selectedDate$.value);
    const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));
    this.db?.expenses
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

  private initDb(): void {
    const dbNamesString = localStorage.getItem('dbNames');
    const selectedDbName = localStorage.getItem('selectedDbName');

    // Если в сторе не сохранено имя выбранной базы
    if (!selectedDbName ) {
      // Если в сторе не сохранен список баз, то даем ввести имя новой базы
      if (!dbNamesString) {
        this.showDbNameEntering$.next(true);
      // Если в сторе сохранен список баз, то делаем выбранной первую из них
      } else {
        const dbNames = JSON.parse(dbNamesString);
        const selectedDbName = dbNames[0];
        localStorage.setItem('selectedDbName', selectedDbName);
        this.db = new Db(selectedDbName);
        this.dbNames$.next(dbNames);
      }
    // Если в сторе сохранено имя выбранной базы
    } else {
      // Если в сторе не сохранен список баз, то сохраняем его
      if (!dbNamesString) {
        const dbNamesString = JSON.stringify([selectedDbName]);
        localStorage.setItem('dbNames', dbNamesString);
        this.dbNames$.next([selectedDbName]);
      // Если в сторе сохранен список баз, то обновляем сабджект
      } else {
        const dbNames = JSON.parse(dbNamesString);
        this.dbNames$.next(dbNames);
      }
      this.db = new Db(selectedDbName);
    }
  }
}
