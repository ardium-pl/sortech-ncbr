import { Component } from '@angular/core';
import { ILoadingOverlayAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-warning-container',
  standalone: true,
  imports: [],
  templateUrl: './warning-container.component.html',
  styleUrl: './warning-container.component.scss',
})
export class WarningContainerComponent implements ILoadingOverlayAngularComp {
  agInit(): void {}
}
