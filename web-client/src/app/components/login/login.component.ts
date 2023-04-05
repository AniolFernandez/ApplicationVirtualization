import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiInterceptor } from 'src/app/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router) { }

  public loading: boolean = false;

  public loginData = {
    username: "",
    password: ""
  };

  //Crida enpoint de login
  login() {
    this.loading = true;
    this.http.post('/user/login', this.loginData).subscribe(
      token => {
        this.loading = false;
        ApiInterceptor.saveToken(token.toString());
      },
      () => {
        this.loading = false;
        this.snackBar.open("❌ Credencials incorrectes", "Tancar", { duration: 3000 });
      }
    );
  }

  signup() {
    this.router.navigate(["/signup"]);
  }
}
