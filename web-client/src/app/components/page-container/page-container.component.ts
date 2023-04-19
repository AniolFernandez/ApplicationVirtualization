import { Component } from '@angular/core';
import { State } from 'src/app/State';

@Component({
  selector: 'app-page-container',
  templateUrl: './page-container.component.html',
  styleUrls: ['./page-container.component.css']
})
export class PageContainerComponent {
  public state = State;
}
