import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellValueChangedEvent, ColDef, ColGroupDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { HourlyDataService } from '../hourly-data.service';
import { Hour } from '../interfaces/hour';
import { hourlyTableColDefs } from './col-defs-hourly';

@Component({
  selector: 'app-hourly-table',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './hourly-table.component.html',
  styleUrl: './hourly-table.component.scss',
})
export class HourlyTableComponent {
  readonly hourlyDataService = inject(HourlyDataService);

  readonly ROW_HEIGHT = undefined;
  readonly HEADER_HEIGHT = 55;
  readonly GROUP_HEADER_HEIGHT = 55;

  readonly defaultColDef: ColDef = {
    headerClass: 'grid-header grid-header-outer',
    cellDataType: 'number',
    cellClass: 'cell',
    sortable: false,
    resizable: true,
    minWidth: 100,
    flex: 1,
  };

  readonly columnDefs: (ColDef | ColGroupDef)[] = hourlyTableColDefs;
  readonly rowData = this.hourlyDataService.rowData;
  readonly summaryRow1 = this.hourlyDataService.summaryRow1;
  readonly summaryRow2 = this.hourlyDataService.summaryRow2;

  onCellValueChanged(event: CellValueChangedEvent) {
    // Get the changed row (=hour)
    let changedHour: Hour = event.data;
    // Apply calculations & update main signal
    this.hourlyDataService.applyHourCalculations(this.rowData(), changedHour);
    this.hourlyDataService.applySummaryCalcuationsForPinnedRows();
  }

  private api!: GridApi;
  onGridReady = (event: GridReadyEvent) => {
    // Store the api for later use
    this.api = event.api;
  };
}
