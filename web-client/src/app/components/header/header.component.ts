import { Component, Output, EventEmitter } from '@angular/core';
import { State } from 'src/app/State';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  toggleAside(){
    State.asideOpen = !State.asideOpen;
  }
}
