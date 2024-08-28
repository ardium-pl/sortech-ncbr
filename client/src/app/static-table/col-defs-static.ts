import { Signal } from '@angular/core';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { WaskieGardlo } from '../interfaces/zasoby';

const ZASOBY_MIN_WIDTH = 120;
const OGRANICZENIA_PRZYJEC_MIN_WIDTH = 150;

export function columnDefs(waskieGardlo: Signal<WaskieGardlo>): (ColDef | ColGroupDef)[] {
  return [
    {
      headerName: 'Typ pacjenta',
      field: 'typPacjenta',
      headerClass: 'grid-header grid-header-outer typ-pacjenta',
      editable: false,
      cellClass: ({ data }) => [
        'typ-pacjenta',
        data['id'] < 8 ? 'part-of-table' : 'summary-row',
        data['id'] === 8 ? 'top' : '',
        data['id'] === 11 ? 'bottom' : '',
      ],
      colSpan: ({ data }) => (data['id'] < 8 ? 1 : 2),
      cellDataType: 'text',
      width: 220,
    },
    {
      headerName: 'Proc. \n pacj.',
      field: 'procPacjentow',
      headerClass: 'grid-header grid-header-outer proc-pacjentow',
      editable: false,
      cellClass: ({ data }) => [
        'proc-pacjentow',
        data['id'] < 8 ? 'part-of-table' : 'summary-row',
        data['id'] === 8 ? 'top' : '',
        data['id'] === 11 ? 'bottom' : '',
      ],
      width: 55,
    },
    {
      headerName: 'Zasoby',
      headerClass: 'grid-header grid-header-outer zasoby',
      children: [
        {
          headerName: 'Triage',
          field: 'triage',
          headerClass: 'grid-header grid-header-inner triage',
          cellClass: ({ data }) => [
            'triage',
            data['id'] > 7 && waskieGardlo().triage ? 'waskie-gardlo' : '',
            data['id'] < 8 ? 'part-of-table editable' : 'summary-row',
            data['id'] === 8 ? 'top' : '',
            data['id'] === 11 ? 'bottom' : '',
          ],
          width: ZASOBY_MIN_WIDTH,
        },
        {
          headerName: 'Łóżko',
          field: 'lozko',
          headerClass: 'grid-header grid-header-inner lozko',
          cellClass: ({ data }) => [
            'lozko',
            data['id'] > 7 && waskieGardlo().lozko ? 'waskie-gardlo' : '',
            data['id'] < 8 ? 'part-of-table editable' : 'summary-row',
            data['id'] === 8 ? 'top' : '',
            data['id'] === 11 ? 'bottom' : '',
          ],
          width: ZASOBY_MIN_WIDTH,
        },
        {
          headerName: 'Lekarz',
          field: 'lekarz',
          headerClass: 'grid-header grid-header-inner lekarz',
          cellClass: ({ data }) => [
            'lekarz',
            data['id'] > 7 && waskieGardlo().lekarz ? 'waskie-gardlo' : '',
            data['id'] < 8 ? 'part-of-table editable' : 'summary-row',
            data['id'] === 8 ? 'top' : '',
            data['id'] === 11 ? 'bottom' : '',
          ],
          width: ZASOBY_MIN_WIDTH,
        },
        {
          headerName: 'Pielęgn.',
          field: 'pielegniarka',
          headerClass: 'grid-header grid-header-inner pielegniarka',
          cellClass: ({ data }) => [
            'pielegniarka',
            data['id'] > 7 && waskieGardlo().pielegniarka ? 'waskie-gardlo' : '',
            data['id'] < 8 ? 'part-of-table editable' : 'summary-row',
            data['id'] === 8 ? 'top' : '',
            data['id'] === 11 ? 'bottom' : '',
          ],
          width: ZASOBY_MIN_WIDTH,
        },
        {
          headerName: 'Łóżko obserw.',
          field: 'lozkoObserwacja',
          headerClass: 'grid-header grid-header-inner obserwacja',
          cellClass: ({ data }) => [
            'obserwacja',
            data['id'] > 7 && waskieGardlo().lozkoObserwacja ? 'waskie-gardlo' : '',
            data['id'] < 8 ? 'part-of-table editable' : 'summary-row',
            data['id'] === 8 ? 'top' : '',
            data['id'] === 11 ? 'bottom' : '',
          ],
          width: ZASOBY_MIN_WIDTH,
        },
      ],
    },
    {
      headerName: 'Ograniczenia przyjęć',
      headerClass: 'grid-header grid-header-outer ograniczenia-przyjec',
      children: [
        {
          headerName: 'Łóżko oczek. na przyj. do szpitala',
          field: 'lozkoOczekiwanie',
          headerClass: 'grid-header grid-header-inner oczekiwanie-lozko',
          cellClass: ({ data }) => [
            'oczekiwanie-lozko',
            data['id'] > 7 && waskieGardlo().lozkoOczekiwanie ? 'waskie-gardlo' : '',
            data['id'] < 8 ? 'part-of-table editable' : 'summary-row',
            data['id'] === 8 ? 'top' : '',
            data['id'] === 11 ? 'bottom' : '',
          ],
          width: OGRANICZENIA_PRZYJEC_MIN_WIDTH,
        },
        {
          headerName: 'Wydajność przyjmowania',
          field: 'wydajnoscPrzyjmowania',
          headerClass: 'grid-header grid-header-inner wydajnosc',
          cellClass: ({ data }) => [
            'wydajnosc',
            data['id'] > 7 && waskieGardlo().wydajnoscPrzyjmowania ? 'waskie-gardlo' : '',
            data['id'] < 8 ? 'part-of-table editable' : 'summary-row',
            data['id'] === 8 ? 'top' : '',
            data['id'] === 11 ? 'bottom' : '',
          ],
          width: OGRANICZENIA_PRZYJEC_MIN_WIDTH,
        },
      ],
    },
  ];
}
