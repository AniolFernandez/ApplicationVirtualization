package main

import (
    "crypto/rand"
	"crypto/sha256"
    "encoding/hex"
	"os"
	"os/exec"
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