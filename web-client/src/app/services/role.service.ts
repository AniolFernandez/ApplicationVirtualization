import { Injectable } from '@angular/core';
import { Role } from '../models/role';
import { HttpClient } from '@angular/common/http';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient, private snackBar: SnackbarService){}

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
}
