import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellValueChangedEvent, ColDef, ColGroupDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { HourlyDataService } from '../hourly-data.service';
import { Hour } from '../interfaces/hour';
import { numberRoundingFormatter } from '../utils/utils';
import { LOSTableColDefs } from './col-defs-los';

const COLOR_MAP = [
  'rgb(20, 120, 20)', // Dark Green
  'rgb(20, 120, 20)', // Green
  'rgb(50, 205, 50)', // Light Green
  'rgb(173, 255, 47)', // Yellow-Green
  'rgb(255, 255, 0)', // Yellow
  'rgb(255, 215, 0)', // Gold
  'rgb(255, 165, 0)', // Orange
  'rgb(255, 140, 0)', // Light Orange
  'rgb(255, 69, 0)', // Light Red
  'rgb(255, 0, 0)', // Red
  'rgb(180, 0, 0)', // Dark Red
  'rgb(150, 0, 0)', // Maroon
];

@Component({
  selector: 'app-length-of-stay',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './length-of-stay.component.html',
  styleUrl: './length-of-stay.component.scss',
})
export class LengthOfStayComponent {
  readonly hourlyDataService = inject(HourlyDataService);

  readonly defaultColDef: ColDef = {
    headerClass: 'grid-header grid-header-outer',
    cellDataType: 'number',
    cellClass: 'cell',
    sortable: false,
    resizable: true,
    minWidth: 100,
    flex: 1,
    cellRenderer: numberRoundingFormatter,
  };

  readonly delayColumn: ColDef = {
    headerName: 'Opóźnienie ogółem',
    field: 'opoznienieOgolem',
    headerClass: 'grid-header grid-header-outer opoznienie-ogolem',
    cellClass: ({ data }) => ['cell', 'opoznienie-ogolem', data['id'] === 23 ? 'bottom' : ''],
    cellStyle: ({ value }) => {
      if (value === null || value === undefined || typeof value === 'string') return undefined;
      const styles: any = {};

      const minValue = this.hourlyDataService.minValue();
      const maxValue = this.hourlyDataService.maxValue();
      const step = (maxValue - minValue) / COLOR_MAP.length;

      value -= minValue;
      value /= step;
      value = Math.floor(value);
      value = Math.min(value, maxValue);
      value = Math.max(value, minValue);

      styles.backgroundColor = COLOR_MAP[value];

      return styles;
    },
    minWidth: 150,
  };
  readonly columnDefs: (ColDef | ColGroupDef)[] = [...LOSTableColDefs, this.delayColumn];
  readonly rowData = this.hourlyDataService.rowData;

  onCellValueChanged(event: CellValueChangedEvent) {
    // Get the changed row (=hour)
    const changedHour: Hour = event.data;
    // Apply calculations & update main signal
    this.hourlyDataService.applyHourCalculations(this.rowData(), changedHour);
  }

  private api!: GridApi;
  onGridReady = (event: GridReadyEvent) => {
    // Store the api for later use
    this.api = event.api;

    // Apply calculations
    this.hourlyDataService.applyHourCalculations(this.rowData());
  };
}
