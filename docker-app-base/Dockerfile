#Imatge inicial ubuntu
FROM ubuntu

#Entorn no interactiu per instal·lació
ENV DEBIAN_FRONTEND=noninteractive

#Copiem els fitixers de configuració i codi a compilar
COPY config/start.sh /
COPY config/i3-config /home/USER/.config/i3/config
COPY config/gateway /gateway

#Ens posem en l'directori on compilar i executar el gateway
WORKDIR /gateway

#Instal·lació de dependències, compilació i desinstal·lació un cop ja no són necessàries
RUN apt-get update \
    && apt-get install xvfb i3 golang-go ffmpeg gcc libc6-dev libx11-dev xorg-dev libxtst-dev xcb libxcb-xkb-dev x11-xkb-utils libx11-xcb-dev libxkbcommon-x11-dev libxkbcommon-dev ca-certificates -y \
    && go build && rm -r *.* \
    && apt-get purge -y --auto-remove golang-go \
    && useradd -M -u 1000 USER \
    && mkdir /SHARED \
    && chmod +x /start.sh \
    && chown USER:USER /start.sh \
    && chown -R USER:USER /SHARED \
    && chown -R USER:USER /home/USER/ \
    && chown -R USER:USER /gateway 

#Execució com a usuari sense permisos
WORKDIR /SHARED
USER USER

#Script d'arranc amb els elements necessaris per a formar l'entorn
CMD ["/start.sh"]