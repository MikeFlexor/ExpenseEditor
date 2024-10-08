import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule
  ],
  templateUrl: './general-settings.component.html',
  styleUrl: './general-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralSettingsComponent {
  constructor(public dataService: DataService) {}

  onUseLastSelectedCategoryChange(value: boolean): void {
    this.dataService.updateSettings({
      ...this.dataService.settings$.value,
      useLastSelectedCategory: value
    });
  }

  onUseLastSelectedDateChange(value: boolean): void {
    this.dataService.updateSettings({
      ...this.dataService.settings$.value,
      useLastSelectedDate: value
    });
  }
}
