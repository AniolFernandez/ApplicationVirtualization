#!/bin/bash
if [ "$(id -u)" -ne 0 ]; then
    echo "Executa'm com a root."
    exit 1
fi

mkdir webserver
cd webserver

mysql=""
registry=""
web=""
volumes=""

#Pregunta per BDD
echo
echo
echo "BASE DE DADES"
read -p "Vols realitzar la instal·lació de la BDD en aquesta màquina? [S/n]: " sino
case $sino in
    [Nn]* ) echo "Seguint amb la instal·lació sense BDD...";;
    * ) read -p "Escriu la contraseña de root per la BDD [Per defecte: root]: " rootpw 
        rootpw=${rootpw:-"root"} 
        read -p "Escriu l'usuari de BDD a utilitzar [Per defecte: admin]: " dbuser 
        dbuser=${dbuser:-"admin"} 
        read -p "Escriu la contrasenya de BDD a utilitzar [Per defecte: admin]: " dbpass 
        dbpass=${dbpass:-"admin"} 
        mysql=$(cat << EOF
  #Servidor de BDD local. 
  mysql:
    image: mysql:latest
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: $rootpw
      MYSQL_USER: $dbuser
      MYSQL_PASSWORD: $dbpass
      MYSQL_DATABASE: appvirt
    network_mode: "host"
    volumes:
      - db:/var/lib/mysql
    command: --bind-address=0.0.0.0 --default-authentication-plugin=mysql_native_password
EOF
)
        ;;
esac



#Pregunta per registre
echo
echo
echo "REGISTRE"
read -p "Vols realitzar la instal·lació del registre en aquesta màquina? [S/n]: " sino
case $sino in
    [Nn]* ) echo "Seguint amb la instal·lació sense registre...";;
    * ) echo "Assignant registre..."
        registry=$(cat << EOF
  #Docker Registry
  registry:
    image: registry:2
    restart: always
    network_mode: "host"
    volumes:
      - registry-data:/var/lib/registry
EOF
)
        ;;
esac

#Assignació de volums
if [ -n "$mysql" ] && [ -n "$registry" ]; then
    volumes=$(cat << EOF
volumes:
  db:
  registry-data:
EOF
)
elif [ -n "$mysql" ]; then
    volumes=$(cat << EOF
volumes:
  db:
EOF
)
elif [ -n "$registry" ]; then
    volumes=$(cat << EOF
volumes:
  registry-data:
EOF
)
fi

#Pregunta per servidor de control
echo
echo
echo "SERVIDOR DE CONTROL I WEB"
read -p "Vols realitzar la instal·lació del servidor de control en aquesta màquina? [S/n]: " sino
case $sino in
    [Nn]* ) echo "Seguint amb la instal·lació sense servidor de control...";;
    * ) 
        secret=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)
        read -p "Escriu la contrasenya per a l'usuari administrador [Per defecte: admin]: " webpass 
        webpass=${webpass:-"admin"} 
        read -p "Escriu el port del servei: [Per defecte: 3000]: " port 
        port=${port:-"3000"} 
        read -p "Escriu l'adreça IP pública del servei: [Per defecte: 127.0.0.1]: " pubip 
        pubip=${pubip:-"127.0.0.1"} 
        if [ -z "$mysql" ]; then
            read -p "Escriu el host on es situa la BDD: [Per defecte: 127.0.0.1]: " dbhost 
            dbhost=${dbhost:-"127.0.0.1"} 
            read -p "Escriu l'usuari de BDD a utilitzar [Per defecte: admin]: " dbuser 
            dbuser=${dbuser:-"admin"} 
            read -p "Escriu la contrasenya de BDD a utilitzar [Per defecte: admin]: " dbpass 
            dbpass=${dbpass:-"admin"}
        else
            dbhost="127.0.0.1"
        fi
        if [ -z "$registry" ]; then
            read -p "Escriu el host on es situa el registre: [Per defecte: localhost:5000]" dbhost
            reghost=${reghost:-"localhost:5000"}
        else
            reghost="localhost:5000"
        fi

        read -p "Vols utilitzar el servei segur (HTTPS)? [S/n]: " sino
        http=""
        case $sino in
            [Nn]* )
                echo "Usant servei en mode http."
                http="HTTP: true"
            ;;
            * )
                read -p "Vols generar automàticament el certificat X.509? [S/n]: " sino
                case $sino in
                    [Nn]* ) echo "No s'ha generat el certificat. Siusplau, introdueix el teu propi certificat i clau en el directori appserver amb el nom `server.cert` i `server.key`";;
                    * ) openssl req -x509 -newkey rsa:4096 -nodes -keyout server.key -out server.cert -days 365 -subj "/C=ES/ST=Catalunya/L=Girona/O=UdG/OU=TFG/CN=appvirt.test";;
                esac
            ;;
        esac
        web=$(cat << EOF
  #WebServer
  webserver:
    image: aniolfdz/appvirt:web
    restart: always
    environment:
      DB_HOST: $dbhost
      DB_USER: $dbuser
      DB_PASSWORD: $dbpass
      DB_DATABASE: appvirt
      ADMIN_PW: $webpass 
      LOCAL_ADDRESS: $pubip
      PORT: $port
      REGISTRY_HOST: $reghost
      SECRET: $secret
      $http
    network_mode: "host"
    depends_on:
      - mysql
    volumes:
      - ./server.cert:/app/server.cert
      - ./server.key:/app/server.key
EOF
)
        ;;
esac









#Escriu el fitxer de configuració
cat << EOF > docker-compose.yml
version: '3'
services:
$mysql

$registry

$web

$volumes
EOF


echo "Fet!"
if [ -n "$secret" ]; then
    echo 
    echo 
    echo 
    echo 
    echo 
    echo 
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    echo "!!!                       IMPORTANT                             !!!"
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    echo
    echo "Emmagatzema i recorda el secret per a instal·lar servidors d'apps."
    echo "---> SECRET: $secret"
    echo
fi



exit 0