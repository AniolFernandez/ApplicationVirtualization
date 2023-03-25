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

  close(){
    State.openFS=false;
  }

  fetchDirectoryData(dir: String="", fullpath: boolean=true){
    if(!fullpath) dir = this.directory!.fullpath+"/"+dir;
    this.directory=null; //Activa l'animació
    const api = State.openAppsStreams[State.activeApp!.name].getApi();
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

  downloadFile(file: String){
    const a = document.createElement('a');
    const api = State.openAppsStreams[State.activeApp!.name].getApi();
    const token = State.openAppsStreams[State.activeApp!.name].token;
    const path = this.directory!.fullpath + "/";
    a.href = `${api}/download?token=${token}&path=${path}&file=${file}`;
    a.target="_blank";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}
