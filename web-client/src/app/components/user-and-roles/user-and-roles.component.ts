import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { Role } from 'src/app/models/role';

@Component({
  selector: 'app-user-and-roles',
  templateUrl: './user-and-roles.component.html',
  styleUrls: ['./user-and-roles.component.css']
})
export class UserAndRolesComponent {

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  roles: Role[] = [{ id:1, name: 'Lemon' }, { id:2, name: 'Lime' }, { id: 3, name: 'Apple' }];

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    //Crida per afegir el rol
    if (value) {
      this.roles.push({ id: 1, name: value });
    }

    //Eliminem l'input
    event.chipInput!.clear();
  }

  remove(role: Role): void {
    const index = this.roles.indexOf(role);

    if (index >= 0) {
      this.roles.splice(index, 1);
    }
  }

  edit(role: Role, event: MatChipEditedEvent) {
    const value = event.value.trim();

    //L'elimina si no té nom
    if (!value) {
      this.remove(role);
      return;
    }

    // Edita el nom del rol
    const index = this.roles.indexOf(role);
    if (index >= 0) {
      this.roles[index].name = value;
    }
  }
}