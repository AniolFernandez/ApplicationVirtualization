import { Application } from "./models/application";
import { AppStream } from "./models/appStream";

export class State {
    public static activeApp: Application | null = null;
    public static openApps: Application[] = [];
    public static openAppsStreams: { [name: string]: AppStream} = {};
    public static openFS: boolean = false;
}