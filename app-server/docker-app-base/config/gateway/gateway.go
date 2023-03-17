package main

import (
	"bytes"
	"os"
	"os/exec"
	"io/ioutil"
	"net"
	"bufio"
	"log"
	"strings"
	"math"
	"compress/gzip"
	"encoding/base64"
	"encoding/json"
	"github.com/pion/webrtc/v2"
	"github.com/pion/rtp"
	"github.com/go-vgo/robotgo"
)

var xMax int
var yMax int

func main(){
	ini()
	

	//******
	//	1. Estableix connexió amb el servidor
	//******
	port, _ := os.LookupEnv("PROXY_PORT") //Llegeix el nº de port assignat pel servidor
	port = strings.TrimSpace(port)
	log.Println("Connectant amb 127.0.0.1:"+port)
	proxy, err := net.Dial("tcp", "127.0.0.1:"+port)
	if err != nil {
		log.Println("Error en connectar-se amb el servidor.", err)
		return
	}
	defer proxy.Close()
	lector := bufio.NewReader(proxy)

	//******
	//	2. Rep SDP del client
	//******
	SDP, err := lector.ReadString('\n')
	if err != nil {
		log.Println("No s'ha pogut llegir l'SDP del client", err)
		return
	}
	log.Println("Rebut SDP:",SDP)

	//******
	//	3. Inicia el bridge RTP-WebRTC i retorna SDP del contenidor
	//******
	chGateway := make(chan string)
	go startWebRTCGateway(SDP, chGateway)
	SDPContenidor := <- chGateway
	log.Println("Enviant SDP del contenidor al client: ",SDPContenidor)
	_, err = proxy.Write([]byte(SDPContenidor+"\n"))
	if err != nil {
		log.Println("No s'ha pogut enviar l'SDP del contenidor al client", err)
		return
	}
	log.Println("Retransmetent RTP -> WebRTC")


	//******
	//	4. Inicia l'event loop pels keystrokes
	//******
	log.Println("Event loop iniciat.")
	var jsonRecv map[string]interface{}
	for {
		event, err := lector.ReadString('\n')
		if err != nil {
			log.Println("Error llegint", err)
			return
		}
		json.Unmarshal([]byte(event), &jsonRecv)
		eventSwitch(jsonRecv)
	}
}

//Inicialització del controlador 
func ini(){
	display := ":99"
	os.Setenv("DISPLAY", display)
	robotgo.SetXDisplayName(display)
	xMax, yMax = robotgo.GetScreenSize()
	robotgo.MoveMouse(xMax, yMax) //Iniciar abaix a la dreta
}

//Switch d'events
func eventSwitch(eventJSON map[string]interface{}){
	switch eventJSON["type"] {
	case "mv": //Mouse move
		eventMoveMouse(eventJSON)
	case "md": //Mouse down
		eventClickMouse(false, eventJSON["left"].(bool))
	case "mu": //Mouse up
		eventClickMouse(true, eventJSON["left"].(bool))
	case "ky": //key
		eventKey(eventJSON["up"].(bool), eventJSON["key"].(string))
	default:
		log.Println("Rebut event desconegut.")
	}
}

//Gestió d'event movimentn de mouse amb control de límits
func eventMoveMouse(eventMoveMouseJSON map[string]interface{}){
	x := int(math.Max(math.Min(math.Round(eventMoveMouseJSON["x"].(float64)), float64(xMax)),0))
	y := int(math.Max(math.Min(math.Round(eventMoveMouseJSON["y"].(float64)), float64(yMax)),0))
	robotgo.MoveMouse(x, y)
}

//Gestió de mouse down i mouse up
func eventClickMouse(up bool, left bool){
	var updwn string
	var lfri string
	if up {
		updwn = "up"
	} else {
		updwn = "down"
	}
	if left {
		lfri = "left"
	} else {
		lfri = "right"
	}
	robotgo.MouseToggle(updwn, lfri)
}

var keyMap = map[string]string{
	//Arrows del teclat
	"ArrowLeft": "left",
	"ArrowDown": "down",
	"ArrowRight": "right",
	"ArrowUp": "up",

	//Tecles especials
	"Tab":"tab",
	"Backspace":"backspace",
	"Enter":"enter",
	"Delete":"delete",
	"Shift": "shift",
	"Alt": "alt",
	"Control": "control",
	" " : "space"}

//Gestió de key down i key up
func eventKey(up bool, key string){
	var updwn string
	if up {
		updwn = "up"
	} else {
		updwn = "down"
	}
	if len(key) == 1 && key != " " {
		robotgo.KeyToggle(key, updwn)
	} else {
		mappedKey, ok := keyMap[key]
		if ok {
			robotgo.KeyToggle(mappedKey, updwn)
		} else {
			log.Println("Rebut tecla no mapejada.")
		}
	}    	
}

    

