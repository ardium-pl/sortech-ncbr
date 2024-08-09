import { Component, inject, computed } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import { staticTableColDefs, numberRoundingFormatter } from './col-defs-static';
import {
  ColDef,
  ColGroupDef,
  CellValueChangedEvent,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community'; // Column Definition Type Interface
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
    cellClass: 'cell',
    // wrapHeaderText: true,
    // autoHeaderHeight: true,
    sortable: false,
    resizable: true,
    // wrapText: true,
    // autoHeight: true,
    minWidth: 100,
    flex: 1,
    cellRenderer: (params: any) => numberRoundingFormatter(params),
    editable: ({ data }) => data['id'] < 10,
  };

  readonly columnDefs: (ColDef | ColGroupDef)[] = staticTableColDefs;
  readonly rowData = computed(() => this.staticDataService.rowData());

  onCellValueChanged(event: CellValueChangedEvent) {
    // Get the changed row (=hour)
    let changeRow: StaticRow = event.data;
    // Apply calculations & update main signal
    this.staticDataService.applyRowCalculations(this.rowData(), changeRow);
  }

  private api!: GridApi;
  onGridReady = (event: GridReadyEvent) => {
    // Store the api for later use
    this.api = event.api;

    // Apply calculations
    this.staticDataService.applyRowCalculations(this.rowData(), this.rowData()[1]);
    console.log(this.rowData()[11]);

  };
}
