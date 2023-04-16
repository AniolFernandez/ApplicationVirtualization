package main

import (
    "bytes"
    "encoding/json"
    "net/http"
	"io/ioutil"
	"runtime"
	"github.com/shirou/gopsutil/cpu"
	"time"
)

const SECONDS_BETWEEN_KEEPALIVE = 10 //10 s
var API = "http://192.168.56.1:3000/server/"
var token = GetAccesToken()

type Status struct {
	RAM float64 `json:"ram"`
	CPU float64 `json:"cpu"`
}

//Obté l'status actual del servidor
func getStatus() Status {
	cpuUsage, _ := cpu.Percent(0, false)
	var memStats runtime.MemStats
	runtime.ReadMemStats(&memStats)
	memUsage := float64(memStats.Alloc) / float64(memStats.Sys) * 100
	status := Status{
		RAM: memUsage,
		CPU: cpuUsage[0],
	}
	return status
}


//Funció per reportar l'status del servidor
func KeepAlive(){
	go func(){
		for {
			payload, _ := json.Marshal(getStatus())
			req, _ := http.NewRequest("POST", API+"keepalive", bytes.NewBuffer(payload))
			req.Header.Set("Authorization", "Bearer "+token)
			req.Header.Set("Content-Type", "application/json")
			client := &http.Client{}
			resp, _ := client.Do(req)
			defer resp.Body.Close()
			ioutil.ReadAll(resp.Body) //Espera resposta
			time.Sleep(SECONDS_BETWEEN_KEEPALIVE * time.Second)
		}
	}()
	
}
