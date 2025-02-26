# Proyecto de Guía Turística de Sevilla

## Autor
**Alberto Naranjo Moya**

## Descripción del Proyecto
Esta aplicación web es una **guía turística de Sevilla**, desarrollada en **Angular**. Permite a los usuarios explorar y conocer diferentes lugares de interés de la ciudad. La estructura del proyecto sigue una organización modular para facilitar la escalabilidad y el mantenimiento del código.

## Estructura del Proyecto
El código fuente se encuentra en la carpeta `src/app` y está dividido en varios módulos y componentes:
- **Módulos principales**
  - `add-edit-place/`: Componente para añadir y editar lugares.
  - `admin-places/`: Administración de los lugares registrados.
  - `confirmdialog/`: Diálogos de confirmación para acciones importantes.
  - `content/`: Componente para la visualizacion del contenido principal.
  - `footer/`: Pie de página de la aplicación.
  - `navbar/`: Barra de navegación.
  - `login/`: Módulo de autenticación de usuarios.
  - `reg-form/`: Formulario de registro de usuarios.
  - `service/`: Servicios para manejar la lógica y las conexiones con el backend.
  - `utils/`: Utilidades y funciones auxiliares.

- **Archivos principales**
  - `app-routing.ts`: Configuración de las rutas de la aplicación.
  - `app.config.ts`: Configuraciones generales.
  - `main.ts`: Punto de entrada de la aplicación.
  - `styles.css`: Hoja de estilos global.

- **Configuración y dependencias**
  - `angular.json`: Configuración de Angular.
  - `package.json`: Dependencias del proyecto.
  - `tsconfig.json`: Configuración de TypeScript.
  - `.gitignore`: Archivos ignorados en el control de versiones.
  
## Recursos Utilizados
- **Framework**: Angular
- **Lenguajes**: TypeScript, HTML, CSS
- **Librerías**: Bootstrap, Angular Material, RxJS
- **Control de versiones**: Git
- **Herramientas de desarrollo**: Visual Studio Code, Node.js, Angular CLI

## Modificaciones al Proyecto Original
- Se ha modificado todo el proyecto para adaptarlo a la guía turística de Sevilla.
- Se ha refactorizado el código para mejorar la mantenibilidad.
- Se ha agregado validación en los formularios.
- Se ha optimizado el sistema de rutas y lazy loading.
- Se ha implementado un sistema de autenticación con JWT.

## Instalación y Ejecución
Para ejecutar el proyecto localmente:
1. Clonar el repositorio:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Ejecutar el servidor de desarrollo:
   ```bash
   ng serve
   ```
4. Abrir en el navegador: `http://localhost:4200`

## Contacto
Si tienes preguntas o sugerencias, no dudes en contactarme.

