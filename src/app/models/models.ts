export interface Tab {
  id: number;
  label: string;
  route: string;
}

export interface ExpenseItem {
  id: number;
  date: Date;
  category: CategoryItem;
  price: number;
}

export interface CategoryItem {
  id: number;
  name: string;
}

export interface ExpenseDetailsData {
  expense: ExpenseItem | undefined;
  delete: boolean | undefined;
}

export interface SavedData {
  categories: CategoryItem[];
  expenses: ExpenseItem[];
}
