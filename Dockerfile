FROM node:22.7.0

WORKDIR /usr/src/app


COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez le reste des fichiers de l'application
COPY . .

# Exposez le port sur lequel l'application écoutera
EXPOSE 3000

# Démarrez l'application
CMD ["node", "index.js"]