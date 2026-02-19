# Prueba Técnica - Registro de Entrenamientos

Este repositorio contiene el código desarrollado para la prueba técnica de My Virtual Trainer, correspondiente a la aplicación para la posición de pasante de programación. 

El proyecto es una aplicación web de una sola página (SPA) que permite a los usuarios gestionar sus sesiones de entrenamiento. Las funcionalidades incluyen el registro, visualización, edición y eliminación de datos, los cuales se sincronizan en tiempo real.

## Tecnologías Utilizadas

* Framework: Vue 3 (implementando la sintaxis moderna de Composition API y script setup).
* Lenguaje: TypeScript para la definición de interfaces y seguridad de tipos.
* Base de Datos: Firebase Firestore (implementación de operaciones CRUD y onSnapshot para actualizaciones en tiempo real).
* Diseño: CSS estándar con un enfoque de diseño limpio, minimalista y responsivo.
* Alojamiento: Firebase Hosting.

## Requisitos Previos

Para ejecutar este proyecto de manera local, es necesario contar con:
* Node.js instalado en su entorno de desarrollo.
* Una cuenta de Firebase con un proyecto y base de datos Firestore inicializada.

## Instrucciones de Instalación y Configuración

1. Clonar el repositorio en su máquina local:
   ```bash
   git clone https://github.com/alejo000111/mvt-prueba
   cd mvt-prueba
   ```

2. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Configuración de Variables de Entorno:
Crear un archivo llamado .env en la raiz del proyecto y configure las siguientes variables con sus credenciales de Firebase:
   ```bash
   VITE_FIREBASE_API_KEY=su_api_key
   VITE_FIREBASE_AUTH_DOMAIN=su_auth_domain
   VITE_FIREBASE_PROJECT_ID=su_project_id
   VITE_FIREBASE_STORAGE_BUCKET=su_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=su_sender_id
   VITE_FIREBASE_APP_ID=su_app_id
   VITE_FIREBASE_MEASUREMENT_ID=su_measurement_id
   ```

4. Configurar la conexión a Firebase:
Crear un archivo llamado "firebase.ts" dentro de la carpeta "src". En este archivo, es necesario inicializar la aplicación de firebase con sus propias credenciales de proyecto y exportar el servicio de Firestore (variable db).

5. Ejecutar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Instrucciones de Construcción y Despliegue

Este proyecto está configurado para ser desplegado en Firebase Hosting.

1. Para compilar la aplicación y prepararla para producción, ejecute:
   ```bash
   npm run build
   ```
   Este comando generará una carpeta llamada "dist" que contiene los archivos optimizados.

2. Para desplegar la aplicación, utilice las herramientas de línea de comandos de Firebase:
   ```bash
   firebase login
   firebase init hosting
   ```
   Asegurar que durante la configuración esté seleccionada la carpeta "dist" como su directorio público

3. Finalmente suba los archivos a producción
   ```bash
   firebase deploy
   ```
