import { Component, Input } from '@angular/core';
import { Application } from 'src/app/models/application';
import { State } from 'src/app/State';
import { AppStream } from 'src/app/models/appStream';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-page-container',
  templateUrl: './page-container.component.html',
  styleUrls: ['./page-container.component.css']
})
export class PageContainerComponent {
  public state = State;
}
