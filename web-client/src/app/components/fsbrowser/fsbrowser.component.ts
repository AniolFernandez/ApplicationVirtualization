import { Component } from '@angular/core';
import { State } from 'src/app/State';

@Component({
  selector: 'app-fsbrowser',
  templateUrl: './fsbrowser.component.html',
  styleUrls: ['./fsbrowser.component.css']
})
export class FsbrowserComponent {
  close(){
    State.openFS=false;
  }
}
