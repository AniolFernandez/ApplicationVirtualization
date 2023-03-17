package main

import (
	"fmt"
	"log"
	"net/http"
	"encoding/json"
    "github.com/gorilla/websocket"
)

/*
    GESTIÓ DEL WEB-SOCKET:
    Gestió de la connexió d'un socket. Aquest socket pertany a una sola connexió d'un sol client.
    Tot el cicle de vida es manté dins aquesta funció:
    1. Upgrade d'HTTP a WS
    2. Recepció de token d'accés i SDP
    3. Arranc del docker
    4. Retorn d'SDP del docker
    5. Loop d'events
*/
func SocketHandler(w http.ResponseWriter, r *http.Request) {
    var jsonRecv map[string]interface{}

    //*******
    //  1. Upgrade HTTP a WebSocket
    //*******
    socket, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println("Error upgrade http -> ws", err)
        return
    }
    defer socket.Close() //Tanquem la connexió al sortir
 
    //*******
    //  2. Recepció de token d'accés i SDP
    //*******   
    _, msg, err := socket.ReadMessage()
    if err != nil {
        log.Println("Error al llegir missatge", err)
        return
    }
    json.Unmarshal([]byte(msg), &jsonRecv)
    log.Println("Client connectat.")

    //*******
    //  3. S'encén el docker. Esperar a rebre un señal de que ja està actiu i enviar-li l'SDP del client al docker
    //*******

    // Inici de socket local per la comunicació amb docker
    proxyCh := make(chan string) //Canal de comunicació entre socket tcp i ws
    proxyStopSignal := make(chan struct{}) //Canal d'ordre de finalització del socket tcp
    defer close(proxyStopSignal)
    go DockerProxy(proxyCh, proxyStopSignal)

    portSocket := <-proxyCh //Espera a l'inici del socket per obtenir el nº de port
    
    //Inici de la imatge de docker
    dockerStopSignal := make(chan struct{}) //Canal d'ordre de finalització de docker
    defer close(dockerStopSignal)
    go StartDockerImage("appvirt",portSocket,dockerStopSignal)

    proxyCh <- fmt.Sprintln(jsonRecv["sdp"]) //Enviem l'SDP del client
    SDP := <-proxyCh //Espera a rebre l'SDP del contenidor
    if SDP == "" {
        log.Println("No s'ha rebut SDP del contenidor.", err)
        return
    }
    
    //*******
    //  4. Es retorna l'SDP del docker al client
    //*******
    log.Println("Enviant SDP del contenidor al client", SDP)
    err = socket.WriteMessage(websocket.TextMessage, []byte(SDP))
    if err != nil {
        log.Println("Error a l'enviar al client l'SDP del contenidor:", err)
        return
    }
    
    //5. Loop d'events, es reven keys i es reenvien cap al docker.
    for {
        _, message, err := socket.ReadMessage()
        if err != nil {
            break
        }
        proxyCh <- string(message)
    }
}