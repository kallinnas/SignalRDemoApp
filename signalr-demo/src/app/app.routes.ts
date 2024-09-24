import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './services/auth.guard';
import { GameManagerComponent } from './games/game-manager/game-manager.component';

export const routes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
    { path: 'auth', component: AuthComponent },
    { path: 'game-manager', component: GameManagerComponent },
    { path: 'user-connection-state', loadChildren: ()=> import('./reports/user-connection-state/user-connection-state.module').then(m => m.UserConnectionStateModule), canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'auth', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
