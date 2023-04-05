import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageContainerComponent } from './components/page-container/page-container.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', component: PageContainerComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }