import { Injectable } from '@angular/core';
import { Category, DbInfo, Expense, Settings, TotalsItem } from '../models/models';
import { BehaviorSubject } from 'rxjs';
import { TemplatePortal } from '@angular/cdk/portal';
import { Db } from '../db/db';
import { liveQuery } from 'dexie';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  categories$ = liveQuery(async () => await (this.db ? this.db.categories.toArray() : []));
  categoryExpenses$ = new BehaviorSubject<Expense[]>([]);
  db: Db | null = null;
  dbs$ = new BehaviorSubject<DbInfo[]>([]);
  expenses$ = liveQuery(async () => await (this.db ? this.db.expenses.toArray() : []));
  selectedDate$ = new BehaviorSubject<Date | null>(null);
  selectedDb$ = new BehaviorSubject<DbInfo | null>(null);
  selectedTabId$ = new BehaviorSubject<number>(0);
  settings$ = new BehaviorSubject<Settings>({
    lastSelectedDate: null,
    useLastSelectedDate: true,
    lastSelectedCategory: null,
    useLastSelectedCategory: false,
    switchWhenAddingDb: false,
    currentDefaultColor: 0
  });
  showDbNameEntering$ = new BehaviorSubject<boolean>(false);
  templatePortal$ = new BehaviorSubject<TemplatePortal | null>(null);
  totals$ = new BehaviorSubject<TotalsItem[]>([]);
  totalsSelectedCategory$ = new BehaviorSubject<TotalsItem | null>(null);
  readonly defaultColors: string[] = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#800000', '#008000', '#000080', '#808000', '#800080', '#008080',
    '#000000', '#808080'
  ];

  constructor(private messageService: MessageService) {
    this.initDb();
    this.initSettings();
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

  addCategory(name: string, color: string | null): void {
    if (!color) {
      let currentDefaultColor = this.settings$.value.currentDefaultColor;

      if (currentDefaultColor === this.defaultColors.length) {
        currentDefaultColor = 0;
      }

      color = this.defaultColors[currentDefaultColor];
      currentDefaultColor++;

      this.updateSettings({
        ...this.settings$.value,
        currentDefaultColor: currentDefaultColor
      });
    }

    this.db?.categories.add({ name, color } as Category).then(() => {
      this.messageService.add({
        severity: 'success',
        detail: `Добавлена новая категория "${name}"`
      });
    });
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
    this.db?.categories.get(category.id).then((categoryToUpdate) => {
      if (this.db && categoryToUpdate) {
        this.db.categories.update(category.id, category);

        if (categoryToUpdate.name !== category.name) {
          this.messageService.add({
            severity: 'success',
            detail: `Категория "${categoryToUpdate?.name}" переименована в "${category.name}"`
          });
        }

        if (categoryToUpdate.color !== category.color) {
          this.messageService.add({
            severity: 'success',
            detail: `Цвет категории "${category.name}" изменен`
          });
        }
      }
    });
  }

  setNewDbName(dbName: string): void {
    const newDb: DbInfo = { id: (new Date()).getTime(), name: dbName };
    const dbsString = JSON.stringify([newDb]);
    localStorage.setItem('dbs', dbsString);
    localStorage.setItem('selectedDb', JSON.stringify(newDb));
    this.dbs$.next([newDb]);
    this.selectedDb$.next(newDb);
    this.db = new Db(newDb.id.toString());
    this.showDbNameEntering$.next(false);
  }

  addDb(dbName: string): void {
    const newDb: DbInfo = { id: (new Date()).getTime(), name: dbName };
    const dbs = this.dbs$.value;
    dbs.push(newDb);
    localStorage.setItem('dbs', JSON.stringify(dbs));
    this.dbs$.next(dbs);

    if (this.settings$.value.switchWhenAddingDb) {
      localStorage.setItem('selectedDb', JSON.stringify(newDb));
      this.selectedDb$.next(newDb);
      this.db = new Db(newDb.id.toString());
      this.messageService.add({
        severity: 'success',
        detail: `Добавлена новая база "${dbName}" и переключено на нее`
      });
    } else {
      this.messageService.add({
        severity: 'success',
        detail: `Добавлена новая база "${dbName}"`
      });
    }
  }

  loadDb(db: DbInfo): void {
    localStorage.setItem('selectedDb', JSON.stringify(db));
    this.selectedDb$.next(db);
    this.db = new Db(db.id.toString());

    this.messageService.add({
      severity: 'success',
      detail: `Переключено на базу "${db.name}"`
    });
  }

  deleteDb(): void {
    if (!this.db) {
      return;
    }

    const dbs = this.dbs$.value;
    const foundDb = dbs.find((i) => i.id.toString() === this.db?.name);

    if (!foundDb) {
      return;
    }

    this.db.delete();

    if (dbs.length === 1) {
      localStorage.removeItem('selectedDb');
      localStorage.removeItem('dbs');
      this.dbs$.next([]);
      this.selectedDb$.next(null);
      this.showDbNameEntering$.next(true);
      this.messageService.add({
        severity: 'success',
        detail: `База "${foundDb.name}" удалена`
      });
    } else {
      dbs.splice(dbs.indexOf(foundDb), 1);
      localStorage.setItem('dbs', JSON.stringify(dbs));
      localStorage.setItem('selectedDb', JSON.stringify(dbs[0]));
      this.dbs$.next(dbs);
      this.selectedDb$.next(dbs[0]);
      this.db = new Db(dbs[0].id.toString());
      this.messageService.add({
        severity: 'success',
        detail: `База "${foundDb.name}" удалена. Переключено на базу "${dbs[0].name}"`
      });
    }
  }

  renameDb(db: DbInfo): void {
    const dbs = this.dbs$.value;
    const foundDb = dbs.find((i) => i.id === db.id);
    let currentName = '';

    if (foundDb) {
      currentName = foundDb.name;
      foundDb.name = db.name;
    }

    localStorage.setItem('dbs', JSON.stringify(dbs));
    this.dbs$.next(dbs);

    if (this.selectedDb$.value?.id === db.id) {
      localStorage.setItem('selectedDb', JSON.stringify(db));
      this.selectedDb$.next(db);
    }

    this.messageService.add({
      severity: 'success',
      detail: `База "${currentName}" переименована в "${db.name}"`
    });
  }

  updateSettings(settings: Settings): void {
    this.settings$.next(settings);
    localStorage.setItem('settings', JSON.stringify(settings));
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
    const dbsString = localStorage.getItem('dbs');
    const selectedDbString = localStorage.getItem('selectedDb');

    // Если в сторе не сохранено имя выбранной базы
    if (!selectedDbString ) {
      // Если в сторе не сохранен список баз, то даем ввести имя новой базы
      if (!dbsString) {
        this.showDbNameEntering$.next(true);
      // Если в сторе сохранен список баз, то делаем выбранной первую из них
      } else {
        const dbs = JSON.parse(dbsString) as DbInfo[];
        const selectedDb = dbs[0];
        localStorage.setItem('selectedDb', JSON.stringify(selectedDb));
        this.db = new Db(selectedDb.id.toString());
        this.dbs$.next(dbs);
        this.selectedDb$.next(selectedDb);
      }
    // Если в сторе сохранено имя выбранной базы
    } else {
      const selectedDb = JSON.parse(selectedDbString) as DbInfo;
      this.db = new Db(selectedDb.id.toString());
      // Если в сторе не сохранен список баз, то сохраняем его
      if (!dbsString) {
        localStorage.setItem('dbss', JSON.stringify([selectedDb]));
        this.dbs$.next([selectedDb]);
        this.selectedDb$.next(selectedDb);
      // Если в сторе сохранен список баз, то обновляем сабджект
      } else {
        const dbs = JSON.parse(dbsString) as DbInfo[];
        this.dbs$.next(dbs);
        this.selectedDb$.next(selectedDb);
      }
    }
  }

  private initSettings(): void {
    const settingsString = localStorage.getItem('settings');
    if (settingsString) {
      const settings = JSON.parse(settingsString) as Settings;
      this.settings$.next(settings);
    }
  }
}
