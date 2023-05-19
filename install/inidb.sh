#!/bin/bash

sudo apt-get install mysql-client-core-8.0 -y > /dev/null

read -p "Escriu el host on es situa la BDD: [Per defecte: 127.0.0.1]: " MYSQL_HOST 
MYSQL_HOST=${MYSQL_HOST:-"127.0.0.1"} 
read -p "Escriu la cotrasenya de root [Per defecte: root]: " MYSQL_PASSWORD 
MYSQL_PASSWORD=${MYSQL_PASSWORD:-"root"} 


MYSQL_USER="root"

wget https://raw.githubusercontent.com/AniolFernandez/ApplicationVirtualization/main/install/ini.sql -O ini.sql

mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD < ini.sql && echo "BDD inicialitzada."
rm ini.sql