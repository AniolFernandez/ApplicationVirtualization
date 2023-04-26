![Arquitectura](/docs/images/appcontainer.png)

# Imatge base per al virtualitzador d'aplicacions
Pots trobar aquesta imatge de forma pública en el següent repositori a Docker Hub: [imatge-base](https://hub.docker.com/layers/aniolfdz/appvirt/base/images/sha256-d0b92acddb3df6aa38dd371bd4325f07c01daf591494b0294599a1304f93b761?context=explore)

## Com instal·lar-hi una aplicació?
Crea un nou 'Dockerfile' basat en aquesta imatge (`FROM aniolfdz/appvirt:base`) i instal·la-hi l'aplicació i dependències necessàries.
Pots trobar exemples a [app-examples](./app-examples/)


## Com publicar una aplicació dins del meu servei?
Un cop disposis de la imatge final, publica-la al repositori configurat per al servei virtualitz ador.
En el següent exemple suposem un repositori local:

1. Genera la imatge amb l'aplicació

    `docker build . -t <nom-imatge>`

2. Assigna-hi un tag indicant el repositori local

    `docker tag <nom-imatge> localhost:5000/<nom-imatge>`

3. Puja-hi la imatge

    `docker push localhost:5000/<nom-imatge>`

Un cop afegida la imatge, pots accedir al servei amb l'usuari d'administrador i configurar les seves propietats.