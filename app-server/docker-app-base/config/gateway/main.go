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
	target := "172.17.0.1:"+port
	log.Println("Connectant amb "+target)
	proxy, err := net.Dial("tcp", target)
	if err != nil {
		log.Println("Error en connectar-se amb el servidor.", err)
		return
	}
	defer proxy.Close()
	lector := bufio.NewReader(proxy)


	//******
	//	2. Inicia el bridge RTP-WebRTC
	//******
	log.Println("Iniciant connexió RTP -> WebRTC")
	esperarConnexioEstablerta := make(chan struct{})
	go StartWebRTCGateway(proxy, lector, esperarConnexioEstablerta)
	<- esperarConnexioEstablerta
	log.Println("Retransmetent RTP -> WebRTC")


	//******
	//	3. Inicia l'event loop pels keystrokes
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