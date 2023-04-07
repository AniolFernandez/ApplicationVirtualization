import { Injectable } from '@angular/core';
import { Role } from '../models/role';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient, private snackBar: SnackbarService){}

  //Obtenir tots els rols
  public getRoles(callback: any) {
    this.http.get('/role/all').subscribe(
      (msg: any) => {
        callback(msg);
      },
      () => { //Error en la connexió
        callback([]);
        this.snackBar.Show(`❌ No hi ha connexió amb el servidor`);
      }
    );
  }

  //Afegir un nou rol
  public addRole(nom: string, callback: any) {
    this.http.post('/role', {rolName:nom}).subscribe(
      (msg: any) => {
        if(msg.error){ //Error en el servidor
          this.snackBar.Show(`❌ ${msg.error.toString()}`);
          callback(null);
        }
        else //tot ok
          callback(msg);
      },
      () => { //Error en la connexió
        callback(null);
        this.snackBar.Show(`❌ No hi ha connexió amb el servidor`);
      }
    );
  }
}
