import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = "web-client";

  public asideActive: boolean = true;
  toggleAside(enabled: boolean){
    this.asideActive=enabled;
  }
}
