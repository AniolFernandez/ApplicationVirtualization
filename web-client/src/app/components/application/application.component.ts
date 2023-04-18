import { Component, EventEmitter, Input, Output } from '@angular/core';
import { State } from 'src/app/State';
import { Application } from 'src/app/models/application';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent {
  @Input() app!: Application;
  @Input() inOpenApps: boolean = false;
  @Input() delay: string = "0s";

  constructor(private appService: AppService) { }

  openThisApp() {
    if (State.servers)
      this.appService.openApp(this.app);
  }

  closeThisApp() {
    this.appService.closeApp(this.app);
  }
}
