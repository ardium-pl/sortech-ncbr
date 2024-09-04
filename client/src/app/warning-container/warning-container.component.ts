import { Component } from '@angular/core';
import { INoRowsOverlayAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-warning-container',
  standalone: true,
  imports: [],
  templateUrl: './warning-container.component.html',
  styleUrl: './warning-container.component.scss',
})
export class WarningContainerComponent implements INoRowsOverlayAngularComp {
  agInit(): void {}
}
