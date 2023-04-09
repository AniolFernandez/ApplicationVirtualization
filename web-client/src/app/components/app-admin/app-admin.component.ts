import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AppAdmin } from 'src/app/models/app-admin';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-app-admin',
  templateUrl: './app-admin.component.html',
  styleUrls: ['./app-admin.component.css']
})
export class AppAdminComponent {
  apps: AppAdmin[] = [];
  constructor(private http: HttpClient, private snackBar: SnackbarService){
    this.http.get("/app/admin-list").subscribe(
      (msg: any) => this.apps = msg,
      () => this.snackBar.Show("❌ No hi ha connexió amb el servidor")
    )
  }
}
