import { Component } from '@angular/core';
import { Directory, File } from 'src/app/models/directory';
import { State } from 'src/app/State';

@Component({
  selector: 'app-fsbrowser',
  templateUrl: './fsbrowser.component.html',
  styleUrls: ['./fsbrowser.component.css']
})
export class FsbrowserComponent {

  public directory: Directory = {
    fullpath: "/SHARED",
    parent: "pako",
    files: [
      {
        name:"This is a file",
        isFile: true
      },
      {
        name:"This is a directory",
        isFile: false
      },
      {
        name:"This is another file",
        isFile: true
      }
    ]
  }

  downloadFile(file: String){
    alert("descarregar "+file)
  }

  openDir(dir: String){
    alert("obrir "+dir)
  }

  close(){
    State.openFS=false;
  }
}
