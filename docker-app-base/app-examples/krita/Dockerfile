#Bastat en la imatge base creada pel projecte
FROM aniolfdz/appvirt:base

#Root per instal·lar dependències
USER root
ADD run.sh /run.sh

#Instal·lem l'aplicació a executar
RUN apt-get install krita -y \
    && chmod +x /run.sh \
    && chown USER:USER /run.sh

USER USER
