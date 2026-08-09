# Guía de Configuración Local: Somos Crédito

## Requisitos Previos

- Node.js (versión 18 o superior recomendada)

- Docker o Instancia de MySQL

### 1. Configuración y Ejecución del Backend

Abre una terminal y navega al directorio del backend:

```
cd apps/backend
npm install
```

Configurar la Base de Datos:

Crea una base de datos vacía en tu servidor SQL local (por ejemplo, somos_credito).

Crea un archivo .env en el directorio apps/backend y agrega tus credenciales:

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_local
DB_NAME=somos_credito
Poblar la Base de Datos e Iniciar el Servidor:
Ejecuta el seeder para crear las tablas de la base de datos y cargar los datos iniciales del CSV, luego inicia el servidor.
```

```
npx tsx src/seeders/seedFromCsv.ts
npm run dev
```

La API del backend ahora se está ejecutando en: http://localhost:3000/api/v1

## 2. Configuración y Ejecución del Frontend

Abre una nueva ventana de terminal (deja el backend ejecutándose en la anterior) y navega al directorio del frontend:

```
cd apps/frontend
npm install
```

Iniciar la Aplicación React:

```
npm run dev
```

La aplicación frontend se abrirá automáticamente en tu navegador (generalmente en http://localhost:5173 o 3000).

3. Ejecutar las Pruebas (Opcional)
Para verificar que la lógica del backend y las transacciones de la base de datos funcionan correctamente:

```
cd apps/backend
npm run test
```


MEJORAS
- usar librerias decimal.js
- mas DTOs para funciones