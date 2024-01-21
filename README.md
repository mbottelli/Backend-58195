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

\
Se llama a la aplicación desde el root del proyecto ya que el archivo con los productos se encuentra ahí. Si quisiera llamarla desde /src, debería primero mover el archivo dentro de esa carpeta

### Metodos

Una vez ejecutada la aplicación, la misma va a levantar un servidor web en el puerto 8080. Dentro del repositorio se incluye el archivo "test.json" con 10 productos de prueba ya cargados, para interactuar con estos se pueden usar los siguientes metodos:

- La ruta "/products" puede ser llamada para obtener el listado completo de los productos en el archivo JSON

      localhost:8080/products

- A esta ruta se le puede agregar la query "limit" para especificar la cantidad de productos que debe devolver, en orden númerico

      localhost:8080/products?limit=5

- También acepta un param como subruta para especificar el ID de un producto a devolver. En caso de no existir el ID solicitado arroja error.

      localhost:8080/products/3

\
_Perteneciente a la cursada **58195** de Backend en Coderhouse, este es un proyecto de aprendizaje_
