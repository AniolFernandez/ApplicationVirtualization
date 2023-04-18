import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { State } from '../State';

@Injectable({
  providedIn: 'root'
})
export class ServersService {

  private readonly TIMEOUT = 1000;

  private availableServersWithLatency: {server: string, msToResponse: number}[] = [];

  constructor(private http: HttpClient) { }

  //Obtenció de tots els servidors disponibles per posteriorment testejar latències.
  public getServersWithLatency(callback: any) {
    this.http.get('/server/getIps').subscribe(
      (servers: any) => {
        servers.map((server: string) => this.testServerLatency(server));
        setTimeout(()=>callback(this.availableServersWithLatency), this.TIMEOUT);
      },
      () => callback([])
    );
  }

  //Test de latències per cada servidor
  private testServerLatency(server: string) {
    const initialMS = new Date().getTime();
    fetch(`http${State.SECURE ? "s":""}://${server}:${State.APPSERVER_PORT}/ping`, {method:"HEAD"})
      .then(() => {this.availableServersWithLatency.push({
        server: server,
        msToResponse: new Date().getTime() - initialMS
      })})
      .catch(error => {});//No hi ha connexió amb el servidor
  }
}
