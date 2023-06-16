import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../services/api.service';
import { take } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Order } from '../models/order';
import { Package } from '../models/package';
import { DateTime } from 'luxon';
import { ORDER_STATES } from '../enums/oders_state';



export interface ColumnConfig {
  columnDef: string;
  header: string;
  cell: (element: any) => string;
}


@Component({
  selector: 'app-order-table',
  styleUrls: ['order-table.css'],
  templateUrl: 'order-table.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})


export class OrderTable {
  public orderState: ORDER_STATES;

  protected columns: ColumnConfig[] = [
    {
      columnDef: 'id',
      header: 'ID',
      cell: (element: Order) => `${element.id}`,
    },
    {
      columnDef: 'state',
      header: 'Date',
      cell: (element: Order) => `${element.state}`,
    },
    {
      columnDef: 'date',
      header: 'Order Date',
      cell: (element: Order) => DateTime.fromISO(element.date).toLocaleString(DateTime.DATETIME_SHORT),
    },
    {
      columnDef: 'stateUpdateDate',
      header: 'Last Update',
      cell: (element: Order) => DateTime.fromISO(element.stateUpdateDate).toLocaleString(DateTime.DATETIME_SHORT)
    }
  ];

  protected detailColums: ColumnConfig[] = [
    {
      columnDef: 'package_id',
      header: 'ID',
      cell: (element: Package) => `${element.id}`,
    },
    {
      columnDef: 'heightCm',
      header: 'Height',
      cell: (element: Package) => `${element.heightCm}`,
    },
    {
      columnDef: 'widthCm',
      header: 'Width',
      cell: (element: Package) => `${element.widthCm}`,
    },
    {
      columnDef: 'weightKg',
      header: 'Weight',
      cell: (element: Package) => `${element.weightKg}`
    },
    {
      columnDef: 'package_state',
      header: 'State',
      cell: (element: Package) => `${element.state}`
    },
    {
      columnDef: 'lat',
      header: 'Delivery Latitude',
      cell: (element: Package) => `${element.lat}`
    },
    {
      columnDef: 'lon',
      header: 'Delivery Longitude',
      cell: (element: Package) => `${element.lon}`
    },
    {
      columnDef: 'description',
      header: 'Description',
      cell: (element: Package) => element.description??''
    }
    ];

  columnsToDisplayWithExpand = [...this.columns.map(colConfig=>colConfig.columnDef), 'expand'];
  detailColumnsToDisplay = this.detailColums.map(colConfig=>colConfig.columnDef);

  expandedElement: Package[] | null;
 

  public dataSource: MatTableDataSource<Order>;

 
 

 

  @ViewChild(MatSort) sort: MatSort;

  constructor(private api: ApiService) {
    this.refresh();
  }

  refresh(): void {
    this.api.orders().pipe(take(1)).subscribe(x=>{

      this.dataSource = new MatTableDataSource(x.data);
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = this.filterByOrderState();
      this.dataSource.sortData = this.sortData();
  
    }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toUpperCase();
  }

  filterByOrderState() {
    let filterFunction = (data: Order, filter: any): boolean => {
     console.log(data,filter.toLowerCase());
      if (filter) {
        return data.state.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) != -1;
      } 
      return true;
      
    };

    return filterFunction;
  }

  sortData() {
    let sortFunction = (items: Order[], sort: MatSort): Order[] => {
      if (!sort.active || sort.direction === '') {
        return items;
      }

      return items.sort((a: Order, b: Order) => {
        let comparatorResult = 0;
        switch (sort.active) {
          case 'id':
            comparatorResult = a.id == b.id?0:1;
            break;
          case 'state':
            comparatorResult = a.state.localeCompare(b.state);
            break;
          case 'date':
            comparatorResult = a.date.localeCompare(b.date);
            break;
          case 'stateUpdateDate':
            comparatorResult = a.stateUpdateDate.localeCompare(b.stateUpdateDate);
            break; 
          default:
            comparatorResult = a.date.localeCompare(b.date);
            break;
        }
        return comparatorResult * (sort.direction == 'asc' ? 1 : -1);
      });
    };

    return sortFunction;
  }
}

/**  Copyright 2022 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license */
