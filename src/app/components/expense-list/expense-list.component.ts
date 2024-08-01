import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { ExpenseDetailsData, Expense } from '../../models/models';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ExpenseDetailsComponent } from './expense-details/expense-details.component';
import { DataService } from '../../services/data.service';
import { TemplatePortal } from '@angular/cdk/portal';
import { PortalService } from '../../services/portal.service';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    InputTextModule
  ],
  providers: [DialogService],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseListComponent implements AfterViewInit, OnDestroy {
  dialogRef: DynamicDialogRef | undefined;
  @ViewChild('portalContent') portalContent: TemplateRef<unknown> | undefined;

  constructor(
    public dataService: DataService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
    private portalService: PortalService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngAfterViewInit(): void {
    if (this.portalContent) {
      this.portalService.setTemplatePortal(
        new TemplatePortal(this.portalContent, this.viewContainerRef)
      );
    }
  }

  onAddClick(): void {
    this.openDetailsWindow(undefined);
  }

  ngOnDestroy() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  onRowClick(item: Expense): void {
    this.openDetailsWindow(item);
  }

  private openDetailsWindow(item: Expense | undefined): void {
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
