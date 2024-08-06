import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './label.component.html',
  styleUrl: './label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelComponent {
  @Input() text: string = '';
}
