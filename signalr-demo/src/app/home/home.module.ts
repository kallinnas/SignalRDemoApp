import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { GeneralModule } from '../modules/general.model';

@NgModule({
  imports: [GeneralModule, HomeRoutingModule]
})
export class HomeModule { }
