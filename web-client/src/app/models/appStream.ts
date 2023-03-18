export class AppStream{
    constructor(
        public endpoint: string,
        public onclose: any
    ){
        this.startConnection();
    }

    public stream?: MediaStream;
    private socket!: WebSocket;
    private peerConnection!: RTCPeerConnection;

    public closeConnection(){
        if(this.peerConnection)
            this.peerConnection.close();
        if(this.socket)
            this.socket.close();
    }

    public moveMouse(x: any, y: any){
        this.socket.send(JSON.stringify({
            type: 'mv',
            x: x,
            y: y
        }));
    }

    public mouseClick(up: boolean, left: boolean){
        this.socket.send(JSON.stringify({
            type: 'mc',
            up: up,
            left: left
        }));
    }

    public keyEvent(up: boolean, key: string){
        this.socket.send(JSON.stringify({
            type: 'kp',
            up: up,
            key: key
        }));
    }

    private startConnection(){
        this.socket= new WebSocket(this.endpoint);
        const config = {
            iceServers: [{
                            urls: "turn:openrelay.metered.ca:80",
                            username: "openrelayproject",
                            credential: "openrelayproject"
                        }],
//            iceTransportPolicy: "relay",
        };
        this.socket.onopen = () =>{
            this.peerConnection = new RTCPeerConnection(config)
            this.peerConnection.ontrack = event => { this.stream = event.streams[0]; }
            this.peerConnection.onicecandidate = event => { if (event.candidate && event.candidate.candidate !== "") this.socket.send(JSON.stringify(event.candidate)); }
            this.peerConnection.addTransceiver('video', {'direction': 'recvonly'});
            this.peerConnection.createOffer().then(d => { 
                this.peerConnection.setLocalDescription(d); 
                this.socket.send(JSON.stringify(d));
            });
        };
        this.socket.onmessage = msg => {
            let obj = JSON.parse(atob(msg.data));
            if (!obj) {
                console.log('failed to parse msg');
                return;
            }
            if (obj.candidate) {
                this.peerConnection.addIceCandidate(obj);
            } else {
                obj = JSON.parse(atob(obj));
                console.log(obj);
                this.peerConnection.setRemoteDescription(obj);
            }
        };
        this.socket.onclose = (e) => this.onclose();
    }
}