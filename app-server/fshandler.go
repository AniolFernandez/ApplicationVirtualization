package main

import (
	"os"
	"os/exec"
	"net/http"
	"log"
	"strings"
    "crypto/rand"
	"crypto/sha256"
    "encoding/hex"
)

const ROOT = "/tmp/appvirt/"

//Genera bytes aleatoris per a codificar l'accés a fitxers i assegurar-nos que només qui ha accedir a la sessió podrà accedir al dir
func _genRandomBytes() string {
    bytes := make([]byte, 50)
    rand.Read(bytes)
	hash := sha256.Sum256(bytes)
    return hex.EncodeToString(hash[:])
}

//Inicialitza un directori amb nom aleatori per tal de ser usat com a directori temporal per a l'usuari
func InitializeDirectory() (string, string) {
	var dir string
	for{
		dir = _genRandomBytes()
		if _, err := os.Stat(ROOT+dir); err != nil {
			break //No existeix el dir; podem continuar
		}
	}
	os.MkdirAll(ROOT+dir, os.ModePerm)
	exec.Command("chown", "-R", "1000:1000", ROOT+dir).Run()
	return dir, ROOT+dir
}

//Cleanup i recreació
func InitializeVolumes(){
	DeleteDirectory(ROOT)
	os.MkdirAll(ROOT, os.ModePerm)
}

//Elimina les dades del directori
func DeleteDirectory(dir string){
	os.RemoveAll(dir)
}

const PARAMETRE_FITXER = "file"
const PARAMETRE_PATH = "path"
const PARAMETRE_TOKEN = "token"


func DownloadFile(w http.ResponseWriter, r *http.Request) {
	//Obtenció dels paràmetres i validació
	token := r.URL.Query().Get(PARAMETRE_TOKEN)
	path := r.URL.Query().Get(PARAMETRE_PATH)
	fitxer := r.URL.Query().Get(PARAMETRE_FITXER)
	if fitxer == "" || path == "" || token == "" {
		http.Error(w, "Falten paràmetres", http.StatusBadRequest)
		return
	}

	//Creació del path complert del recurs
	pathComplert := strings.Replace(ROOT + token + path + fitxer, "/../", "/./", -1)
	log.Println("Downloading: ",pathComplert)

	//Servim el fitxer
	file, err := os.Open(pathComplert)
	if err != nil {
		log.Println("Error en obrir: ",err)
		http.Error(w, "El fitxer no existeix", http.StatusInternalServerError)
		return
	}
	defer file.Close()

	fileInfo, err := file.Stat()
	if err != nil {
		log.Println("Error en obtenir stats: ",err)
		http.Error(w, "No s'ha pogut obtenir les dades el fitxer", http.StatusInternalServerError)
		return
	}

	//Headers de resposta per permetre selecció de descàrrega
	w.Header().Set("Content-Type", http.DetectContentType(make([]byte, 0, fileInfo.Size())))
	w.Header().Set("Content-Disposition", "attachment; filename="+fitxer)
	http.ServeContent(w, r, fitxer, fileInfo.ModTime(), file)
}