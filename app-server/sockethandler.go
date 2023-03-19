package main

import (
	"log"
	"net/http"
//	"encoding/json"
    "github.com/gorilla/websocket"
)

/*
    GESTIÓ DEL WEB-SOCKET:
    Gestió de la connexió d'un socket. Aquest socket pertany a una sola connexió d'un sol client.
    Tot el cicle de vida es manté dins aquesta funció:
    1. Upgrade d'HTTP a WS
    2. TODO: Permisos
    3. Arranc del docker assignant el port d'escolta local
    4. Loop d'events (teclat, ratolí)
*/
func SocketHandler(w http.ResponseWriter, r *http.Request) {
    //var jsonRecv map[string]interface{}

    //*******
    //  1. Upgrade HTTP a WebSocket
    //*******
    socket, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println("Error upgrade http -> ws", err)
        return
    }
    defer socket.Close() //Tanquem la connexió al sortir
    log.Println("Client connectat.")
 
    //*******
    //  2. TODO: AQUI CALDRÍA REBRE QUINA APP ENCENDRE I COMPROVAR ELS PERMISOS
    //*******
    /*
    _, msg, err := socket.ReadMessage()
    if err != nil {
        log.Println("Error al llegir missatge", err)
        return
    }
    json.Unmarshal([]byte(msg), &jsonRecv)
    */

    //*******
    //  3. S'encén el docker. Esperar a rebre un señal de que ja està actiu i estableix la connexió
    //*******

    // Inici de socket local per la comunicació amb docker
    WSinTCPout := make(chan string) //Canal de comunicació entre socket ws i tcp
    TCPinWSout := make(chan string) //Canal de comunicació entre socket tcp i ws
    proxyStopSignal := make(chan struct{}) //Canal d'ordre de finalització del socket tcp
    defer close(proxyStopSignal)
    go DockerProxy(WSinTCPout, TCPinWSout, proxyStopSignal)

    var portSocket string = <- TCPinWSout //Espera a l'inici del socket per obtenir el nº de port
    
    //Inici de la imatge de docker
    dockerStopSignal := make(chan struct{}) //Canal d'ordre de finalització de docker
    defer close(dockerStopSignal)
    go StartDockerImage("appvirt",portSocket,dockerStopSignal)

    
    
    //*******
    //  4. Inici del proxy WS <-> TCP
    //*******
    go func(){ //Llegir tot el que arriba del WS i reenviar-ho cap al docker
        for {
            _, message, err := socket.ReadMessage()
            if err != nil {
                break
            }
            WSinTCPout <- string(message)
        }
    }()
    for {//Llegir tot el que arriba de TCP i reenviar-ho cap al client
        var tcpMsg string = <- TCPinWSout
        if tcpMsg == ""{ //Parem si es rep stop
            log.Println("Stop signal rebut.")
            break
        }
        err = socket.WriteMessage(websocket.TextMessage, []byte(tcpMsg))
        if err != nil { //Parem si hi ha error
            log.Println("Error a l'enviar TCP -> WS", err)
            break
        }
    }

    //Fi.
    log.Println("Finalitzat Proxy WS <-> TCP.")
}