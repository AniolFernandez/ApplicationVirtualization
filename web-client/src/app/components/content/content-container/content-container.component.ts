import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('stream') streamElement!: ElementRef;
  globals = Globals;
  constructor(){
    setInterval(()=>{
      if(this.globals.activeApp && this.globals.openAppsStreams[this.globals.activeApp.name].stream) ()=>{};
    },500);
  }

  onVideoMouseMove(event: MouseEvent) {
    var rect = this.streamElement.nativeElement.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var naturalWidth = this.streamElement.nativeElement.videoWidth;
    var naturalHeight = this.streamElement.nativeElement.videoHeight;
    var sourceX = (x / rect.width) * naturalWidth;
    var sourceY = (y / rect.height) * naturalHeight;
    console.log(`Mouse position: (${sourceX},${sourceY})`);
  }
}
