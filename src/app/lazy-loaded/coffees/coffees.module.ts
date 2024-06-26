import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { CoffeesComponent } from './coffees.component';
import { CoffeesRoutingModule } from './coffees-routing.module';
import { TableComponent } from './table/table.component';
import { TableFiltersComponent } from './table-filters/table-filters.component';

@NgModule({
  declarations: [
    CoffeesComponent,
    TableComponent,
    TableFiltersComponent
  ],
  imports: [
    SharedModule,
    CoffeesRoutingModule,
  ]
})
export class CoffeesModule { }
