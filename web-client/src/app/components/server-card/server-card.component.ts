import { Component, Input } from '@angular/core';
import { Server } from 'src/app/models/server';

@Component({
  selector: 'app-server-card',
  templateUrl: './server-card.component.html',
  styleUrls: ['./server-card.component.css']
})
export class ServerCardComponent {
  @Input() server!: Server;
}
