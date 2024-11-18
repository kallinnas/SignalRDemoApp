import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './services/auth.guard';
import { GameManagerComponent } from './games/game-manager/game-manager.component';
import { AccountComponent } from './reports/account/account.component';
import { DeactivateRspGuard } from './services/deactivate-rsp.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
    { path: 'auth', component: AuthComponent },
    { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
    { path: 'game-manager', component: GameManagerComponent, canActivate: [AuthGuard], canDeactivate: [DeactivateRspGuard]  },
    { path: 'user-connection-state', loadComponent: () => import('./reports/user-connection-state/user-connection-state.component').then(c => c.UserConnectionStateComponent), canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'auth', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
