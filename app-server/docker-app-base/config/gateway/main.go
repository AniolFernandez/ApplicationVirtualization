package main

import (
	"os"
	"net"
	"bufio"
	"log"
	"strings"
	"encoding/json"
)

func main(){
	Ini()

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
	go StartWebRTCGateway(SDP, chGateway)
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
		EventSwitch(jsonRecv)
	}
}