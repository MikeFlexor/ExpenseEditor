import Dexie, { Table } from 'dexie';
import { Category, Expense } from '../models/models';

export class Db extends Dexie {
  categories!: Table<Category, number>;
  expenses!: Table<Expense, number>;

  constructor(dbName: string) {
    super(dbName);

    this.version(1).stores({
      categories: '++id',
      expenses: '++id'
    });

    this.on('populate');
  }
}
