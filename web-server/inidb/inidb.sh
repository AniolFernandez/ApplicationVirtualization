#!/bin/bash

sudo apt-get install mysql-client-core-8.0 -y

MYSQL_USER="root"
MYSQL_PASSWORD="root"
MYSQL_HOST="127.0.0.1"
SQL_FILE="ini.sql"

mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD < $SQL_FILE