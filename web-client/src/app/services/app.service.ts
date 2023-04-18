import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SnackbarService } from './snackbar.service';
import { AppAdmin } from '../models/app-admin';
import { Application } from '../models/application';
import { AppStream } from '../models/appStream';
import { State } from '../State';

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
        else {
          msg.map((app: any) => { app.active = app.selected = false; })
          callback(msg);
        }

      },
      () => { //Error en la connexió
        callback([]);
        this.snackBar.Show(`❌ No hi ha connexió amb el servidor`);
      }
    );
  }

  openApp(app: Application) {
    if (!app.selected) {
      State.openApps.push(app);
      State.openAppsStreams[app.name] = this.createAppStream(app);
    }
    if (State.activeApp) {
      State.activeApp.active = false;
    }
    State.activeApp = app;
    State.activeApp.selected = true;
    State.activeApp.active = true;
  }

  closeApp(app: Application) {
    State.openApps = State.openApps.filter((x) => x != app);
    if (State.activeApp == app) {
      if (State.openApps.length > 0)
        this.openApp(State.openApps[State.openApps.length - 1]);
      else
        State.activeApp = null;
    }
    app.active = false;
    app.selected = false;
    State.openAppsStreams[app.name].closeConnection();
    delete State.openAppsStreams[app.name];
  }

  private createAppStream(app: Application): AppStream {
    return new AppStream("192.168.56.101", () => this.closeApp(app));
  }
}
