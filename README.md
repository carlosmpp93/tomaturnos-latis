# Tomaturnos Latis

Este proyecto es un sistema de gestión de turnos diseñado para optimizar la atención al cliente en sucursales. Permite a los usuarios solicitar un turno para un servicio específico y a los agentes administrar la cola de espera y atender a los clientes en las ventanillas.

## Propósito del Proyecto

El objetivo principal de Tomaturnos Latis es mejorar la experiencia del cliente y la eficiencia operativa en entornos con alta afluencia de público. El sistema busca reducir los tiempos de espera, organizar el flujo de clientes y proporcionar a los administradores herramientas para monitorear y gestionar el proceso de atención.

## Funcionalidades Principales

### Para Clientes:

*   **Solicitud de Turno:** Los clientes pueden solicitar un turno para un servicio específico en una sucursal determinada.
*   **Seguimiento de Turno:** Pueden ver el estado de su turno en tiempo real (en espera, atendiendo, etc.).

### Para Agentes de Ventanilla:

*   **Gestión de Cola:** Los agentes pueden ver la lista de clientes en espera para los servicios que atienden.
*   **Llamada de Cliente:** Pueden llamar al siguiente cliente de la cola para ser atendido.
*   **Registro de Atención:** Pueden marcar un turno como finalizado o cancelado.

### Para Administradores:

*   **Gestión de Catálogos:** Los administradores pueden dar de alta, editar y eliminar sucursales, ventanillas y servicios.
*   **Gestión de Usuarios:** Pueden crear, editar y eliminar usuarios del sistema (administradores, agentes).
*   **Asignación de Roles y Permisos:** Pueden asignar roles (administrador, agente) a los usuarios para controlar el acceso a las funcionalidades del sistema.
*   **Monitoreo de Actividad:** Pueden ver estadísticas y reportes sobre la operación del sistema.

## Estructura del Proyecto

El proyecto está dividido en dos componentes principales:

*   **Backend:** Una API REST desarrollada en PHP con el framework Laravel. Se encarga de toda la lógica de negocio, la gestión de la base de datos y la seguridad.
*   **Frontend:** Una Single-Page Application (SPA) desarrollada con React. Proporciona la interfaz de usuario para que los clientes, agentes y administradores interactúen con el sistema.

## Tecnologías

### Backend

*   PHP 8.2
*   Laravel 12
*   MySQL (o cualquier otra base de datos relacional compatible con Laravel)

### Frontend

*   React 19
*   Vite
*   Tailwind CSS
*   React Router

## Instalación y Puesta en Marcha

### Prerrequisitos

*   Node.js y npm (o yarn)
*   PHP y Composer
*   Un servidor web (e.g., Apache o Nginx)
*   Un gestor de base de datos (e.g., MySQL, PostgreSQL)

### Backend

1.  Clona el repositorio: `git clone https://github.com/your-user/tomaturnos-latis.git`
2.  Navega al directorio del backend: `cd tomaturnos-latis/tomaturnos-backend/Sistema-Latis-Procesos-Backend`
3.  Instala las dependencias: `composer install`
4.  Copia el archivo de ejemplo de las variables de entorno: `cp .env.example .env`
5.  Configura las variables de entorno en el archivo `.env`. Como mínimo, debes configurar la conexión a la base de datos (`DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).
6.  Genera la clave de la aplicación: `php artisan key:generate`
7.  Ejecuta las migraciones de la base de datos: `php artisan migrate`
8.  Opcionalmente, puedes ejecutar los seeders para poblar la base de datos con datos de ejemplo: `php artisan db:seed`
9.  Inicia el servidor: `php artisan serve`

### Frontend

1.  Navega al directorio del frontend: `cd tomaturnos-latis/tomaturnos-frontend/latis-procesos-2025`
2.  Instala las dependencias: `npm install`
3.  Inicia el servidor de desarrollo: `npm run dev`

## Contribución

Si deseas contribuir al proyecto, por favor sigue estos pasos:

1.  Haz un fork del repositorio.
2.  Crea una nueva rama para tus cambios.
3.  Realiza tus cambios y haz commit de ellos.
4.  Empuja tus cambios a tu fork.
5.  Crea un pull request a la rama principal del repositorio original.
