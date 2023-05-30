package main

import (
    "log"
    "net/http"
    "github.com/gorilla/websocket"
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
        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusNoContent)
            return
        }
        next.ServeHTTP(w, r)
    })
}

//Inicialitza les funcions i processos
func Initialize(){
    LoadConfig()
    KeepAlive()
    InitializeVolumes()
    UpdateImages()
    fillStack(displayStack)
}

func RedirectHandler(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, GLOBAL.Configuration.SERVER, http.StatusFound)
}
 
func main() {
    Initialize()
    http.HandleFunc("/", RedirectHandler)
    http.HandleFunc("/ws", SocketHandler)
    http.HandleFunc("/download", DownloadFile)
    http.HandleFunc("/upload", UploadFile)
    http.HandleFunc("/list", ListDirectory)
    http.HandleFunc("/ping", PingHandler)
    cors := allowCors(http.DefaultServeMux)
    if GLOBAL.Configuration.SECURE {
        log.Fatal(http.ListenAndServeTLS("0.0.0.0:8443", "server.cert", "server.key", cors))
    } else {
        log.Fatal(http.ListenAndServe("0.0.0.0:8443", cors))
    }
}