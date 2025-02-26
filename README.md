# Guía de Turismo (Cádiz de ejemplo).

Cuenta con una página de inicio que muestra todas las ubicaciones utilizando el componente 'cards' de Angular Material. Cada tarjeta presenta el nombre del lugar como título, una imagen principal, una breve descripción, las calificaciones promedio de la ubicación y un botón "Leer más" que lleva a la página detallada del sitio.

En la página del sitio específico, el nombre se muestra como título, junto con 9 fotos que muestran una imagen principal central y el resto a los lados. Al hacer clic en una de las imágenes centrales, se reemplaza por la imagen central. A continuación, se proporciona información sobre el sitio, junto con una sección para la calificación.

El proyecto incluye un sistema de inicio de sesión y registro que utiliza:
    - librería crypto-js para almacenar la password del usuario encriptada.
    - librería JWT, para generar un token JWT, que se almacena en cookies. Para usuarios autenticados, con este token autorizamos a un usuario sin registrar y a un usuario     registrado acceder a las rutas permitidas en cada caso y restringir las propias del administrador.

El archivo dbCadiz.json actúa como una base de datos simulada, se almacenan los lugares y los usuarios.

Además, hay un generador de PDF que crea un PDF que contiene toda la información e imágenes de cada sitio.

## Instalar dependencias

Ejecuta `npm install o npm install --force` en caso de errores.

## Seguimos con dependencias

-desde la carpeta del proyecto-

* json server:

$ npm i -g json-server

-y ya luego para ejecutar este servidor-:

$ json-server --watch dbCadiz.json

(esto servirá en http://localhost:3000)

* Angular Material:

$ nd add @angular/material

-diferencias entre $ npm i @angular/material -y- $ ng add @angular/material-

	npm i @angular/material sólo instala el paquete @angular/material

	De la otra manera, ng add @angular/material:

		instala paquete @angular/material
		instala paquetes @angular/cdk y @angular/animations
		prepara un tema para la aplicación
		prepara una tipografía global de Angular Material (opcional)
		prepara animations para Angular Material (opcional)


	entonces por la otra opción:

	$ npm i @angular/material @angular/cdk --save    

	(con la opción –-save lo que hacemos es añadir las dependencias a nuestro package.json)
	
* Librería crypto-js (cifrado para p.ej. contraseñas):

$ npm i crypto-js --save

-antes se intentó con la librería bcryptjs, pero se vio incompatible con versiones nuevas de Angular-

* Librería jwt -para los tokens-:

$ npm i jwt-decode --save

* Librería pdfmake-wrapper (para generar PDF's de los listados):

$ npm i pdfmake-wrapper --save


## Usuarios iniciales:

Administrador: admin@admin.com - password: admin1234
Usuario: user@user.com - password: user1234


## passwords con crypto-js

* Generar contraseñas encriptadas con crypto-js para dbCadiz.json

Ejecuta este código en la consola de Node.js para encriptar contraseñas:

node

Luego, dentro de Node.js, ejecuta:

const CryptoJS = require("crypto-js");

const password = "admin123"; // Cambia esta contraseña por la que necesites
const hashedPassword = CryptoJS.SHA256(password).toString();
console.log("Contraseña encriptada:", hashedPassword);

Esto generará una contraseña encriptada que puedes copiar y pegar en dbCadiz.json.
Guardar usuarios con contraseñas encriptadas en dbCadiz.json

Ejemplo de dbCadiz.json con usuarios encriptados:

{
  "users": [
    {
      "id": 1,
      "firstName": "Administrador",
      "email": "admin@cadiz.com",
      "password": "d033e22ae348aeb5660fc2140aec35850c4da997", 
      "role": "admin"
    },
    {
      "id": 2,
      "firstName": "Usuario",
      "email": "usuario@cadiz.com",
      "password": "a49b2446a02c645bf419f995b67091253a04a259", 
      "role": "user"
    }
  ]
}

Reemplaza los valores de password con contraseñas generadas con crypto-js.


-----------------------------------


const CryptoJS = require("crypto-js");
const password = "user1234"; 
const hashedPassword = CryptoJS.SHA256(password).toString();
console.log("Contraseña encriptada:", hashedPassword);

------------------------------------


## Servidor de desarrollo

Ejecuta `ng serve` (`ng serve -o` para abrir automáticamente la página en el navegador) para un servidor de desarrollo. Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si cambias alguno de los archivos fuente.

## Respaldado

En este proyecto, se ha usado un archivo JSON como base de datos. Por lo tanto, para usar el sitio web correctamente, se debe ejecutar '`json-server --watch dbCadiz.json`', que
correrá en `http://localhost:3000/`.

## Construir

Ejecuta `ng build` para construir el proyecto. Los artefactos de construcción se almacenarán en el directorio `dist/`.

### Más ayuda

Para obtener más ayuda sobre Angular CLI, usa `ng help` o consulta la página [Resumen de Angular CLI y referencia de comandos](https://angular.io/cli).


