import { Component, inject, computed } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { LOSTableColDefs } from './col-defs-los';
import { numberRoundingFormatter } from '../utils';
import { ColDef, ColGroupDef, CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { HourlyDataService } from '../hourly-data.service';
import { Hour } from '../interfaces/hour';
import { min } from 'rxjs';

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
    cellRenderer: numberRoundingFormatter,
  };

  readonly delayColumn: ColDef = {
    headerName: 'opóźnienie',
    field: 'opoznienieOgolem',
    headerClass: 'grid-header grid-header-outer opoznienie-ogolem',
    cellClass: ({ data }) => ['cell', 'opoznienie-ogolem', data['id'] === 23 ? 'bottom' : ''],
    cellStyle: ({ value }) => {
      if (value === null || value === undefined || typeof value === 'string') return undefined;
      const styles: any = {};

      const minValue = this.hourlyDataService.minValue();
      const maxValue = this.hourlyDataService.maxValue();
      const step = (maxValue - minValue) / 12;

      if (value < minValue + step) {
        styles.backgroundColor = 'rgb(150, 0, 0)'; // Maroon
      } else if (value < minValue + 2 * step) {
        styles.backgroundColor = 'rgb(180, 0, 0)'; // Dark Red
      } else if (value < minValue + 3 * step) {
        styles.backgroundColor = 'rgb(255, 0, 0)'; // Red
      } else if (value < minValue + 4 * step) {
        styles.backgroundColor = 'rgb(255, 69, 0)'; // Light Red
      } else if (value < minValue + 5 * step) {
        styles.backgroundColor = 'rgb(255, 140, 0)'; // Light Orange
      } else if (value < minValue + 6 * step) {
        styles.backgroundColor = 'rgb(255, 165, 0)'; // Orange
      } else if (value < minValue + 7 * step) {
        styles.backgroundColor = 'rgb(255, 215, 0)'; // Gold
      } else if (value < minValue + 8 * step) {
        styles.backgroundColor = 'rgb(255, 255, 0)'; // Yellow
      } else if (value < minValue + 9 * step) {
        styles.backgroundColor = 'rgb(173, 255, 47)'; // Yellow-Green
      } else if (value < minValue + 10 * step) {
        styles.backgroundColor = 'rgb(50, 205, 50)'; // Light Green
      } else if (value < minValue + 11 * step) {
        styles.backgroundColor = 'rgb(40, 150, 40)'; // Green
      } else if (value <= maxValue) {
        styles.backgroundColor = 'rgb(20, 120, 20)'; // Dark Green
      }

      return styles;
    },
  };
  readonly columnDefs: (ColDef | ColGroupDef)[] = [...LOSTableColDefs, this.delayColumn];
  readonly rowData = computed(() => this.hourlyDataService.rowData());

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

    // Apply calculations
    this.hourlyDataService.applyHourCalculations(this.rowData());
    this.hourlyDataService.applySummaryCalcuationsForPinnedRows();
  };
}
