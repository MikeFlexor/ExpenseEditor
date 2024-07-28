import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Tab } from '../../models/models';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly tabs: Tab[] = [
    { id: 0, label: 'Список расходов', route: 'main' },
    { id: 1, label: 'О программе', route: 'about' },
  ];

  constructor(private router: Router) {}

  onTabClick(id: number): void {
    const foundTab = this.tabs.find((i) => i.id === id);

    if (foundTab !== undefined) {
      this.router.navigate([foundTab.route]);
    }
  }
}
