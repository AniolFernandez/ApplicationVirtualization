package main

import (
	"fmt"
	"log"
	"net"
	"bufio"
	"strconv"
    "context"
	"github.com/docker/docker/api/types"
    "github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
)

//Ens permet arrancar docker de forma asyncrona
func StartDockerImage(imageName string, port string, close chan struct{}){
	log.Println("Inicialitzant el contenidor...")
	//Obté docker API
	dockerCli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		log.Println("Error en obtenir client docker", err)
		return
	}

	//Inicialitza el contenidor
	resp, err := dockerCli.ContainerCreate(context.Background(), &container.Config{
		Image: imageName,
		Env: []string{fmt.Sprintln("PROXY_PORT=",port),"DISPLAY=:99"},
	}, &container.HostConfig{
		NetworkMode: container.NetworkMode("host"),
        AutoRemove:  true,
	}, nil, nil, "")
	if err != nil {
		log.Println("Error en iniciar la imatge de docker", err)
		return
	}

	// Inicia el contenidor
	if err := dockerCli.ContainerStart(context.Background(), resp.ID, types.ContainerStartOptions{}); err != nil {
		log.Println("Error en iniciar la imatge de docker", err)
		return
	}

	//Parar i esboorrar el contenidor un cop finalitzat
	defer dockerCli.ContainerStop(context.Background(), resp.ID, container.StopOptions{})
	defer dockerCli.ContainerRemove(context.Background(), resp.ID, types.ContainerRemoveOptions{Force: true, RemoveVolumes: true,})
	defer log.Println("Finalitzant contenidor")
	<-close
}


//Comunicació asyncrona entre docker i servidor per socket TCP
func DockerProxy(ch chan string, close chan struct{}){
    defer func() {
        ch<-"" //Enviar str buit per finalitzar
    }()

    //Inicia socket tcp escoltant per localhost a un port aleatori
    lstn, err := net.Listen("tcp", "localhost:0")
    if err != nil {
        log.Println("Error en obrir socket d'escolta proxy intern:", err)
        return
    }
    defer lstn.Close() //Tancar al sortir
    ch <- strconv.Itoa(lstn.Addr().(*net.TCPAddr).Port) //Enviem el nº de port obert

    //Creem un canal per rebre la connexió o error del socket proxy
    connCh := make(chan net.Conn)
    errCh := make(chan error)

    //Iniciem una goroutine per acceptar la connexió del socket proxy
    go func() {
        log.Println("Esperant resposta del contenidor...")
        proxy, err := lstn.Accept()
        if err != nil {
            errCh <- err
            return
        }
        connCh <- proxy
    }()

    //Ens posem a l'espera de rebre connexió amb el docker o bé rebre senyal de finalització
    var proxy net.Conn
    select {
    case <-close: //Finalitza per senyal
        log.Println("Finalitzant socket proxy sense haver establert connexió amb el contenidor.")
        return

    case proxy = <-connCh: //Connexió establerta
        log.Println("Establerta connexió amb el contenidor.")
        defer proxy.Close() //Finalitza en sortir
        

    case err := <-errCh: //Error en acceptar la connexió
        fmt.Println("Error en acceptar socket proxy", err)
        return
    }

    SDPCli := <- ch //Esperem a tenir l'SDP del client
    _, err = proxy.Write([]byte(SDPCli)) //Enviem l'SDP
    if err != nil {
        fmt.Println("Error en enviar SDP del client al contenidor", err)
        return
    }

    proxyCh := make(chan string) //Creem un canal per rebre dades del docker
    lector := bufio.NewReader(proxy) //Lector buffer

    //Iniciem una goroutine per acceptar la connexió del socket proxy
    go func() {
        SDP, err := lector.ReadString('\n')
        if err != nil {
            log.Println("No s'ha pogut llegir l'SDP del contenidor", err)
            proxyCh <- ""
        }
        proxyCh <- SDP
    }()

    //Ens posem a l'espera de rebre l'SDP del docker o bé rebre senyal de finalització
    log.Println("Esperant a rebre SDP del contenidor.")
    select {
    case <-close: //Finalitza per senyal
        log.Println("Finalitzant socket proxy sense haver rebut SDP.")
        return

    case proxy := <-proxyCh: //SDP rebut
        log.Println("Rebut SDP del contenidor.",proxy)
        ch <- proxy //Push del SDP
    }

    //Executar l'event loop (rebre dades del WS i reenviarles pel socket)
    for {
        select {
        case <-close: //Finalitza per senyal
            log.Println("Finalitzant socket proxy.")
            return
    
        case pkt:= <- ch: //Missatge rebut del WS (str)
            _, err = proxy.Write([]byte(pkt+"\n")) //Forward del paquet
            if err != nil {
                fmt.Println("Error en el forwarding de paquets entre WS i TCP", err)
                return
            }
        }
    }
}