# BackEnd
BackEnd by Ricard Rodríguez

Pagina basada en venta de videoconsolas y videojuegos. "figuras y componentes PC" (si no se complica mucho)

SOFTWARE a utilizar: NODE, GIT, DOCKER, DOCKER-COMPOSE, VISUAL STUDIO.

Nombre: BossFightStore.com



Para conectar docker con mongo lo primero que haremos sera crear un archivo docker-compose.yaml en el especificaremos todos los parametros necesarios. Seguidamente crearemos un fichero .env donde definiremos el nombre de usuario y contraseña que queramos. A su vez tendremos que crear un fichero .gitignore en el qual simplemente llamaremos al fichero anteriormente creado el .env. 

El siguiente paso sera utilizar la comanda "docker compose -d" para montar los archivos. Una vez tengamos los contenedores correctamente y todo en su sitio, iremos a mongodb compass, en el utilizaremos el metodo de conexion por "autentificacion". Especificaremos el nombre de usuario y contrasenya del fichero .env y arriba del todo pondremos el puerto que tengamos en el fichero docker-compose. Si todo funciona deberia conectarse correctamente.

    !Importante: Si el puerto no funciona puede ser que algo lo este usando asi que cambiamos el primer puerto del fichero docker-compose!




1. Identificación de entidades principales

- Usuario

    - Puede ser cliente (compra) o administrador (gestiona).

- Producto

    - Incluye videoconsolas, componentes de PC, videojuegos, figuras (categorías).

- Categoría

    - Sirve para organizar los productos.

- Pedido (Pedido)

    - Conjunto de productos que compra un usuario.

- Línea de Pedido

    - Cada producto dentro de un pedido con cantidad y precio.

- Carrito de la compra

    - Productos añadidos por el cliente antes de confirmar la compra.

- Factura / Pago

    - Registra la transacción del pedido.

- Envío

    - Detalles de la entrega del pedido.




2. Identificar atributos básicos por cada entidad
   
🔹 Usuario

    id_usuario
    
    nombre
    
    apellidos
    
    email
    
    contraseña
    
    dirección
    
    teléfono
    
    rol (cliente / administrador)

🔹 Producto

    id_producto
    
    nombre
    
    descripción
    
    precio
    
    stock

    imagen_url
    
    id_categoría

🔹 Categoría

    id_categoría
    
    nombre (videoconsolas, componentes de PC, videojuegos, figuras)

🔹 Pedido

    id_pedido
    
    fecha
    
    id_usuario
    
    estado (pendiente, pagada, enviada, cancelada)
    
    total

🔹 Línea de Pedido

    id_linia
    
    id_pedido
    
    id_producto
    
    cantidad
    
    precio_unitario
    
    🔹 Carrito
    
    id_carret
    
    id_usuario
    
    fecha_creación

🔹 Línea de Carrito

    id_linia_carret
    
    id_carret
    
    id_producto
    
    cantidad

🔹 Factura / Pago

    id_factura
    
    id_pedido
    
    fecha
    
    método_pago (tarjeta, PayPal, etc.)
    
    import_total

🔹 Envío

    id_envío
    
    id_pedido
    
    dirección_envío
    
    empresa_transport
    
    código_seguimiento
    
    estado (en tráfico, entregado, etc.)



3. Identificar relaciones

Usuario – Pedido:
1 usuario puede realizar muchos pedidos.
(1:N)

Pedido – Línea de Pedido – Producto:
Un pedido puede contener muchos productos, y un producto puede aparecer en muchos pedidos → relación N:M resuelta con Línea de Pedido.

Usuario – Carrito:
Un usuario tiene 1 carrito activo.
(1:1)

Carrito - Línea de Carrito - Producto:
Al igual que el pedido: un carrito puede tener muchos productos y un producto puede estar en muchos carritos → N:M.

Categoría – Producto:
Una categoría tiene muchos productos, pero cada producto pertenece sólo a una categoría.
(1:N)

Pedido – Factura:
Cada pedido genera exactamente una factura.
(1:1)

Pedido – Envío:
Cada pedido puede tener un registro de envío.
(1:1 o 1:N si se permiten múltiples envíos).






















