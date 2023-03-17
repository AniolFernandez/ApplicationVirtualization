export class AppStream{
    constructor(
        public endpoint: string
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
        this.socket.onopen = () =>{
            this.peerConnection = new RTCPeerConnection()
            this.peerConnection.ontrack = event => {
                this.stream = event.streams[0];
            }
            this.peerConnection.onicecandidate = event => {
                if (event.candidate === null)
                    this.socket.send(JSON.stringify({sdp:btoa(JSON.stringify(this.peerConnection.localDescription))}));
            }
            this.peerConnection.addTransceiver('video', {'direction': 'recvonly'});
            this.peerConnection.createOffer().then(d => {if(this.peerConnection)this.peerConnection.setLocalDescription(d)});
        };
        this.socket.onmessage = msg => {
            try {
                this.peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(atob(msg.data))));
            } catch (e) {
                alert(e);
            }
        };
    }
}