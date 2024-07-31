import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'expenselist',
        loadComponent: async () => {
            return (await import('./components/expense-list/expense-list.component')).ExpenseListComponent;
        }
    },
    {
        path: 'pivottable',
        loadComponent: async () => {
            return (await import('./components/pivot-table/pivot-table.component')).PivotTableComponent;
        }
    },
    {
        path: 'about',
        loadComponent: async () => {
            return (await import('./components/about/about.component')).AboutComponent;
        }
    },
    {
        path: '**',
        loadComponent: async () => {
            return (await import('./components/expense-list/expense-list.component')).ExpenseListComponent;
        }
    }
];
