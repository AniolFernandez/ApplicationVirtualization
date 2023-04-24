import { State } from "../State";

export class AppStream {
    endpoint: string = "";
    constructor(public onclose: any) { }

    private static readonly config = {
        iceServers: [
            {
                urls: "stun:stun.l.google.com:19302",
            },
        ],
        //            iceTransportPolicy: "relay" as RTCIceTransportPolicy,
    };

    public stream?: MediaStream;
    private socket!: WebSocket;
    private peerConnection!: RTCPeerConnection;
    public token: String = "";

    public getApi() {
        if (this.endpoint)
            return `http${State.SECURE ? "s" : ""}://${this.endpoint}:${State.APPSERVER_PORT}`
        return ""
    }

    public closeConnection() {
        if (this.peerConnection)
            this.peerConnection.close();
        if (this.socket)
            this.socket.close();
    }

    public moveMouse(x: any, y: any) {
        this.socket.send(JSON.stringify({
            type: 'mv',
            x: x,
            y: y
        }));
    }

    public mouseClick(up: boolean, left: boolean) {
        this.socket.send(JSON.stringify({
            type: 'mc',
            up: up,
            left: left
        }));
    }

    public keyEvent(up: boolean, key: string) {
        this.socket.send(JSON.stringify({
            type: 'kp',
            up: up,
            key: key
        }));
    }

    public startConnection(endpoint: string, token: string) {
        this.endpoint = endpoint;
        this.socket = new WebSocket(`ws${State.SECURE ? "s" : ""}://${this.endpoint}:${State.APPSERVER_PORT}/ws`);

        //Envia el token d'accés
        this.socket.onopen = () => this.socket.send(token);

        this.socket.onmessage = msg => {
            if (msg.data == "ready") {
                this.peerConnection = new RTCPeerConnection(AppStream.config)
                this.peerConnection.ontrack = event => { this.stream = event.streams[0]; }
                this.peerConnection.onicecandidate = event => { if (event.candidate && event.candidate.candidate !== "") this.socket.send(JSON.stringify(event.candidate)) }
                this.peerConnection.addTransceiver('video', { 'direction': 'recvonly' });
                this.peerConnection.createOffer().then(d => {
                    this.peerConnection.setLocalDescription(d);
                    this.socket.send(JSON.stringify(d));
                });
                return;
            }
            let obj = JSON.parse(atob(msg.data));
            if (!obj) {
                console.log('failed to parse msg');
                return;
            }
            if (obj.token) {
                this.token = obj.token;
            }
            else if (obj.candidate) {
                this.peerConnection.addIceCandidate(obj);
            } else {
                obj = JSON.parse(atob(obj));
                this.peerConnection.setRemoteDescription(obj);
                this.socket.send(JSON.stringify({ type: "established" }));
            }
        };
        this.socket.onclose = (e) => this.onclose();
    }
}