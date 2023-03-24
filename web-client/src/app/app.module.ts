import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { AsideComponent } from './components/aside/aside.component';
import { PageContainerComponent } from './components/page-container/page-container.component';
import { ContentContainerComponent } from './components/content/content-container/content-container.component';
import { ContentNavigationComponent } from './components/content/content-navigation/content-navigation.component';
import { ApplicationComponent } from './components/application/application.component';
import { FsbrowserComponent } from './components/fsbrowser/fsbrowser.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AsideComponent,
    PageContainerComponent,
    ContentContainerComponent,
    ContentNavigationComponent,
    ApplicationComponent,
    FsbrowserComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
