import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageContainerComponent } from './components/page-container/page-container.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AdminPageComponent } from './components/admin-page/admin-page.component';

const routes: Routes = [
  { path: '', component: PageContainerComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'config', component: AdminPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }