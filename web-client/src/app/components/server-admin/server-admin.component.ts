import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Server } from 'src/app/models/server';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-server-admin',
  templateUrl: './server-admin.component.html',
  styleUrls: ['./server-admin.component.css']
})
export class ServerAdminComponent implements OnDestroy {

  servers: Server[] = [];
  private interval: any;

  constructor(private http: HttpClient, private snackBar: SnackbarService) {
    const checkStatus = () => this.http.get('/server').subscribe(
      (msg: any) => this.servers = msg,
      () => this.snackBar.Show("❌ No hi ha connexió amb el servidor") //Error server
    );
    this.interval = setInterval(checkStatus, 15000);
    checkStatus();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
