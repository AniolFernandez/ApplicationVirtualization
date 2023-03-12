import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Application } from 'src/app/models/application';
import { Globals } from 'src/app/Globals';

@Component({
  selector: 'app-content-container',
  templateUrl: './content-container.component.html',
  styleUrls: ['./content-container.component.css']
})
export class ContentContainerComponent {
  @Input() asideActive: boolean = true;
  @Output() openAppEvent = new EventEmitter<Application>();
  @Output() closeAppEvent = new EventEmitter<Application>();
  globals = Globals;
  constructor(){
    setInterval(()=>{
      if(this.globals.activeApp && this.globals.openAppsStreams[this.globals.activeApp.name].stream) ()=>{};
    },500);
  }
}
