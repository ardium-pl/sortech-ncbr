import { Component, inject, computed } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { LOSTableColDefs } from './col-defs-los';
import {
  ColDef,
  ColGroupDef,
  CellValueChangedEvent,
  GridApi,
  GridReadyEvent,
  RowStyle,
  SizeColumnsToFitGridStrategy,
} from 'ag-grid-community'; // Column Definition Type Interface
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { HourlyDataService } from '../hourly-data.service';
import { SignalNode } from '@angular/core/primitives/signals';
import { Hour } from '../hour';

@Component({
  selector: 'app-length-of-stay',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './length-of-stay.component.html',
  styleUrl: './length-of-stay.component.scss',
})
export class LengthOfStayComponent {
  readonly hourlyDataService = inject(HourlyDataService);

  readonly ROW_HEIGHT = undefined;
  readonly HEADER_HEIGHT = 70;
  readonly GROUP_HEADER_HEIGHT = 70;

  readonly defaultColDef: ColDef = {
    headerClass: 'grid-header grid-header-outer',
    cellDataType: 'number',
    cellClass: 'cell',
    // wrapHeaderText: true,
    // autoHeaderHeight: true,
    sortable: false,
    resizable: true,
    // wrapText: true,
    // autoHeight: true,
    minWidth: 100,
    flex: 1,
  };

  readonly columnDefs: (ColDef | ColGroupDef)[] = LOSTableColDefs;
  readonly rowData = computed(() => this.hourlyDataService.rowData());

  onCellValueChanged(event: CellValueChangedEvent) {
    // Get the changed row (=hour)
    let changedHour: Hour = event.data;
    // Apply calculations
    changedHour = this.hourlyDataService.applyHourCalculations(changedHour);
    // Update main signal
    this.hourlyDataService.updateHours(changedHour);
    // this.hourlyDataService.applySummaryCalcuations();
    this.hourlyDataService.applySummaryCalcuationsForPinnedRows();
  }

  private api!: GridApi;
  onGridReady = (event: GridReadyEvent) => {
    // Store the api for later use
    this.api = event.api;

    // Apply calculations
    this.rowData().forEach((hour) => {
      const updatedHour = this.hourlyDataService.applyHourCalculations(hour);
      // Update main signal
      this.hourlyDataService.updateHours(updatedHour);
    });
    this.hourlyDataService.applySummaryCalcuationsForPinnedRows();
  };
}
