import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldsetModule } from 'primeng/fieldset';
import { DataService } from '../../services/data.service';
import { CategoryEditComponent } from "./category-edit/category-edit.component";
import { Category, DbInfo } from '../../models/models';
import { DbEditComponent } from "./db-edit/db-edit.component";
import { GeneralSettingsComponent } from './general-settings/general-settings.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FieldsetModule,
    GeneralSettingsComponent,
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

  onCategoryChange(category: Category): void {
    this.dataService.updateCategory(category);
  }

  onDbAdd(dbName: string): void {
    this.dataService.addDb(dbName);
  }

  onDbDelete(): void {
    this.dataService.deleteDb();
  }

  onDbLoad(dbInfo: DbInfo): void {
    this.dataService.loadDb(dbInfo);
  }

  onDbRename(dbInfo: DbInfo): void {
    this.dataService.renameDb(dbInfo);
  }

  onSwitchWhenAddingDbChange(value: boolean): void {
    this.dataService.setSwitchWhenAddingDb(value);
  }
}
