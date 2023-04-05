import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import { ApiInterceptor } from 'src/app/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private http: HttpClient, private snackBar: MatSnackBar){}

  public loginData = {
    username: "",
    password: ""
  };

  //Crida enpoint de login
  login(){
    this.http.post('/user/login', this.loginData).subscribe(
      token => ApiInterceptor.saveToken(token.toString()),
      () => this.snackBar.open("❌ Credencials incorrectes", "Tancar", { duration: 3000 })
    );
  }

  signup(){
    this.snackBar.open("🚨⚠️ Funció no implementada ⚠️🚨", "Tancar", { duration: 3000 });
  }
}
