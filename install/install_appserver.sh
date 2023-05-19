#!/bin/bash


if [ "$(id -u)" -ne 0 ]; then
    echo "Executa'm com a root."
    exit 1
fi

mkdir appserver || { echo "Falta de permisos"; exit 1 }
cd appserver


#Demana per la configuració
read -p "Escriu l'URL del servidor de control [Per defecte: https://localhost:3000]: " url 
url=${url:-"https://localhost:3000"} 
read -p "Escriu el secret generat pel servidor: " secret 
read -p "Escriu el host i port del repositori d'imatges [Per defecte: localhost:5000]: " repo 
repo=${repo:-"localhost:5000"} 
read -p "Escriu el path on muntar el sistema de fitxers virtual [Per defecte: /tmp/appvirt/]: " path 
path=${path:-"/tmp/appvirt/"}

#Descarregar el binari
wget https://raw.githubusercontent.com/AniolFernandez/ApplicationVirtualization/main/app-server/appserver_linux_amd64 -O appserver || { echo "No s'ha pogut instal·lar"; exit 1 }
chmod +x appserver

#Comprova si és connexió segura
if [[ $url == https://* ]]; then
  https="true"
else
  https="false"
fi

#Escriu el fitxer de configuració
cat << EOF > config.ini
[Configuration]
SERVER = $url
REPOSITORY = $repo
SECRET = $secret
FSROOT = $path
SECURE = $https
EOF


echo "Fet!"
ls -l
