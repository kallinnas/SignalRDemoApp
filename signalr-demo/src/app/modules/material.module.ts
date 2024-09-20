import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table'
import { MatIconModule } from '@angular/material/icon'
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';


@NgModule({
  exports: [MatTableModule, MatButtonModule, MatIconModule, MatSortModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatSelectModule, MatOptionModule,
    MatDatepickerModule, MatNativeDateModule, MatCardModule, MatDialogModule, MatProgressSpinnerModule,
    MatListModule, MatToolbarModule,
  ]
})
export class MaterialModule { }
