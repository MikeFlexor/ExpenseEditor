import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ViewContainerRef } from '@angular/core';
import { NavigateService } from '../../services/navigate.service';

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
  constructor(private navigateService: NavigateService) {}

  ngAfterViewInit(): void {
    this.navigateService.setTemplatePortal(null);
  }
}
