#!/bin/bash
apt-get install coturn -y

cat <<EOT >> /etc/default/coturn
TURNSERVER_ENABLED=1
listening-ip=0.0.0.0
listening-port=3478/udp
user=prova:prova
EOT

service coturn restart