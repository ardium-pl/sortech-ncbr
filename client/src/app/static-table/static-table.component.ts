import { Component, inject, computed } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { staticTableColDefs } from './col-defs-static';
import { markBottleneckAndRoundFormatter } from '../utils';
import { ColDef, ColGroupDef, CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { StaticDataService } from '../static-data.service';
import { StaticRow } from '../interfaces/static-row';

@Component({
  selector: 'app-static-table',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './static-table.component.html',
  styleUrl: './static-table.component.scss',
})
export class StaticTableComponent {
  readonly staticDataService = inject(StaticDataService);

  readonly ROW_HEIGHT = undefined;
  readonly HEADER_HEIGHT = 70;
  readonly GROUP_HEADER_HEIGHT = 70;

  readonly defaultColDef: ColDef = {
    headerClass: 'grid-header grid-header-outer',
    cellDataType: 'number',
    sortable: false,
    resizable: true,
    minWidth: 100,
    flex: 1,
    cellRenderer: markBottleneckAndRoundFormatter,
    editable: ({ data }) => data['id'] < 9,
  };

  readonly columnDefs: (ColDef | ColGroupDef)[] = staticTableColDefs;
  readonly rowData = this.staticDataService.rowData;

  onCellValueChanged(event: CellValueChangedEvent) {
    // Get the changed row (=hour)
    const changedRow: StaticRow = event.data;
    // Apply calculations & update main signal
    this.staticDataService.applyRowCalculations(this.rowData(), changedRow);
  }

  private api!: GridApi;
  onGridReady = (event: GridReadyEvent) => {
    // Store the api for later use
    this.api = event.api;

    // Apply calculations
    this.staticDataService.applyRowCalculations(this.rowData(), this.rowData()[1]);
  };
}
