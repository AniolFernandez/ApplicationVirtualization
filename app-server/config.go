package main

import (
	"log"
    "github.com/go-ini/ini"
)

type Config struct {
    Configuration struct {
        SERVER		string `ini:"SERVER"`
        REPOSITORY	string `ini:"REPOSITORY"`
        SECRET 		string `ini:"SECRET"`
		FSROOT		string `ini:"FSROOT"`
    } `ini:"Configuration"`
}

var GLOBAL Config
var TOKEN string

//Inicialitza la configuració
func LoadConfig() {
    cfg, err := ini.Load("config.ini")
    if err != nil {
		panic(err)
    }

    err = cfg.MapTo(&GLOBAL)
    if err != nil {
		panic(err)
    }

	TOKEN = GetAccesToken()

    log.Printf("Loaded config:\n%+v\n", GLOBAL)
}