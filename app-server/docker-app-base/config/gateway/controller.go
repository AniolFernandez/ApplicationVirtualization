package main

import (
	"os"
	"log"
	"math"
	"github.com/go-vgo/robotgo"
)

var xMax int
var yMax int

//Inicialització del controlador 
func Ini(){
	display, _ := os.LookupEnv("DISPLAY") //Llegeix el nº de port assignat pel servidor
	robotgo.SetXDisplayName(display)
	xMax, yMax = robotgo.GetScreenSize()
	robotgo.MoveMouse(xMax, yMax) //Iniciar abaix a la dreta
}

//Switch d'events
func EventSwitch(eventJSON map[string]interface{}){
	switch eventJSON["type"] {
	case "mv": //Mouse move
		eventMoveMouse(eventJSON)
	case "mc": //Mouse click
		eventClickMouse(eventJSON["up"].(bool), eventJSON["left"].(bool))
	case "kp": //key press
		eventKey(eventJSON["up"].(bool), eventJSON["key"].(string))
	default:
		log.Println("Rebut event desconegut.")
	}
}

//Gestió d'event movimentn de mouse amb control de límits
func eventMoveMouse(eventMoveMouseJSON map[string]interface{}){
	x := int(math.Max(math.Min(math.Round(eventMoveMouseJSON["x"].(float64)), float64(xMax)),0))
	y := int(math.Max(math.Min(math.Round(eventMoveMouseJSON["y"].(float64)), float64(yMax)),0))
	robotgo.MoveMouse(x, y)
}

//Gestió de mouse down i mouse up
func eventClickMouse(up bool, left bool){
	var updwn string
	var lfri string
	if up {
		updwn = "up"
	} else {
		updwn = "down"
	}
	if left {
		lfri = "left"
	} else {
		lfri = "right"
	}
	robotgo.MouseToggle(updwn, lfri)
}

var keyMap = map[string]string{
	//Arrows del teclat
	"ArrowLeft": "left",
	"ArrowDown": "down",
	"ArrowRight": "right",
	"ArrowUp": "up",

	//Tecles especials
	"Tab":"tab",
	"Backspace":"backspace",
	"Enter":"enter",
	"Delete":"delete",
	"Shift": "shift",
	"Alt": "alt",
	"Control": "control",
	" " : "space"}

//Gestió de key down i key up
func eventKey(up bool, key string){
	var updwn string
	if up {
		updwn = "up"
	} else {
		updwn = "down"
	}
	if len(key) == 1 && key != " " {
		robotgo.KeyToggle(key, updwn)
	} else {
		mappedKey, ok := keyMap[key]
		if ok {
			robotgo.KeyToggle(mappedKey, updwn)
		} else {
			log.Println("Rebut tecla no mapejada.")
		}
	}    	
}