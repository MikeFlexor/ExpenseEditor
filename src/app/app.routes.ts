import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'main',
        loadComponent: async () => {
            return (await import('./components/main/main.component')).MainComponent;
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
            return (await import('./components/main/main.component')).MainComponent;
        }
    }
];
