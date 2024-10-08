export interface Tab {
  id: number;
  label: string;
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

export interface TotalsItem {
  category: Category;
  total: number;
}

export interface DbInfo {
  id: number;
  name: string;
}

export interface Settings {
  lastSelectedDate: Date | null;
  useLastSelectedDate: boolean;
  lastSelectedCategory: Category | null;
  useLastSelectedCategory: boolean;
  switchWhenAddingDb: boolean;
}
