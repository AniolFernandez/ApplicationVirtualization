import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements AfterViewInit {
  private users: User[] = [
    {
      username: 'johndoe',
      email: 'johndoe@example.com',
      group: 'Group A',
      createdate: '2022-03-15T13:30:00.000Z'
    },
    {
      username: 'janedoe',
      email: 'janedoe@example.com',
      group: 'Group B',
      createdate: '2022-03-16T14:45:00.000Z'
    },
    {
      username: 'bobsmith',
      email: 'bobsmith@example.com',
      group: 'Group C',
      createdate: '2022-03-17T16:00:00.000Z'
    },
    {
      username: 'alicejohnson',
      email: 'alicejohnson@example.com',
      group: 'Group A',
      createdate: '2022-03-18T17:15:00.000Z'
    },
    {
      username: 'mikesmith',
      email: 'mikesmith@example.com',
      group: 'Group B',
      createdate: '2022-03-19T18:30:00.000Z'
    },
    {
      username: 'janedoe2',
      email: 'janedoe2@example.com',
      group: 'Group C',
      createdate: '2022-03-20T19:45:00.000Z'
    },
    {
      username: 'johnsmith',
      email: 'johnsmith@example.com',
      group: 'Group A',
      createdate: '2022-03-21T21:00:00.000Z'
    },
    {
      username: 'sarahdoe',
      email: 'sarahdoe@example.com',
      group: 'Group B',
      createdate: '2022-03-22T22:15:00.000Z'
    },
    {
      username: 'robertjohnson',
      email: 'robertjohnson@example.com',
      group: 'Group C',
      createdate: '2022-03-23T23:30:00.000Z'
    },
    {
      username: 'janesmith',
      email: 'janesmith@example.com',
      group: 'Group A',
      createdate: '2022-03-24T00:45:00.000Z'
    }
  ];

  displayedColumns: string[] = ['username', 'email', 'group', 'createdate'];
  dataSource = new MatTableDataSource<User>(this.users);

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}