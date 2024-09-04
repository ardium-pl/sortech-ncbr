import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellValueChangedEvent, ColDef, ColGroupDef } from 'ag-grid-community';
import { HourlyDataService } from '../hourly-data.service';
import { Hour } from '../interfaces/hour';
import { hourlyTableColDefs } from './col-defs-hourly';
import { DataFetchingService } from '../data-fetching.service';
import { WarningContainerComponent } from '../warning-container/warning-container.component';


@Component({
  selector: 'app-hourly-table',
  standalone: true,
  imports: [AgGridAngular, WarningContainerComponent],
  templateUrl: './hourly-table.component.html',
  styleUrl: './hourly-table.component.scss',
})
export class HourlyTableComponent {
  readonly hourlyDataService = inject(HourlyDataService);
  readonly dataFetchingService = inject(DataFetchingService);

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
  readonly summaryRowTop = this.hourlyDataService.summaryRowTop;
  readonly summaryRowBottom = this.hourlyDataService.summaryRowBottom;

  onCellValueChanged(event: CellValueChangedEvent) {
    const changedHour: Hour = event.data;
    this.hourlyDataService.applyHourCalculations(this.rowData(), changedHour);
  }
}
