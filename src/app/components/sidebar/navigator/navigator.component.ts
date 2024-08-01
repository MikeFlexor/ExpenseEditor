import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Tab } from '../../../models/models';
import { NavigateService } from '../../../services/navigate.service';

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
    { id: 0, label: 'Список расходов' },
    { id: 1, label: 'Сводная таблица' },
    { id: 2, label: 'Настройки' },
  ];

  constructor(private navigateService: NavigateService) {}

  isSelectedTab(id: number) {
    return this.navigateService.selectedTabId$.value === id;
  }

  onTabClick(id: number): void {
    this.navigateService.setSelectedTabId(id);
  }
}
