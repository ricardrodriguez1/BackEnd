# BackEnd
BackEnd by Ricard Rodríguez

Pagina basada en venta de videoconsolas y videojuegos. "figuras y componentes PC" (si no se complica mucho)

SOFTWARE a utilizar: NODE, GIT, DOCKER, DOCKER-COMPOSE, VISUAL STUDIO.

Nombre: BossFightStore.com



Para conectar docker con mongo lo primero que haremos sera crear un archivo docker-compose.yaml en el especificaremos todos los parametros necesarios. Seguidamente crearemos un fichero .env donde definiremos el nombre de usuario y contraseña que queramos. A su vez tendremos que crear un fichero .gitignore en el qual simplemente llamaremos al fichero anteriormente creado el .env. 

El siguiente paso sera utilizar la comanda "docker compose -d" para montar los archivos. Una vez tengamos los contenedores correctamente y todo en su sitio, iremos a mongodb compass, en el utilizaremos el metodo de conexion por "autentificacion". Especificaremos el nombre de usuario y contrasenya del fichero .env y arriba del todo pondremos el puerto que tengamos en el fichero docker-compose. Si todo funciona deberia conectarse correctamente.

    !Importante: Si el puerto no funciona puede ser que algo lo este usando asi que cambiamos el primer puerto del fichero docker-compose!



API funcionando: <img width="333" height="147" alt="image" src="https://github.com/user-attachments/assets/43501a7d-e5db-43b0-8aeb-21b72404d225" />























