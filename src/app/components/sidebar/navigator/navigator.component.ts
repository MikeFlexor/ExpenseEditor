import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Tab } from '../../../models/models';

@Component({
  selector: 'app-navigator',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule
  ],
  templateUrl: './navigator.component.html',
  styleUrl: './navigator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigatorComponent {
  readonly tabs: Tab[] = [
    { id: 0, label: 'Список расходов', route: 'expenselist', selected: true },
    { id: 1, label: 'Сводная таблица', route: 'pivottable' },
    { id: 2, label: 'О программе', route: 'about' },
  ];

  constructor(private router: Router) {}

  onTabClick(id: number): void {
    const foundTab = this.tabs.find((i) => i.id === id);

    if (foundTab !== undefined) {
      for (const tab of this.tabs) {
        tab.selected = false;
      }
      foundTab.selected = true;
      this.router.navigate([foundTab.route]);
    }
  }
}
