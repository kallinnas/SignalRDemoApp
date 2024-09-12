import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
    { path: 'auth', component: AuthComponent },
    { path: 'home', loadChildren: ()=> import('./home/home.module').then(m => m.HomeModule), canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'auth', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }