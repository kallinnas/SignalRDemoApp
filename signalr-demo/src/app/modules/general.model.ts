import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "./material.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FlexLayoutServerModule } from '@angular/flex-layout/server';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  exports: [CommonModule, FormsModule, ReactiveFormsModule, 
    MaterialModule, FontAwesomeModule,
    FlexLayoutModule, FlexLayoutServerModule]
})
export class GeneralModule { }
