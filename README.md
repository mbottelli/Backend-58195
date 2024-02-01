## Pasos para inicializar el proyecto

### Requerimientos

- Git
- Node.js

### Pasos

1.  Clonar el proyecto utilizando la consola de elección

        git clone https://github.com/mbottelli/Backend-58195.git

2.  Instalar dependencias

        npm install

3.  Ejecutar app.js con metodo preferido

        node src/app
        nodemon src/app

### Metodos

Una vez ejecutada la aplicación, la misma va a levantar un servidor web en el puerto 8080. Dentro del servidor se pueden manejar tanto productos como carritos mediante los siguientes metodos:

### Productos

- La ruta "/api/products" puede ser llamada mediante GET para obtener el listado completo de los productos en el archivo JSON

      localhost:8080/api/products

- A esta ruta se le puede agregar la query "limit" para especificar la cantidad de productos que debe devolver, en orden númerico

      localhost:8080/api/products?limit=5

- Por otro lado, se pueden agregar productos utilizando la ruta "/api/products" mediante POST con el sigiuente cuerpo:

      {
            "title": String
            "description": String
            "price": Numero
            "code": String
            "thumbnail": String (Opcional)
            "state": Booleano
      }

- También acepta un param como subruta para especificar el ID de un producto a devolver. En caso de no existir el ID solicitado arroja error.

      localhost:8080/api/products/3

- Con la misma ruta mediante PUT puede actualizarse el valor de uno de los campos del producto. De momento solo acepta un campo a la vez.

      {
            "title": "Producto Z"
      }

- Por ultimo, también se puede consultar la ruta mediante DELETE para borrar el producto indicado.

### Carritos

- La ruta raíz "/api/carts" se puede llamar mediante POST para crear un carrito.

      localhost:8080/api/carts

- También puede ser llamada mediante GET especificando con un param el ID del carrito deseado.

      localhost:8080/api/carts/1

- Finalmente se pueden agregar productos a un carrito mediante la ruta "/api/carts/:cid/products/:pid", donde el parametro :cid representa el ID del carrito y :pid representa el ID del producto. En caso de no existir el carrito devolverá error; en caso de no existir el producto lo crea. De momento solo agrega de a 1 producto, y solo se pueden agregar productos que hayan sido creados mediante los metodos de productos.

      localhost:8080/api/carts/3/products/8

\
_Perteneciente a la cursada **58195** de Backend en Coderhouse, este es un proyecto de aprendizaje_
