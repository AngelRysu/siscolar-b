# Backend Institucional - API Base

Este repositorio contiene la **base técnica oficial y estandarizada** para el desarrollo de los servicios backend de la institución. Está construido sobre **Node.js** y **TypeScript**, utilizando **Express** como framework web y **Prisma** como ORM.

El objetivo de este proyecto base es garantizar la consistencia, seguridad y mantenibilidad de los módulos funcionales, comenzando con el servicio de **Archivo**.

---

## 🛠 Tech Stack

* **Runtime:** Node.js (LTS v20+)
* **Lenguaje:** TypeScript
* **Framework:** Express.js
* **ORM:** Prisma (PostgreSQL)
* **Documentación:** OpenAPI 3.0 (Swagger UI)
* **Seguridad:** HTTPS nativo (Prod), CORS, manejo de errores centralizado.

---

## 🚀 Requisitos Previos

Asegúrate de tener instalado:
* [Node.js](https://nodejs.org/) (v20 o superior recomendado)
* [PostgreSQL](https://www.postgresql.org/) (Base de datos local o acceso a servidor dev)
* VS Code (Recomendado con extensión "REST Client")

---

## ⚙️ Instalación y Configuración

1.  **Clonar el repositorio**
    ```bash
    git clone [URL]
    cd siscolar-b
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Inicializar Base de Datos (Prisma)**
    Genera el cliente de Prisma para conectar con tu esquema:
    ```bash
    npx prisma generate
    ```

4.  **Ejecutar en Desarrollo**
    Levanta el servidor con recarga automática (Nodemon):
    ```bash
    npm run dev
    ```

---

## 📜 Scripts Disponibles

| Comando           | Descripción                                           |
| :---------------- | :---------------------------------------------------- |
| `npm run dev`     | Inicia el servidor en modo desarrollo (watch mode).   |
| `npm run build`   | Compila el código TypeScript a JavaScript en `/dist`. |
| `npm start`       | Inicia el servidor compilado (Producción).            |
| `npm run lint`    | Ejecuta ESLint para verificar calidad de código.      |
| `npm run lint:fix`| Intenta corregir automáticamente errores de linter.   |

---

## 📚 Documentación de la API

El proyecto sigue la estrategia **API First**. El contrato de la API está definido en OpenAPI 3.0.

* **Swagger UI (Visual):** [http://localhost:(puerto)/docs](http://localhost:(puerto)/docs)
* **Especificación JSON:** [http://localhost:(puerto)/docs/json](http://localhost:(puerto)/docs/json)
* **Archivo Fuente:** `/docs/openapi.yaml`

### Versionamiento
La API base se encuentra prefijada bajo:
`GET /api/v1/`

---

## 🧪 Pruebas (REST Client)

Se incluyen archivos `.http` para pruebas rápidas directamente en VS Code (requiere extensión "REST Client").

* Ubicación: `/http/general.http`

---

## 🔒 Configuración de Producción (HTTPS)

Para entornos productivos, el servidor soporta HTTPS nativo mediante variables de entorno.

1.  Establecer `NODE_ENV=production` en el `.env`.
2.  Proporcionar rutas absolutas a los certificados SSL:
    ```env
    SSL_KEY_PATH="/ruta/segura/privkey.pem"
    SSL_CERT_PATH="/ruta/segura/fullchain.pem"
    ```
3.  El servidor validará la existencia de estos archivos antes de iniciar.

---

## 📂 Estructura del Proyecto

```text
/
├── dist/               # Código compilado (generado)
├── docs/               # Documentación OpenAPI (Swagger)
├── http/               # Pruebas manuales (.http)
├── prisma/             # Esquemas de BD y migraciones
├── src/
│   ├── middlewares/    # Manejo de errores y validaciones
│   ├── index.ts        # Punto de entrada
│   └── ...
├── .gitignore          # Archivos ignorados por Git
└── package.json        # Dependencias y scripts