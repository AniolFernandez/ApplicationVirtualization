import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { State } from 'src/app/State';
import { ApiInterceptor } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  constructor(private http: HttpClient, private snackBar: SnackbarService) { }

  public loading: boolean = false;

  public signupData = {
    username: "",
    email: "",
    password: "",
    password2: "",
  };

  //Comprovació d'email vàlid
  email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  isEmail(str: string): boolean{
    return this.email_regex.test(str);
  }

  //Crida enpoint de signup
  signup() {
    this.loading = true;
    this.http.post('/user/signup', this.signupData).subscribe(
      (msg: any) => {
        this.loading = false;
        if (msg.error) //Error gestionat pel servidor a l'hora de validar
          this.snackBar.Show(`❌ ${msg.error}`);

        //Usuari registrat correctament
        if(msg.token){
          ApiInterceptor.saveToken(msg.token);
          State.sessionStatusChanged();
          this.snackBar.Show("✅ Registrat correctament. Sessió iniciada.");
        }
      },
      () => { //Error en la connexió
        this.loading=false;
        this.snackBar.Show(`❌ No hi ha connexió amb el servidor`);
      }
    );
  }
}
