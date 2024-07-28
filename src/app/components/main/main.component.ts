import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ExpenseDetailsData, ExpenseItem } from '../../models/models';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ExpenseDetailsComponent } from './expense-details/expense-details.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    InputTextModule
  ],
  providers: [DialogService],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnDestroy {
  dialogRef: DynamicDialogRef | undefined;

  constructor(
    public dataService: DataService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef
  ) {}

  onAddClick(): void {
    this.openDetailsWindow(undefined);
  }

  ngOnDestroy() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  onRowClick(item: ExpenseItem): void {
    this.openDetailsWindow(item);
  }

  private openDetailsWindow(item: ExpenseItem | undefined): void {
    // Открываем окно подробностей по трате
    this.dialogRef = this.dialogService.open(ExpenseDetailsComponent, {
      data: item,
      header: item === undefined ? 'Добавить трату' : 'Изменить трату',
      focusOnShow: false
    });

    // Действия при закрытии окна подробностей по трате
    this.dialogRef.onClose.subscribe((data: ExpenseDetailsData) => {
      // Если просто закрыли окно, то ничего не делаем
      if (data === undefined) {
        return;
      }
      // Если передан признак удаления, то удаляем трату
      if (data.delete) {
        if (item) {
          this.dataService.deleteExpense(item);
        }
      } else if (data.expense) {
        // Если при открытии окна передали данные по трате, то изменяем его значения
        if (item) {
          data.expense.id = item.id;
          this.dataService.changeExpense(data.expense);
        // Если при открытии окна не передали данные по трате, то добавляем новую трату
        } else {
          this.dataService.addExpense(data.expense);
        }
      }

      this.cdr.markForCheck();
      this.dataService.saveData();
    });
  }
}
