import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  private users: User[] = [];
  displayedColumns: string[] = ['username', 'email', 'role', 'createtime'];
  dataSource = new MatTableDataSource<User>(this.users);
  public loading: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  constructor(private snackBar: SnackbarService, private http: HttpClient){
    this.dataSource.paginator = this.paginator;
    this.getUsers();
  }


  //Crida enpoint obtenció d'usuaris
  getUsers() {
    this.loading = true;
    this.http.get('/user/all').subscribe(
      (msg: any) => {
        this.loading = false;
        this.users = msg;
        this.dataSource = new MatTableDataSource<User>(this.users);
      },
      () => { //ha fallat la connexió
        this.loading = false;
        this.snackBar.Show("❌ No hi ha connexió amb el servidor");
      }
    );
  }

  changeRole(username: string, role: string){
    alert(username+" "+role);
  }

}