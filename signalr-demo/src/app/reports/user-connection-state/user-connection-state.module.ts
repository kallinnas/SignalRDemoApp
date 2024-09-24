import { NgModule } from '@angular/core';
import { UserConnectionStateRoutingModule } from './user-connection-state-routing.module';
import { GeneralModule } from '../../modules/general.model';

@NgModule({
  imports: [GeneralModule, UserConnectionStateRoutingModule]
})
export class UserConnectionStateModule { }
