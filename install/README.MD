# Instal·lació
A partir dels scripts proporcionats en aquest directori es pot realitzar la instal·lació del servei.

# Prerequisits:
Cal tenir instal·lat docker al sistema. Segueix les [instruccions oficials](https://docs.docker.com/engine/install/ubuntu/).

## Instal·lació del servidor de control
### [bdd + registre + web a selecció]
Situa't al directori d'instal·lació i executa la següent comanda:
```
wget https://raw.githubusercontent.com/AniolFernandez/ApplicationVirtualization/main/install/install_webserver.sh -O script.sh && bash script.sh
```
Segueix les instruccions de l'script.

## Instal·lació del servidor d'aplicacions
Situa't al directori d'instal·lació i executa la següent comanda:

```
wget https://raw.githubusercontent.com/AniolFernandez/ApplicationVirtualization/main/install/install_appserver.sh -O script.sh && bash script.sh
```

Segueix les instruccions de l'script.


