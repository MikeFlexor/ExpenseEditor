import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { PivotTableComponent } from './components/pivot-table/pivot-table.component';
import { SettingsComponent } from './components/settings/settings.component';
import { DataService } from './services/data.service';
import { DbNameEnteringComponent } from './components/db-name-entering/db-name-entering.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    SidebarComponent,
    ExpenseListComponent,
    PivotTableComponent,
    SettingsComponent,
    DbNameEnteringComponent,
    ConfirmDialogModule,
    ToastModule
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [ConfirmationService, MessageService, DataService]
})
export class AppComponent {
  title = 'Expense editor';

  constructor(
    public dataService: DataService,
    private primengConfig: PrimeNGConfig
  ) {
    this.primengConfig.setTranslation({
      firstDayOfWeek: 1,
      dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
      dayNamesShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
      monthNamesShort: ["Янв", "Февр", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сент", "Окт", "Нояб", "Дек"],
      today: 'Сегодня'
    });
  }
}
