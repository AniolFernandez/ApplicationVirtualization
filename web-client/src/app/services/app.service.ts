import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SnackbarService } from './snackbar.service';
import { AppAdmin } from '../models/app-admin';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient, private snackBar: SnackbarService) { }

  //Update app catalog
  public updateApp(app: AppAdmin, callback: any) {
    this.http.post('/app', app).subscribe(
      (msg: any) => {
        if (msg.error) { //Error en el servidor
          this.snackBar.Show(`❌ ${msg.error.toString()}`);
        }
        callback(!msg.error);
      },
      () => { //Error en la connexió
        callback(false);
        this.snackBar.Show(`❌ No hi ha connexió amb el servidor`);
      }
    );
  }

  //Get available apps
  public getApps(callback: any) {
    this.http.get('/app/my-apps').subscribe(
      (msg: any) => {
        if (msg.error) { //Error en el servidor
          this.snackBar.Show(`❌ ${msg.error.toString()}`);
          callback([]);
        }
        else{
          msg.map((app: any) => {app.active=app.selected=false;})
          callback(msg);
        }
          
      },
      () => { //Error en la connexió
        callback([]);
        this.snackBar.Show(`❌ No hi ha connexió amb el servidor`);
      }
    );
  }
}
