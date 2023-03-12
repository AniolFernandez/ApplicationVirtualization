import { Component, Input } from '@angular/core';
import { Application } from 'src/app/models/application';
import { Globals } from 'src/app/Globals';
import { AppStream } from 'src/app/models/appStream';

@Component({
  selector: 'app-page-container',
  templateUrl: './page-container.component.html',
  styleUrls: ['./page-container.component.css']
})
export class PageContainerComponent {
  @Input() asideActive: boolean = true;

  openApp(app: Application){
    if(!app.selected){
      Globals.openApps.push(app);
      Globals.openAppsStreams[app.name] = new AppStream("wss://192.168.1.67:8443/");
    }
    if(Globals.activeApp){
      Globals.activeApp.active=false;
    }
    Globals.activeApp=app;
    Globals.activeApp.selected=true;
    Globals.activeApp.active=true;
  }

  closeApp(app: Application){
    Globals.openApps=Globals.openApps.filter((x) => x!=app);
    if(Globals.activeApp==app){
      if(Globals.openApps.length>0)
        this.openApp(Globals.openApps[Globals.openApps.length-1]);
      else
        Globals.activeApp=null;
    }
    app.active=false;
    app.selected=false;
    Globals.openAppsStreams[app.name].closeConnection();
    delete Globals.openAppsStreams[app.name];
  }
}
