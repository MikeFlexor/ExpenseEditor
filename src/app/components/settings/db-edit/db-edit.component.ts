import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DbInfo } from '../../../models/models';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-db-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    ToastModule
  ],
  templateUrl: './db-edit.component.html',
  styleUrl: './db-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DbEditComponent {
  @Output() addDb = new EventEmitter<string>();
  @Input() set currentDb(value: DbInfo | null) {
    this.selectedDb = value;
    this._currentDb = value;
  };
  get currentDb() {
    return this._currentDb;
  }
  dbName: string = '';
  @Input() dbs: DbInfo[] = [];
  @Output() deleteDb = new EventEmitter();
  @Output() loadDb = new EventEmitter<DbInfo>();
  @Output() renameDb = new EventEmitter<DbInfo>();
  selectedDb: DbInfo | null = null;
  @Input() switchWhenAddingDb: boolean = false;
  @Output() switchWhenAddingDbChange = new EventEmitter<boolean>();
  private _currentDb: DbInfo | null = null;

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  onAddClick(): void {
    const existDb = this.dbs.find((i) => i.name === this.dbName);
    // Если уже есть база с таким именем
    if (existDb) {
      this.messageService.add({
        severity: 'warn',
        detail: `База с именем "${this.dbName}" уже существует. Введите другое имя`
      });
    } else {
      this.confirmationService.confirm({
        message: `Вы хотите добавить новую базу "${this.dbName}"?`,
        accept: () => {
          this.addDb.emit(this.dbName);
          this.dbName = '';
        }
      });
    }
  }

  onLoadClick(): void {
    if (this.selectedDb) {
      this.loadDb.emit(this.selectedDb);
    }
  }

  onDeleteClick(): void {
    this.confirmationService.confirm({
      message: `Вы хотите удалить текущую базу "${this.currentDb?.name}"?`,
      accept: () => {
        this.deleteDb.emit();
      }
    });
  }

  onRenameClick(): void {
    const existDb = this.dbs.find((i) => i.name === this.dbName);
    // Если уже есть база с таким именем
    if (existDb) {
      this.messageService.add({
        severity: 'warn',
        detail: `База с именем "${this.dbName}" уже существует. Введите другое имя`
      });
    } else {
      this.confirmationService.confirm({
        message: `Вы хотите переименовать текущую базу "${this.currentDb?.name}" в "${this.dbName}"?`,
        accept: () => {
          if (this.selectedDb && this.dbName.length) {
            const db: DbInfo = {
              id: this.selectedDb.id,
              name: this.dbName
            };
            this.selectedDb = db;
            this.renameDb.emit(db);
            this.dbName = '';
          }
        }
      });
    }
  }

  onSwitchWhenAddingDbChange(): void {
    this.switchWhenAddingDbChange.emit(this.switchWhenAddingDb);
  }
}
