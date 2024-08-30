import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellValueChangedEvent, ColDef, ColGroupDef, GridReadyEvent } from 'ag-grid-community';
import { HourlyDataService } from '../hourly-data.service';
import { Hour } from '../interfaces/hour';
import { getColorRangeClass } from '../utils/color-range';
import { numberRoundingFormatter } from '../utils/utils';
import { LOSTableColDefs } from './col-defs-los';

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
    minWidth: 150,
    cellClass: ({ data, value }) => {
      return [
        'cell',
        'opoznienie-ogolem',
        data['id'] === 23 ? 'bottom' : '',
        getColorRangeClass(value, this.hourlyDataService.minValue(), this.hourlyDataService.maxValue()),
      ];
    },
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
