import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { Application } from 'src/app/models/application';
import { State } from 'src/app/State';

@Component({
  selector: 'app-content-container',
  templateUrl: './content-container.component.html',
  styleUrls: ['./content-container.component.css']
})
export class ContentContainerComponent {
  @Output() openAppEvent = new EventEmitter<Application>();
  @Output() closeAppEvent = new EventEmitter<Application>();
  @ViewChild('stream') streamElement!: ElementRef;
  globals = State;
  constructor(){
    this.refresh();
    window.addEventListener('keydown', (e) => this.onKey(e, false));
    window.addEventListener('keyup', (e) => this.onKey(e, true));
  }

  onKey(event: KeyboardEvent, up: boolean) {
    if(!this.globals.activeApp) return;
    this.globals.openAppsStreams[this.globals.activeApp.name].keyEvent(up,event.key);
  }

  onVideoMouseMove(event: MouseEvent) {
    if(!this.globals.activeApp) return;
    var rect = this.streamElement.nativeElement.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var naturalWidth = this.streamElement.nativeElement.videoWidth;
    var naturalHeight = this.streamElement.nativeElement.videoHeight;
    var sourceX = (x / rect.width) * naturalWidth;
    var sourceY = (y / rect.height) * naturalHeight;
    this.globals.openAppsStreams[this.globals.activeApp.name].moveMouse(Math.round(sourceX), Math.round(sourceY));
  }

  onVideoMouseDown(event: MouseEvent){
    if(!this.globals.activeApp) return;
    this.globals.openAppsStreams[this.globals.activeApp.name].mouseClick(false, event.button === 0);
  }

  onVideoMouseUp(event: MouseEvent){
    if(!this.globals.activeApp) return;
    this.globals.openAppsStreams[this.globals.activeApp.name].mouseClick(true, event.button === 0);
  }

  refresh(){
    setInterval(()=>{if(this.globals.activeApp && this.globals.openAppsStreams[this.globals.activeApp.name].stream) ()=>{};},500);
  }
}
