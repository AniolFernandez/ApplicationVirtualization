import { Component, Input } from '@angular/core';
import { Application } from 'src/app/models/application';
import { State } from 'src/app/State';
import { AppStream } from 'src/app/models/appStream';

@Component({
  selector: 'app-page-container',
  templateUrl: './page-container.component.html',
  styleUrls: ['./page-container.component.css']
})
export class PageContainerComponent {
  @Input() asideActive: boolean = true;
  public globals = State;

  openApp(app: Application){
    if(!app.selected){
      State.openApps.push(app);
      State.openAppsStreams[app.name] = new AppStream("192.168.1.67", () => this.closeApp(app));
    }
    if(State.activeApp){
      State.activeApp.active=false;
    }
    State.activeApp=app;
    State.activeApp.selected=true;
    State.activeApp.active=true;
  }

  closeApp(app: Application){
    State.openApps=State.openApps.filter((x) => x!=app);
    if(State.activeApp==app){
      if(State.openApps.length>0)
        this.openApp(State.openApps[State.openApps.length-1]);
      else
        State.activeApp=null;
    }
    app.active=false;
    app.selected=false;
    State.openAppsStreams[app.name].closeConnection();
    delete State.openAppsStreams[app.name];
  }
}
