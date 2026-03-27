const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-commerce API",
      version: "1.0.0",
      description: "Documentació de l'API del projecte e-commerce"
    },
    servers: [
      {
        url: "http://localhost:3000"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", description: "ID de l'usuari" },
            nombre: { type: "string", description: "Nom de l'usuari" },
            apellidos: { type: "string", description: "Cognoms de l'usuari" },
            email: { type: "string", format: "email", description: "Correu electrònic" },
            teléfono: { type: "string", description: "Telèfon (9 dígits)" },
            rol: { type: "string", enum: ["cliente", "administrador"], description: "Rol de l'usuari" },
            dirección: { type: "string", description: "Adreça de l'usuari" }
          }
        },
        Product: {
          type: "object",
          properties: {
            id: { type: "string", description: "ID del producte" },
            nombre: { type: "string", description: "Nom del producte" },
            descripcion: { type: "string", description: "Descripció del producte" },
            precio: { type: "number", description: "Preu del producte" },
            stock: { type: "number", description: "Estoc disponible" },
            imagen_url: { type: "string", description: "URL de la imatge" },
            categoria: { type: "string", description: "Categoria del producte" }
          }
        },
        Pedido: {
          type: "object",
          properties: {
            id: { type: "string", description: "ID del pedido" },
            usuario: { type: "string", description: "ID o identificador de l'usuari" },
            direccion: { type: "string", description: "Adreça d'enviament" },
            ciudad: { type: "string", description: "Ciutat" },
            codigo_postal: { type: "string", description: "Codi postal" },
            telefono: { type: "string", description: "Telèfon de contacte" },
            metodo_pago: { type: "string", enum: ["tarjeta", "paypal", "transferencia", "contrareembolso", "otros"] },
            estado: { type: "string", enum: ["pendiente", "pagado", "enviado", "entregado", "cancelado"] },
            productos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  nombre_producto: { type: "string" },
                  cantidad: { type: "number" },
                  precio_unitario: { type: "number" },
                  subtotal: { type: "number" }
                }
              }
            },
            total: { type: "number", description: "Total del pedido" }
          }
        },
        Categoria: {
          type: "object",
          properties: {
            id: { type: "string", description: "ID de la categoria" },
            nombre: { type: "string", description: "Nom de la categoria" },
            descripcion: { type: "string", description: "Descripció" },
            slug: { type: "string", description: "Slug URL-friendly" },
            parent: { type: "string", description: "ID de la categoria pare (opcional)" },
            activo: { type: "boolean", description: "Si la categoria està activa" }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ["./src/routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
