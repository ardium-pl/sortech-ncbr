import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellValueChangedEvent, ColDef, ICellRendererParams } from 'ag-grid-community';
import { StaticRow } from '../interfaces/static-row';
import { StaticDataService } from '../static-data.service';
import { numberRoundingFormatterNoZeros, percentFormatter } from '../utils/utils';
import { columnDefs } from './col-defs-static';
import { DataFetchingService } from '../data-fetching.service';
import { WarningContainerComponent } from "../warning-container/warning-container.component";

@Component({
  selector: 'app-static-table',
  standalone: true,
  imports: [AgGridAngular, WarningContainerComponent],
  templateUrl: './static-table.component.html',
  styleUrl: './static-table.component.scss',
})
export class StaticTableComponent {
  readonly staticDataService = inject(StaticDataService);
  readonly dataFetchingService = inject(DataFetchingService);

  readonly defaultColDef: ColDef = {
    headerClass: 'grid-header grid-header-outer',
    cellDataType: 'number',
    sortable: false,
    resizable: true,
    cellRenderer: (params: ICellRendererParams) => {
      if (params.data['id'] === 11) {
        return percentFormatter(params);
      } else {
        return numberRoundingFormatterNoZeros(params);
      }
    },
    editable: ({ data }) => data['id'] < 9,
  };
  readonly columnDefs = columnDefs(this.staticDataService.waskieGardlo);
  readonly rowData = this.staticDataService.rowData;

  onCellValueChanged(event: CellValueChangedEvent) {
    const changedRow: StaticRow = event.data;
    this.staticDataService.applyRowCalculations(this.rowData().slice(0, 9), changedRow);
  }
}
