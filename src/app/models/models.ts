export interface Tab {
  id: number;
  label: string;
  route: string;
}

export interface Expense {
  id: number;
  date: Date;
  category: Category;
  price: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface ExpenseDetailsData {
  expense: Expense | undefined;
  delete: boolean | undefined;
}

export interface SavedData {
  categories: Category[];
  expenses: Expense[];
}

export interface PivotTableItem {
  category: Category;
  total: number;
}
