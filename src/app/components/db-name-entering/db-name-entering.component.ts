import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-db-name-entering',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './db-name-entering.component.html',
  styleUrl: './db-name-entering.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DbNameEnteringComponent {
  dbName: string = '';

  constructor(private dataService: DataService) {}

  onAcceptClick(): void {
    this.dataService.setNewDbName(this.dbName);
  }
}
