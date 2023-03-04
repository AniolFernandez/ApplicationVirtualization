import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Output() toggleAsideEvent = new EventEmitter<boolean>();

  public asideActive: boolean = true;

  toggleAside(){
    this.asideActive=!this.asideActive;
    this.toggleAsideEvent.emit(this.asideActive);
  }
}
