import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Application } from 'src/app/models/application';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent {
  @Input() app!: Application;
  @Input() inOpenApps: boolean = false;
  @Input() delay: string="0s";
  @Output() openAppEvent = new EventEmitter<Application>();
  @Output() closeAppEvent = new EventEmitter<Application>();

  openThisApp(){
    this.openAppEvent.emit(this.app);
  }

  closeThisApp(){
    this.closeAppEvent.emit(this.app);
  }
}
