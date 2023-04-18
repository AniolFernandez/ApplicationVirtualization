import { Component, EventEmitter, Input, Output } from '@angular/core';
import { State } from 'src/app/State';
import { Application } from 'src/app/models/application';
import { Category } from 'src/app/models/category';
import { AppService } from 'src/app/services/app.service';
import { ServersService } from 'src/app/services/servers.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent {
  state = State;
  @Output() openAppEvent = new EventEmitter<Application>();
  public apps: Application[] = [];
  public loaded: boolean = false;
  public getDelay(idx: number){
    return 0.20*idx+"s";
  }
  constructor(private appService : AppService, private serversService: ServersService){
    this.appService.getApps((apps:any)=>{
      this.apps = apps;
      this.loaded=true;
    });
    this.serversService.getServersWithLatency((servers: any)=>{this.state.servers=servers});
  }

  openApp(event: any){
    if(this.state.servers)
      this.openAppEvent.emit(event);
  }
}
