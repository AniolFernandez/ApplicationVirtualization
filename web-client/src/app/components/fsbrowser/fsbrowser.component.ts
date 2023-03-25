import { Component } from '@angular/core';
import { Directory } from 'src/app/models/directory';
import { State } from 'src/app/State';

@Component({
  selector: 'app-fsbrowser',
  templateUrl: './fsbrowser.component.html',
  styleUrls: ['./fsbrowser.component.css']
})
export class FsbrowserComponent {

  public directory: Directory | null = null;

  constructor(){
    if(!State.openAppsStreams[State.activeApp!.name].token){
      this.close();
      return;
    }
    this.fetchDirectoryData();
  }

  downloadFile(file: String){
    alert("descarregar "+file)
  }

  close(){
    State.openFS=false;
  }

  fetchDirectoryData(dir: String="", fullpath: boolean=true){
    if(!fullpath) dir = this.directory!.fullpath+"/"+dir;
    this.directory=null; //Activa l'animació
    var api = State.openAppsStreams[State.activeApp!.name].getApi();
    fetch(`${api}/list?token=${State.openAppsStreams[State.activeApp!.name].token}&path=${dir}/`)
    .then(response => response.json())
    .then(data => {
      this.directory = data;
    })
    .catch(error => {
      this.close();
      alert(error);
    });
  }
}
