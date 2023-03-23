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

 
func main() {
    InitializeVolumes()
    http.HandleFunc("/", SocketHandler)
    cors := allowCors(http.DefaultServeMux)
    //log.Fatal(http.ListenAndServeTLS("0.0.0.0:8443", "cert.pem", "key.pem", cors))
    log.Fatal(http.ListenAndServe("0.0.0.0:8443", cors))
}