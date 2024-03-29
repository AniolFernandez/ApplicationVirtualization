import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from './services/api';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { AsideComponent } from './components/aside/aside.component';
import { PageContainerComponent } from './components/page-container/page-container.component';
import { ContentContainerComponent } from './components/content-container/content-container.component';
import { ContentNavigationComponent } from './components/content-navigation/content-navigation.component';
import { ApplicationComponent } from './components/application/application.component';
import { FsbrowserComponent } from './components/fsbrowser/fsbrowser.component';
import { MaterialsModule } from './materials.module';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { SnackbarService } from './services/snackbar.service';
import { AdminPageComponent } from './components/admin-page/admin-page.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserAndRolesComponent } from './components/user-and-roles/user-and-roles.component';
import { AppAdminComponent } from './components/app-admin/app-admin.component';
import { AppAdminCardComponent } from './components/app-admin-card/app-admin-card.component';
import { ServerAdminComponent } from './components/server-admin/server-admin.component';
import { ServerCardComponent } from './components/server-card/server-card.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AsideComponent,
    PageContainerComponent,
    ContentContainerComponent,
    ContentNavigationComponent,
    ApplicationComponent,
    FsbrowserComponent,
    LoginComponent,
    SignupComponent,
    AdminPageComponent,
    UserListComponent,
    UserAndRolesComponent,
    AppAdminComponent,
    AppAdminCardComponent,
    ServerAdminComponent,
    ServerCardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }, SnackbarService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
