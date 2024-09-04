import { Component, inject } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellValueChangedEvent, ColDef, ColGroupDef } from 'ag-grid-community';
import { HourlyDataService } from '../hourly-data.service';
import { Hour } from '../interfaces/hour';
import { getColorRangeClass } from '../utils/color-range';
import { numberRoundingFormatter } from '../utils/utils';
import { LOSTableColDefs } from './col-defs-los';
import { DataFetchingService } from '../data-fetching.service';
import { WarningContainerComponent } from "../warning-container/warning-container.component";

@Component({
  selector: 'app-length-of-stay',
  standalone: true,
  imports: [AgGridAngular, WarningContainerComponent],
  templateUrl: './length-of-stay.component.html',
  styleUrl: './length-of-stay.component.scss',
})
export class LengthOfStayComponent {
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
    cellRenderer: numberRoundingFormatter,
  };

  readonly delayColumn: ColDef = {
    headerName: 'Opóźnienie ogółem',
    field: 'opoznienieOgolem',
    headerClass: 'grid-header grid-header-outer opoznienie-ogolem',
    minWidth: 150,
    cellClass: ({ data, value }) => {
      return [
        'cell',
        'opoznienie-ogolem',
        data['id'] === 23 ? 'bottom' : '',
        getColorRangeClass(value, this.hourlyDataService.minValue(), this.hourlyDataService.maxValue()),
      ];
    },
  };
  readonly columnDefs: (ColDef | ColGroupDef)[] = [...LOSTableColDefs, this.delayColumn];
  readonly rowData = this.hourlyDataService.rowData;

  onCellValueChanged(event: CellValueChangedEvent) {
    const changedHour: Hour = event.data;
    this.hourlyDataService.applyHourCalculations(this.rowData(), changedHour);
  }

  onGridReady() {
    this.hourlyDataService.applyHourCalculations(this.rowData());
  }
}
