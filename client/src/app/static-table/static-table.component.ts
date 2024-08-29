import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellValueChangedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { StaticRow } from '../interfaces/static-row';
import { StaticDataService } from '../static-data.service';
import { numberRoundingFormatter } from '../utils/utils';
import { columnDefs } from './col-defs-static';

@Component({
  selector: 'app-static-table',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './static-table.component.html',
  styleUrl: './static-table.component.scss',
})
export class StaticTableComponent {
  readonly staticDataService = inject(StaticDataService);

  readonly defaultColDef: ColDef = {
    headerClass: 'grid-header grid-header-outer',
    cellDataType: 'number',
    sortable: false,
    resizable: true,
    cellRenderer: numberRoundingFormatter,
    editable: ({ data }) => data['id'] < 9,
  };

  readonly columnDefs = columnDefs(this.staticDataService.waskieGardlo);
  readonly rowData = this.staticDataService.rowData;

  onCellValueChanged(event: CellValueChangedEvent) {
    // Get the changed row (=hour)
    const changedRow: StaticRow = event.data;
    // Apply calculations & update main signal
    this.staticDataService.applyRowCalculations(this.rowData().slice(0, 9), changedRow);
  }

  private api!: GridApi;
  onGridReady = (event: GridReadyEvent) => {
    // Store the api for later use
    this.api = event.api;

    // Apply calculations
    this.staticDataService.applyRowCalculations(this.rowData().slice(0, 9), this.rowData()[1]);
  };
}
