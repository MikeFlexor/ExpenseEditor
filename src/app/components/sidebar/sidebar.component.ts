import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { CdkPortalOutlet, PortalModule } from '@angular/cdk/portal';
import { PortalService } from '../../services/portal.service';
import { NavigatorComponent } from "./navigator/navigator.component";

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

  constructor(public portalService: PortalService) {}
}
