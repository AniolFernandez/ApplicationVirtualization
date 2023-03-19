package main

import (
	"log"
	"net"
	"bufio"
	"strconv"
    "context"
	"github.com/docker/docker/api/types"
    "github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
)

var display int=99 //TODO: Fer bé, amb pila de ports disponibles

//Ens permet arrancar docker de forma asyncrona
func StartDockerImage(imageName string, port string, close chan struct{}){
	log.Println("Inicialitzant el contenidor (D:",display," P:",port,")...")
	//Obté docker API
	dockerCli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		log.Println("Error en obtenir client docker", err)
		return
	}

	//Inicialitza el contenidor
	resp, err := dockerCli.ContainerCreate(context.Background(), &container.Config{
		Image: imageName,
		Env: []string{"PROXY_PORT="+port,"DISPLAY=:"+strconv.Itoa(display)},
	}, &container.HostConfig{
		NetworkMode: container.NetworkMode("host"),
        AutoRemove:  true,
	}, nil, nil, "")
	if err != nil {
		log.Println("Error en iniciar la imatge de docker", err)
		return
	}
    display = display+1

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
func DockerProxy(WSinTCPout chan string, TCPinWSout chan string, close chan struct{}){
    defer func() {
        TCPinWSout<-"" //Enviar str buit per finalitzar
    }()

    //Inicia socket tcp escoltant a un port aleatori
    lstn, err := net.Listen("tcp", "localhost:0")
    if err != nil {
        log.Println("Error en obrir socket d'escolta proxy intern:", err)
        return
    }
    defer lstn.Close() //Tancar al sortir
    TCPinWSout <- strconv.Itoa(lstn.Addr().(*net.TCPAddr).Port) //Enviem el nº de port obert

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

    case err := <-errCh: //Error en acceptar la connexió
        log.Println("Error en acceptar socket proxy", err)
        return

    case proxy = <-connCh: //Connexió establerta
        log.Println("Establerta connexió amb el contenidor.")
        TCPinWSout <- "ready" //Enviem senyalització per a iniciar WebRTC
        defer proxy.Close() //Finalitza en sortir
    }

    //Iniciem una goroutine per llegir els missatges rebuts del docker de forma asyncrona
    go func() {
        lector := bufio.NewReader(proxy) //Lector buffer
        for{
            msgTcp, err := lector.ReadString('\n')
            if err != nil {
                log.Println("Error en el forwarding de paquets entre TCP->WS", err)
                TCPinWSout <- ""
                break;
            }
            TCPinWSout <- msgTcp
        }
    }()

    //Ens posem a l'espera de rebre l'SDP del docker o bé rebre senyal de finalització
    log.Println("Proxy TCP <-> WS iniciat.")
    for{
        select {
        case <-close: //Finalitza per senyal
            log.Println("Finalitzant socket proxy per senyal de finalització.")
            return
    
        case pktWS:= <- WSinTCPout: //Missatge rebut del WS (str)
            _, err = proxy.Write([]byte(pktWS+"\n")) //Forward del paquet
            if err != nil {
                log.Println("Error en el forwarding de paquets entre WS->TCP", err)
                return
            }
        }
    }
}