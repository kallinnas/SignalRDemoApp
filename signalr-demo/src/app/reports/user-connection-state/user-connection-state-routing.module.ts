import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserConnectionStateComponent } from "./user-connection-state.component";

const routes: Routes = [{ path: '', component: UserConnectionStateComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserConnectionStateRoutingModule { }