import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { DataService } from '../../services/data.service';
import { CategoryEditComponent } from "./category-edit/category-edit.component";
import { Category } from '../../models/models';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FieldsetModule,
    CategoryEditComponent
],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements AfterViewInit {
  constructor(public dataService: DataService) {}

  ngAfterViewInit(): void {
    this.dataService.setTemplatePortal(null);
  }

  onCategoryChange(category: Category): void {
    this.dataService.updateCategory(category);
  }
}
