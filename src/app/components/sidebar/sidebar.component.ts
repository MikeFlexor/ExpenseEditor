import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { CdkPortalOutlet, PortalModule } from '@angular/cdk/portal';
import { NavigatorComponent } from "./navigator/navigator.component";
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    PortalModule,
    NavigatorComponent
],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  @ViewChild(CdkPortalOutlet) portalHost!: CdkPortalOutlet;

  constructor(public dataService: DataService) {}
}
