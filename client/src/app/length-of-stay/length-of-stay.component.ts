import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellValueChangedEvent, ColDef, ColGroupDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { HourlyDataService } from '../hourly-data.service';
import { Hour } from '../interfaces/hour';
import { numberRoundingFormatter } from '../utils/utils';
import { LOSTableColDefs } from './col-defs-los';
import { COLOR_MAP } from '../constants';

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
      if (value === null || value === undefined || typeof value === 'string') {
        console.log('Value of opoznienieOgolem column cell is undefined');
        return undefined;
      }

      const minValue = this.hourlyDataService.minValue();
      const maxValue = this.hourlyDataService.maxValue();
      const step = (maxValue - minValue) / COLOR_MAP.length;

      value -= minValue;
      value /= step;
      value = Math.floor(value);
      value = Math.min(value, maxValue);
      value = Math.max(value, minValue);

      return { backgroundColor: COLOR_MAP[value] };
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
