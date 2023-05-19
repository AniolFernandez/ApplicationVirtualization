#!/bin/bash
if [ "$(id -u)" -ne 0 ]; then
    echo "Executa'm com a root."
    exit 1
fi

mkdir appserver
cd appserver


#Demana per la configuració
read -p "Escriu l'URL del servidor de control [Per defecte: https://localhost:3000]: " url 
url=${url:-"https://localhost:3000"} 
read -p "Escriu el secret generat pel servidor: " secret 
read -p "Escriu el host i port del repositori d'imatges [Per defecte: localhost:5000]: " repo 
repo=${repo:-"localhost:5000"} 
read -p "Escriu el path on muntar el sistema de fitxers virtual [Per defecte: /tmp/appvirt/]: " path 
path=${path:-"/tmp/appvirt/"}

#Certificat autosignat
if [[ $url == https://* ]]; then
    echo "Estàs usant connexió segura i requereixes certificat"
    read -p "Vols generar automàticament el certificat X.509? [S/n]: " sino
    case $sino in
        [Nn]* ) echo "No s'ha generat el certificat. Siusplau, introdueix el teu propi certificat i clau en el directori appserver amb el nom `server.cert` i `server.key`";;
        * ) apt-get install openssl -y > /dev/null; openssl req -x509 -newkey rsa:4096 -nodes -keyout server.key -out server.cert -days 365 -subj "/C=ES/ST=Catalunya/L=Girona/O=UdG/OU=TFG/CN=appvirt.test";;
    esac
fi

#Descarregar el binari
wget https://raw.githubusercontent.com/AniolFernandez/ApplicationVirtualization/main/app-server/appserver_linux_amd64 -O appserver
if [[ $? -gt 0 ]]; then
    echo "No s'ha pogut instal·lar"
    exit 1
fi
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
pwd
ls -l

rm "$0"
exit 0