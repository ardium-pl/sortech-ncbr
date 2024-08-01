import { Component, inject, computed } from '@angular/core';
import { HourlyDataService } from '../hourly-data.service';
import { hourlyTableColDefs } from './col-defs-hourly';
import { AgGridAngular } from 'ag-grid-angular';
import { Hour } from '../hour';
import {
  ColDef,
  ColGroupDef,
  CellValueChangedEvent,
  GridApi,
  GridReadyEvent,
  RowStyle,
  SizeColumnsToFitGridStrategy,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

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
  readonly HEADER_HEIGHT = 70;
  readonly GROUP_HEADER_HEIGHT = 70;

  readonly defaultColDef: ColDef = {
    headerClass: 'grid-header grid-header-outer',
    cellDataType: 'number',
    wrapHeaderText: true,
    // autoHeaderHeight: true,
    sortable: false,
    resizable: true,
    minWidth: 130,
    flex: 1,
  };
  readonly columnDefs: (ColDef | ColGroupDef)[] = hourlyTableColDefs;
  readonly rowData = computed(() => this.hourlyDataService.rowData());

  onCellValueChanged(event: CellValueChangedEvent) {
    // Get the changed row (=hour)
    let changedHour: Hour = event.data;
    // Apply calculations
    changedHour = this.hourlyDataService.applyHourCalculations(changedHour);
    // Update main signal
    this.hourlyDataService.updateHours(changedHour);
    this.hourlyDataService.applySummaryCalcuations();
  }
}
