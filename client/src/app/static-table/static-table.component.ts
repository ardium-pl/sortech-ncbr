import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellValueChangedEvent, ColDef, ColGroupDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { StaticRow } from '../interfaces/static-row';
import { StaticDataService } from '../static-data.service';
import { markBottleneckAndRoundFormatter } from '../utils';
import { staticTableColDefs } from './col-defs-static';

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
  readonly HEADER_HEIGHT = 60;
  readonly GROUP_HEADER_HEIGHT = 55;

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
