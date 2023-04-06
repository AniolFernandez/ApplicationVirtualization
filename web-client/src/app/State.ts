import { Application } from "./models/application";
import { AppStream } from "./models/appStream";
import jwt_decode from 'jwt-decode';

export class State {
    public static activeApp: Application | null = null;
    public static openApps: Application[] = [];
    public static openAppsStreams: { [name: string]: AppStream} = {};
    public static openFS: boolean = false;
    public static asideOpen: boolean = true;
    public static username: string ="";
    public static sessionStatusChanged = () => {
        let token = localStorage.getItem('token');
        if (token)
          this.username = jwt_decode<{ user: string }>(token)["user"];
        else
          this.username="";
    };
}