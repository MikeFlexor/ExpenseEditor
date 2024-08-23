import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { DataService } from '../../services/data.service';
import { CategoryEditComponent } from "./category-edit/category-edit.component";
import { Category } from '../../models/models';
import { DbEditComponent } from "./db-edit/db-edit.component";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FieldsetModule,
    CategoryEditComponent,
    DbEditComponent
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

  onDbAdd(dbName: string): void {
    this.dataService.addDb(dbName);
  }

  onCategoryChange(category: Category): void {
    this.dataService.updateCategory(category);
  }

  onDbChange(dbName: string): void {
    this.dataService.changeDb(dbName);
  }

  onDbDelete(dbName: string): void {
    this.dataService.deleteDb(dbName);
  }
}
