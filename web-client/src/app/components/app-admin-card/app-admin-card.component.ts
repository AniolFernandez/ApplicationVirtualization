import { Component, Input } from '@angular/core';
import { AppAdmin } from 'src/app/models/app-admin';
import { Role } from 'src/app/models/role';
import { UserAndRolesComponent } from '../user-and-roles/user-and-roles.component';

@Component({
  selector: 'app-app-admin-card',
  templateUrl: './app-admin-card.component.html',
  styleUrls: ['./app-admin-card.component.css']
})
export class AppAdminCardComponent {
  @Input() app: AppAdmin | null = null;
  roles = UserAndRolesComponent;
  @Input() new: boolean= false;
  selectedRoles: string[] = [];

  save(){
    this.new=false;
    alert(this.app!.logo);
  }
}
