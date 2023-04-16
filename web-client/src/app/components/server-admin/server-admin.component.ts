import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Server } from 'src/app/models/server';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-server-admin',
  templateUrl: './server-admin.component.html',
  styleUrls: ['./server-admin.component.css']
})
export class ServerAdminComponent {

  servers: Server[] = []

  constructor(private http: HttpClient, private snackBar: SnackbarService) {
    const checkStatus = () => this.http.get('/server').subscribe(
      (msg: any) => {
        this.servers = msg;
      },
      () => { //Error al server
        this.snackBar.Show("❌ No hi ha connexió amb el servidor");
      }
    );
    setInterval(checkStatus, 15000);
    checkStatus();
  }
}
