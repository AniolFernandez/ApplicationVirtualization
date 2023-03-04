import { Component, Input } from '@angular/core';
import { Application } from 'src/app/models/application';

@Component({
  selector: 'app-page-container',
  templateUrl: './page-container.component.html',
  styleUrls: ['./page-container.component.css']
})
export class PageContainerComponent {
  @Input() asideActive: boolean = true;

  public openApps: Application[] = [];
  private activeApp: Application | null = null;

  openApp(app: Application){
    if(!app.selected){
      this.openApps.push(app);
    }
    if(this.activeApp){
      this.activeApp.active=false;
    }
    this.activeApp=app;
    this.activeApp.selected=true;
    this.activeApp.active=true;
  }

  closeApp(app: Application){
    this.openApps=this.openApps.filter((x) => x!=app);
    if(this.activeApp===app && this.openApps.length>0){
      this.openApp(this.openApps[this.openApps.length-1]);
    }
    app.active=false;
    app.selected=false;
  }
}
