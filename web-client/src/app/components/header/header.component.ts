import { Component } from '@angular/core';
import { State } from 'src/app/State';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(){
    let token = localStorage.getItem('token');
    if(token){
      this.username = jwt_decode<{user:string}>(token)["user"];
    }
  }

  public username: string ="";

  toggleAside(){
    State.asideOpen = !State.asideOpen;
  }
}
