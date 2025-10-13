# BackEnd
BackEnd by Ricard Rodríguez

Pagina basada en venta de videoconsolas y videojuegos. "figuras y componentes PC" (si no se complica mucho)

SOFTWARE a utilizar: NODE, GIT, DOCKER, DOCKER-COMPOSE, VISUAL STUDIO.

Nombre: BossFightStore.com



Para conectar docker con mongo lo primero que haremos sera crear un archivo docker-compose.yaml en el especificaremos todos los parametros necesarios. Seguidamente crearemos un fichero .env donde definiremos el nombre de usuario y contraseña que queramos. A su vez tendremos que crear un fichero .gitignore en el qual simplemente llamaremos al fichero anteriormente creado el .env. 

El siguiente paso sera utilizar la comanda "docker compose -d" para montar los archivos. Una vez tengamos los contenedores correctamente y todo en su sitio, iremos a mongodb compass, en el utilizaremos el metodo de conexion por "autentificacion". Especificaremos el nombre de usuario y contrasenya del fichero .env y arriba del todo pondremos el puerto que tengamos en el fichero docker-compose. Si todo funciona deberia conectarse correctamente.

    !Importante: Si el puerto no funciona puede ser que algo lo este usando asi que cambiamos el primer puerto del fichero docker-compose!



Pasos para la actividad de API

1. Qué se ha hecho:

Se ha creado una carpeta principal llamada api/, que contiene todo el backend del proyecto.
Dentro se ha inicializado un proyecto Node.js con el pedido:

    - npm init -y


Esto genera automáticamente un archivo package.json con la configuración básica del proyecto.

2. Instalación de dependéncias

- Express: Framework minimalista para crear servidores web y gestionar rutas HTTP.

- Mongoose: Librería que facilita la conexión y manipulación de datos en MongoDB.

- dotenv: Permite cargar variables de entorno desde un archivo .env (como el puerto o el URI de la base de datos).

- nodemon: Reinicia automáticamente el servidor cada vez que hay cambios en el código durante el desarrollo.


4. Configuración del servidor con: index.html

        require('dotenv').config();
        const express = require('express');
        const connectDB = require('./config/db');
        
        const app = express();
        
        // Middleware per llegir JSON
        app.use(express.json());
        
        // Connexió amb la base de dades
        connectDB();
        
        // Ruta base
        app.get('/', (req, res) => res.send('API Ecommerce en marxa 🚀'));
        
        // Escoltar al port definit a .env o al 3000
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Servidor escoltant al port ${PORT}`));

   
6. Conexión con mongodb: db.js

        const mongoose = require('mongoose');
        
        const connectDB = async () => {
          try {
            const conn = await mongoose.connect(process.env.MONGO_URI);
            console.log(`Connexió MongoDB establerta: ${conn.connection.host}`);
          } catch (error) {
            console.error('Error de connexió a MongoDB:', error.message);
            process.exit(1);
          }
        };
        
        module.exports = connectDB;
   
7. Fichero .env que contiene las variables de entorno
   
        (PORT=3000
        MONGO_URI=mongodb://localhost:27017/ecommerce)
8. Fichero .gitignore

9. Fichero de scripts package.json

10. Ejecución del proyecto con: npm run dev -> deberia salir el mensaje "Conexión establecida" para la API






API funcionando: <img width="333" height="147" alt="image" src="https://github.com/user-attachments/assets/43501a7d-e5db-43b0-8aeb-21b72404d225" />























