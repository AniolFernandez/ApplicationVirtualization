import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AppAdmin } from 'src/app/models/app-admin';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserAndRolesComponent } from '../user-and-roles/user-and-roles.component';

@Component({
  selector: 'app-app-admin',
  templateUrl: './app-admin.component.html',
  styleUrls: ['./app-admin.component.css']
})
export class AppAdminComponent {
  apps: AppAdmin[] = [];
  roles = UserAndRolesComponent;
  loading: boolean = true;
  constructor(private http: HttpClient, private snackBar: SnackbarService) {
    this.http.get("/app/admin-list").subscribe(
      (msg: any) => { this.apps = msg; this.loading = false; },
      () => { this.loading = false; this.snackBar.Show("❌ No hi ha connexió amb el servidor"); }
    )
  }
}
