package main

import (
	"log"
	"strings"
	"os"
	"os/exec"
	"net/http"
	"io/ioutil"
    "crypto/rand"
	"crypto/sha256"
    "encoding/hex"
	"encoding/json"
	"path/filepath"
)

type Directory struct {
	Fullpath string `json:"fullpath"`
	Parent string `json:"parent"`
	Files []File `json:"files"`
}
	
type File struct {
	Name string `json:"name"`
	IsFile bool `json:"isFile"`
}

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
		if _, err := os.Stat(GLOBAL.Configuration.FSROOT+dir); err != nil {
			break //No existeix el dir; podem continuar
		}
	}
	os.MkdirAll(GLOBAL.Configuration.FSROOT+dir, os.ModePerm)
	exec.Command("chown", "-R", "1000:1000", GLOBAL.Configuration.FSROOT+dir).Run()
	return dir, GLOBAL.Configuration.FSROOT+dir
}

//Cleanup i recreació
func InitializeVolumes(){
	DeleteDirectory(GLOBAL.Configuration.FSROOT)
	os.MkdirAll(GLOBAL.Configuration.FSROOT, os.ModePerm)
}

//Elimina les dades del directori
func DeleteDirectory(dir string){
	os.RemoveAll(dir)
}

const PARAMETRE_FITXER = "file"
const PARAMETRE_PATH = "path"
const PARAMETRE_TOKEN = "token"

//Descarrega el fitxer d'un token i path donat.
//Exemple de crida: http://localhost/download?token=xxxxxxxxxxx&path=pathdelrecurs&file=nomdelrecurs
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
	pathComplert := _sanitizePath(GLOBAL.Configuration.FSROOT + token + path + fitxer)
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


//Puja el fitxer d'un token i path donat.
//Exemple de crida: http://localhost/upload?token=xxxxxxxxxxx&path=pathdelrecurs
func UploadFile(w http.ResponseWriter, r *http.Request) {
	//Obtenció dels paràmetres i validació
	token := r.URL.Query().Get(PARAMETRE_TOKEN)
	path := r.URL.Query().Get(PARAMETRE_PATH)
	if path == "" || token == "" {
		http.Error(w, "Falten paràmetres", http.StatusBadRequest)
		return
	}

	//Limitació per mida
    err := r.ParseMultipartForm(10 << 20) // Limit de mida del fitxer: 10MB
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    //Llegim el fitxer del formulari
    file, handler, err := r.FormFile("file")
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    defer file.Close()


    // Guardem el fitxer
	sanitizedPath := _sanitizePath(GLOBAL.Configuration.FSROOT + token + path)
    filename := filepath.Join(sanitizedPath, handler.Filename)
    data, err := ioutil.ReadAll(file)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    err = ioutil.WriteFile(filename, data, 0644)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
	exec.Command("chown", "-R", "1000:1000", sanitizedPath).Run()
}



//Llista el contingut d'un token i path donat.
//Exemple de crida: http://localhost/list?token=xxxxxxxxxxx&path=pathdelrecurs
func ListDirectory(w http.ResponseWriter, r *http.Request) {
	//Obtenció dels paràmetres i validació
	token := r.URL.Query().Get(PARAMETRE_TOKEN)
	path := r.URL.Query().Get(PARAMETRE_PATH)
	if path == "" || token == "" {
		http.Error(w, "Falten paràmetres", http.StatusBadRequest)
		return
	}
	if string(path[len(path)-1]) == "/" {
		path = path[:len(path)-1]
	}

	//Creació del path complert del recurs a llistar
	pathComplert := _sanitizePath(GLOBAL.Configuration.FSROOT + token + path)


	//Obtenim els continguts del directori
	files, err := ioutil.ReadDir(pathComplert)
	if err != nil {
		log.Println("Error en llistar dir:",err)
	}

	var fileList = []File{}
	for _, file := range files {
		fileList = append(fileList, File{
			Name:   file.Name(),
			IsFile: !file.IsDir(),
		})
	}

	dir := Directory{
		Fullpath: _sanitizePath(path),
		Parent:   filepath.Dir(path),
		Files:    fileList,
	}


	//Retorn del resultat
	jsonBytes, _ := json.Marshal(dir)
	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonBytes)
}


func _sanitizePath(path string) string{
	return strings.Replace(strings.Replace(path, "../", "./", -1), "//", "/", -1)
}
