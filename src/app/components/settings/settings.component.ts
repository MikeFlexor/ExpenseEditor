import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements AfterViewInit {
  constructor(private dataService: DataService) {}

  ngAfterViewInit(): void {
    this.dataService.setTemplatePortal(null);
  }
}
