# reto-backend-2025-authentication-ms

Microservicio para autenticación, reto backend 2025

## Requisitos

Antes de ejecutar el microservicio, asegúrate de tener instalados los siguientes requisitos:

- Node JS (versión 18 o superior)
- PNPM (versión 9 o superior)

## Configuración del entorno

Haz una copia del archivo `.env.template` y renómbralo a `.env`. Luego, configura las variables de entorno necesarias para tu entorno de desarrollo. Puedes usar el siguiente comando para crear el archivo de configuración:

```bash
cp .env.template .env
```

> Si te falta alguna variable de entorno, entonces el proyecto no funcionará correctamente. Asegúrate de que todas las variables necesarias estén configuradas en el archivo `.env`.

## Instalación

Instala las dependencias del proyecto utilizando PNPM. Asegúrate de estar en la raíz del proyecto y ejecuta el siguiente comando:

```bash
pnpm install
```

## Ejecución del microservicio

Para ejecutar el microservicio en modo desarrollo, utiliza el siguiente comando:

```bash
pnpm start:dev
```

> El microservicio se ejecutará en el puerto 3002 por defecto. Puedes cambiar el puerto configurando la variable de entorno `PORT` en el archivo `.env`.

## Documentación de la API
