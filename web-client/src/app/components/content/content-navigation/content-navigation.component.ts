import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { State } from 'src/app/State';
import { Application } from 'src/app/models/application';

@Component({
  selector: 'app-content-navigation',
  templateUrl: './content-navigation.component.html',
  styleUrls: ['./content-navigation.component.css']
})
export class ContentNavigationComponent {
  @ViewChild('openAppsDiv') openAppsDiv!: ElementRef;
  @Input() openApps: Application[] = [];
  @Output() openAppEvent = new EventEmitter<Application>();
  @Output() closeAppEvent = new EventEmitter<Application>();
 
  onWheel(event: WheelEvent) {
    event.preventDefault();
    this.openAppsDiv.nativeElement.scrollLeft -= event.deltaY;
  }

  openFullscreen(){
    var vids = document.getElementsByTagName("video");
    if(vids.length==0) return;
    let elem = vids[0] as HTMLVideoElement;
    if (elem.requestFullscreen)
      elem.requestFullscreen();
  }

  openFS(){
    if(this.openApps.length>0) State.openFS=true;
  }
}
