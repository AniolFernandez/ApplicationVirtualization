import { Component, EventEmitter, Input, Output } from '@angular/core';
import { State } from 'src/app/State';
import { Application } from 'src/app/models/application';
import { Category } from 'src/app/models/category';
import { AppService } from 'src/app/services/app.service';

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
  constructor(private appService : AppService){
    this.appService.getApps((apps:any)=>{
      this.apps = apps;
      this.loaded=true;
    });
  }
}
