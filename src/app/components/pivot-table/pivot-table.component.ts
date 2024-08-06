import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { TemplatePortal } from '@angular/cdk/portal';
import { CategoryDetailsComponent } from './category-details/category-details.component';
import { TotalsComponent } from './totals/totals.component';
import { LabelComponent } from "../label/label.component";

@Component({
  selector: 'app-pivot-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    TableModule,
    TotalsComponent,
    CategoryDetailsComponent,
    LabelComponent
],
  templateUrl: './pivot-table.component.html',
  styleUrl: './pivot-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PivotTableComponent implements AfterViewInit {
  emptyCategoryDetailsText: string = 'Выберите категорию для отображения списка трат по ней';
  emptyTotalsText: string = 'Выберите дату для отображения сводных данных';
  @ViewChild('portalContent') portalContent: TemplateRef<unknown> | undefined;

  constructor(
    public dataService: DataService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngAfterViewInit(): void {
    if (this.portalContent) {
      this.dataService.setTemplatePortal(
        new TemplatePortal(this.portalContent, this.viewContainerRef)
      );
    }
  }

  onDateChange(date: Date): void {
    this.dataService.setSelectedDate(date);
  }
}
