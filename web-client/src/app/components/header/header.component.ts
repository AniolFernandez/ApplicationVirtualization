import { Component } from '@angular/core';
import { State } from 'src/app/State';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private router: Router) {
    let token = localStorage.getItem('token');
    if (token) {
      this.username = jwt_decode<{ user: string }>(token)["user"];
    }
  }

  public username: string = "";

  toggleAside() {
    State.asideOpen = !State.asideOpen;
  }

  //Redirect a la plana d'apps
  main() {
    this.router.navigate(['/']);
  }
}
