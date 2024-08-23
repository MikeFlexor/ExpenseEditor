import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-db-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './db-edit.component.html',
  styleUrl: './db-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DbEditComponent implements OnInit {
  @Input() dbNames: string[] = [];
  @Input() selectedDb: string | undefined = undefined;
  @Output() addDb = new EventEmitter<string>();
  @Output() changeDb = new EventEmitter<string>();
  @Output() deleteDb = new EventEmitter<string>();
  currentDb: string = '';
  dbName: string = '';

  ngOnInit(): void {
    if (this.selectedDb) {
      this.currentDb = this.selectedDb;
    }
  }

  onAddClick(): void {
    if (!this.dbNames.includes(this.dbName)) {
      this.addDb.emit(this.dbName);
      this.dbName = '';
    }
  }

  onChangeClick(): void {
    if (this.selectedDb) {
      this.changeDb.emit(this.selectedDb);
    }
  }

  onDeleteClick(): void {
    if (this.selectedDb) {
      this.deleteDb.emit(this.selectedDb);
    }
  }
}