/*
* Funció adaptada a partir de l'exemple de pion
	https://github.com/pion/webrtc/tree/master/examples/rtp-to-webrtc
*/
func startWebRTCGateway(base64clientSDP string, ch chan string) {
	offer := webrtc.SessionDescription{}
	Decode(base64clientSDP, &offer)

	// We make our own mediaEngine so we can place the sender's codecs in it.  This because we must use the
	// dynamic media type from the sender in our answer. This is not required if we are the offerer
	mediaEngine := webrtc.MediaEngine{}
	err := mediaEngine.PopulateFromSDP(offer)
	if err != nil {
		panic(err)
	}

	// Search for H264 Payload type. If the offer doesn't support H264 exit since
	// since they won't be able to decode anything we send them
	var payloadType uint8
	for _, videoCodec := range mediaEngine.GetCodecsByKind(webrtc.RTPCodecTypeVideo) {
		if videoCodec.Name == "H264" {
			payloadType = videoCodec.PayloadType
			break
		}
	}
	if payloadType == 0 {
		panic("Remote peer does not support H264")
	}

	// Create a new RTCPeerConnection
	api := webrtc.NewAPI(webrtc.WithMediaEngine(mediaEngine))
	peerConnection, err := api.NewPeerConnection(webrtc.Configuration{
		ICEServers: []webrtc.ICEServer{
			{
				URLs: []string{"stun:stun.l.google.com:19302"},
			},
		},
	})
	if err != nil {
		panic(err)
	}

	// Open a UDP Listener for RTP Packets on port 5004
	listener, err := net.ListenUDP("udp", &net.UDPAddr{IP: net.ParseIP("127.0.0.1"), Port: 5004})
	if err != nil {
		panic(err)
	}
	defer func() {
		if err = listener.Close(); err != nil {
			panic(err)
		}
	}()

	log.Println("Iniciant ffmpeg")
	exec.Command("sh","-c","ffmpeg -r 30 -f x11grab -s 1920:1080 -i :99 -pix_fmt yuv420p -tune zerolatency -c:v libx264 -quality realtime -f rtp rtp://127.0.0.1:5004").Start()
	log.Println("ffmpeg iniciat")

	// Listen for a single RTP Packet, we need this to determine the SSRC
	inboundRTPPacket := make([]byte, 4096) // UDP MTU
	n, _, err := listener.ReadFromUDP(inboundRTPPacket)
	if err != nil {
		panic(err)
	}

	// Unmarshal the incoming packet
	packet := &rtp.Packet{}
	if err = packet.Unmarshal(inboundRTPPacket[:n]); err != nil {
		panic(err)
	}

	// Create a video track, using the same SSRC as the incoming RTP Packet
	videoTrack, err := peerConnection.NewTrack(payloadType, packet.SSRC, "video", "pion")
	if err != nil {
		panic(err)
	}
	if _, err = peerConnection.AddTrack(videoTrack); err != nil {
		panic(err)
	}

	// Set the handler for ICE connection state
	// This will notify you when the peer has connected/disconnected
	peerConnection.OnICEConnectionStateChange(func(connectionState webrtc.ICEConnectionState) {
		log.Println("Connection State has changed ", connectionState.String())
	})

	// Set the remote SessionDescription
	if err = peerConnection.SetRemoteDescription(offer); err != nil {
		panic(err)
	}

	// Create answer
	answer, err := peerConnection.CreateAnswer(nil)
	if err != nil {
		panic(err)
	}

	// Sets the LocalDescription, and starts our UDP listeners
	if err = peerConnection.SetLocalDescription(answer); err != nil {
		panic(err)
	}

	// Output the answer in base64 so we can paste it in browser
	log.Println("Enviant SDP")
	ch <- Encode(answer)
	log.Println("SDP enviat.")

	// Read RTP packets forever and send them to the WebRTC Client
	for {
		n, _, err := listener.ReadFrom(inboundRTPPacket)
		if err != nil {
			log.Println("error during read: %s", err)
			panic(err)
		}

		packet := &rtp.Packet{}
		if err := packet.Unmarshal(inboundRTPPacket[:n]); err != nil {
			panic(err)
		}
		packet.Header.PayloadType = payloadType

		if writeErr := videoTrack.WriteRTP(packet); writeErr != nil {
			panic(writeErr)
		}
	}
}


// Allows compressing offer/answer to bypass terminal input limits.
const compress = false


// Encode encodes the input in base64
// It can optionally zip the input before encoding
func Encode(obj interface{}) string {
	b, err := json.Marshal(obj)
	if err != nil {
		panic(err)
	}

	if compress {
		b = zip(b)
	}

	return base64.StdEncoding.EncodeToString(b)
}

// Decode decodes the input from base64
// It can optionally unzip the input after decoding
func Decode(in string, obj interface{}) {
	b, err := base64.StdEncoding.DecodeString(in)
	if err != nil {
		panic(err)
	}

	if compress {
		b = unzip(b)
	}

	err = json.Unmarshal(b, obj)
	if err != nil {
		panic(err)
	}
}

func zip(in []byte) []byte {
	var b bytes.Buffer
	gz := gzip.NewWriter(&b)
	_, err := gz.Write(in)
	if err != nil {
		panic(err)
	}
	err = gz.Flush()
	if err != nil {
		panic(err)
	}
	err = gz.Close()
	if err != nil {
		panic(err)
	}
	return b.Bytes()
}

func unzip(in []byte) []byte {
	var b bytes.Buffer
	_, err := b.Write(in)
	if err != nil {
		panic(err)
	}
	r, err := gzip.NewReader(&b)
	if err != nil {
		panic(err)
	}
	res, err := ioutil.ReadAll(r)
	if err != nil {
		panic(err)
	}
	return res
}
