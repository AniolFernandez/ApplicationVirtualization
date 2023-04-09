import { Component, Input } from '@angular/core';
import { AppAdmin } from 'src/app/models/app-admin';
import { Role } from 'src/app/models/role';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-app-admin-card',
  templateUrl: './app-admin-card.component.html',
  styleUrls: ['./app-admin-card.component.css']
})
export class AppAdminCardComponent {
  @Input() app!: AppAdmin;
  @Input() roles!: Role[];
  loading: boolean=false;

  constructor(private appService: AppService){}

  save(){
    this.loading=true;
    this.appService.updateApp(this.app,(success:boolean)=>{
      if(success)
        this.app.pendingConfig=false;
      this.loading=false;
    });

  }
}
