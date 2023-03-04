import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Application } from 'src/app/models/application';

@Component({
  selector: 'app-content-container',
  templateUrl: './content-container.component.html',
  styleUrls: ['./content-container.component.css']
})
export class ContentContainerComponent {
  @Input() asideActive: boolean = true;
  @Input() openApps: Application[] = [];
  @Output() openAppEvent = new EventEmitter<Application>();
  @Output() closeAppEvent = new EventEmitter<Application>();
}
