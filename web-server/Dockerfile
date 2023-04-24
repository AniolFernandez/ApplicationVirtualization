#Imatge original de node
FROM node:18

#Establim el directori de l'aplicació
WORKDIR /app

# Copia les dades de l'aplicació
COPY ./server .

# Instal·lar les dependències
RUN npm install

# Port de l'aplicació
EXPOSE 3000

# Inicia l'aplicació
CMD ["npm", "start"]