import { Application } from "./models/application";
import { AppStream } from "./models/appStream";

export class Globals {
    public static activeApp: Application | null = null;
    public static openApps: Application[] = [];
    public static openAppsStreams: { [name: string]: AppStream} = {};
}