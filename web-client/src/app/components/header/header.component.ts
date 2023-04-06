import { Component } from '@angular/core';
import { State } from 'src/app/State';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private router: Router) {State.sessionStatusChanged();}

  public state = State;

  toggleAside() {
    State.asideOpen = !State.asideOpen;
  }

  //Redirect a la plana d'apps
  main() {
    this.router.navigate(['/']);
  }

  openConfig(){
    alert("no implementat");
  }
}
