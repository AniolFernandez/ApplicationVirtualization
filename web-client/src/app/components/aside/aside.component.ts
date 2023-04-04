import { Component, EventEmitter, Input, Output } from '@angular/core';
import { State } from 'src/app/State';
import { Application } from 'src/app/models/application';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent {
  state = State;
  @Output() openAppEvent = new EventEmitter<Application>();
  public categories: Category[];
  public loaded: boolean;
  constructor(){
    this.loaded = false;
    this.categories=[];
    setTimeout(()=>{
      this.loaded=true;
      this.categories = [
        {
          name: "ARQUITECTURA",
          isOpen: true,
          apps: [
            {
                name: "Adobe Photoshop CS6",
                ico: "/assets/img/ps.png",
                selected: false,
                active: false
            },
            {
                name: "Adobe Photoshop CS7",
                ico: "/assets/img/ps.png",
                selected: false,
                active: false
            }
          ]
        },
        {
          name: "ARQUITECTURA2",
          isOpen: false,
          apps: [
            {
                name: "Adobe Photoshop CS6",
                ico: "/assets/img/ps.png",
                selected: false,
                active: false
            },
            {
                name: "Adobe Photoshop CS7",
                ico: "/assets/img/ps.png",
                selected: false,
                active: false
            }
          ]
        },
        {
          name: "ARQUITECTURA3",
          isOpen: true,
          apps: [
            {
                name: "Adobe Photoshop CS6",
                ico: "/assets/img/ps.png",
                selected: false,
                active: false
            },
            {
                name: "Adobe Photoshop CS7",
                ico: "/assets/img/ps.png",
                selected: false,
                active: false
            }
          ]
        }
      ]
    }, 1000);
  }
}
