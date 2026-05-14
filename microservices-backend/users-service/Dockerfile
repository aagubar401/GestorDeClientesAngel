##versión de node https://hub.docker.com/_/node/
FROM node:24-alpine

##Creamos la carpeta para los módulos de node 
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN chmod -R 777 /home/node

##Establecemos el directorio de trabajo
WORKDIR /home/node/app

##Copiamos el package json
##Daba problemas al ejecutar npm install por permisos en package-lock.json, añadiendo --chown=node:node al copiar, se ha solucionado
COPY --chown=node:node package*.json ./

##Cambiamos el usuario activo de root a node. No se debe trabajar con el usuario root en un contenedor
USER node

##Instalamos los módulos
RUN npm install && npm install nodemon

##Copiamos los archivos de la aplicación
COPY --chown=node:node . .

EXPOSE 3400

CMD ["npm", "run", "dev"]

##Ejecutamos el script de reseed de la base de datos
##RUN [ "npm", "run", "db_test:create" ]
##RUN [ "npm", "run", "db_test:migrate" ]
##RUN [ "npm", "run", "db_test:seeds" ]
