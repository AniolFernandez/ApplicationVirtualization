import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiInterceptor } from 'src/app/services/api';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { State } from 'src/app/State';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private http: HttpClient, private snackBar: SnackbarService, private router: Router) { }

  public loading: boolean = false;

  public loginData = {
    username: "",
    password: ""
  };

  //Crida enpoint de login
  login() {
    this.loading = true;
    this.http.post('/user/login', this.loginData).subscribe(
      (msg: any) => {
        this.loading = false;
        if (msg.token) {//Login correcte
          ApiInterceptor.saveToken(msg.token.toString());
          State.sessionStatusChanged();
          this.snackBar.Show("✅ Sessió iniciada.");
          this.router.navigate(["/"]);
        }
        else this.snackBar.Show("❌ Credencials incorrectes");
      },
      () => { //Login fallit
        this.loading = false;
        this.snackBar.Show("❌ No hi ha connexió amb el servidor");
      }
    );
  }

  //Navegació cap al registre
  signup() {
    this.router.navigate(["/signup"]);
  }
}
