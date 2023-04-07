import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { State } from 'src/app/State';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent {
  constructor(private router: Router){
    if(State.username!='admin') router.navigate(['/']);
  }
}
