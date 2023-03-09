package main

import (
    "fmt"
    "log"
    "net"
    "bufio"
    "context"
    "net/http"
    "encoding/json"
    "github.com/gorilla/websocket"
    "github.com/docker/docker/api/types"
    "github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
)

// Permetem accés des de qualsevol origen al fer l'upgrade http -> ws
var upgrader = websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool {
        return true
    },
} 

// Permetem l'accés a peticions http des de qualsevol origen
func allowCors(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        //w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        //w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusNoContent)
            return
        }
        next.ServeHTTP(w, r)
    })
}
 
 

/*
    GESTIÓ DEL SOCKET:
    Gestió de la connexió d'un socket. Aquest socket pertany a una sola connexió d'un sol client.
    Tot el cicle de vida es manté dins aquesta funció:
    1. Upgrade d'HTTP a WS
    2. Recepció de token d'accés i SDP
    3. Arranc del docker i espera
    4. Retorn d'SDP del docker
    5. Loop d'events
*/
func socketHandler(w http.ResponseWriter, r *http.Request) {
    var jsonRecv map[string]interface{}

    //1. Upgrade HTTP a WebSocket
    socket, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Print("Error upgrade http -> ws", err)
        return
    }
    defer log.Print("Desconnexió.")
    defer socket.Close() //Tanquem la connexió al sortir
 
    //2. Recepció de token d'accés i SDP
    _, msg, err := socket.ReadMessage()
    if err != nil {
        log.Println("Error al llegir missatge", err)
        return
    }
    json.Unmarshal([]byte(msg), &jsonRecv)
    log.Println("Client connectat. SDP: ", jsonRecv["sdp"])

    //3. S'encén el docker. Esperar a rebre un señal de que ja està actiu i enviar-li l'SDP del client al docker

    //Inicia socket tcp escoltant per localhost a un port aleatori
    lstn, err := net.Listen("tcp", "localhost:0")
    if err != nil {
        log.Print("Error en obrir socket d'escolta proxy intern:", err)
        return
    }
    defer lstn.Close() //Tancar al sortir

    //Inicia docker amb la imatge que es vol executar
    log.Print("Inicialitzant el contenidor...")
    dockerCli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
    if err != nil {
		log.Print("Error en obtenir client docker", err)
        return
	}


    resp, err := dockerCli.ContainerCreate(context.Background(), &container.Config{
		Image: "appvirt",
        Env: []string{fmt.Sprint("PROXY_PORT=",lstn.Addr().(*net.TCPAddr).Port)},
	}, &container.HostConfig{
        NetworkMode: container.NetworkMode("host"),
    }, nil, nil, "")
	if err != nil {
		log.Print("Error en iniciar la imatge de docker", err)
        return
	}

	// Inicia el contenidor
	if err := dockerCli.ContainerStart(context.Background(), resp.ID, types.ContainerStartOptions{}); err != nil {
		log.Print("Error en iniciar la imatge de docker", err)
        return
	}
    //Parar i esboorrar el contenidor un cop finalitzat
    defer dockerCli.ContainerStop(context.Background(), resp.ID, container.StopOptions{});
    defer dockerCli.ContainerRemove(context.Background(), resp.ID, types.ContainerRemoveOptions{Force: true, RemoveVolumes: true,});


    //Comença a escoltar peticions a l'espera de l'arranc de docker
    log.Print("Esperant resposta del contenidor...")
    proxy, err := lstn.Accept()
    if err != nil {
        fmt.Println("Error en acceptar socket proxy", err)
        return
    }
    defer proxy.Close() //Finalitza en sortir

    log.Print("Contenidor iniciat i connectat!")
    scanner := bufio.NewScanner(proxy)
    for scanner.Scan() {
        // Handle packets
        packet := scanner.Text()
        fmt.Println("Received packet:", packet)
    }
    if err := scanner.Err(); err != nil {
        fmt.Println("Error reading packets:", err.Error())
        return
    }
    // defer tancar docker!

    //4. Aqui s'ha de retornar l'SDP del docker al client
    err = socket.WriteMessage(websocket.TextMessage, []byte("Aqui tens l'SDP del docker crack!"))
    if err != nil {
        log.Println("Error a l'enviar de tornada l'SDP:", err)
        return
    }
    
    //5. Loop d'events, es reven keys i es reenvien cap al docker.
    for {
        _, message, err := socket.ReadMessage()
        if err != nil {
            log.Println("Error al llegir missatge", err)
            break
        }
        log.Println("Error al llegir missatge %s", message)
    }
}

 
func main() {
    http.HandleFunc("/", socketHandler)
    cors := allowCors(http.DefaultServeMux)
    log.Fatal(http.ListenAndServeTLS("0.0.0.0:8443", "cert.pem", "key.pem", cors))
}