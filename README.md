# Prácticas 2026

# Pasos para crear la estructura del proyecto

1. Crear el proyecto frontend con Vite y React:

   ```bash
   npm create vite@latest
   # Seleccionar React y nombrar el proyecto como "frontend"
   ```

2. Entrar en la carpeta del frontend:

   ```bash
   cd frontend
   ```

3. Instalar las dependencias del frontend:

   ```bash
   npm install
   ```

4. Editar el archivo `package.json` del frontend para que el script de desarrollo use el puerto 5178:

   ```json
   "dev": "vite --port 5178",
   ```

5. Ejecutar el servidor de desarrollo del frontend:

   ```bash
   npm run dev
   ```

6. Instalar Tailwind CSS y el plugin de Vite para Tailwind:

   ```bash
   npm install tailwindcss @tailwindcss/vite
   ```

7. Configurar Tailwind CSS en el archivo `vite.config.js`:
   - Importa y añade el plugin de Tailwind en la configuración de Vite.

   ```js
   import tailwindcss from "tailwindcss";
   ...

   export default defineConfig({
     plugins: [tailwindcss(), ...],
   });
   ```

8. Crear la carpeta para el backend:

   ```bash
   mkdir microservices-backend
   cd microservices-backend
   ```

9. Añadir el archivo `docker-compose.pg.yml` con la configuración para levantar un contenedor de Postgres y pgAdmin.

10. Añadir un archivo `package.json` para poder ejecutar el script que levanta estos servicios:

    ```json
    {
      "name": "microservices-backend",
      "version": "1.0.0",
      "scripts": {
        "db:up": "docker compose -f docker-compose.pg.yml up -d",
        "db:down": "docker compose -f docker-compose.pg.yml down"
      }
    }
    ```

11. Crear el microservicio de usuarios:

    ```bash
    mkdir users-service
    cd users-service
    npm init
    ```

    [!WARNING]
    En el comando init, cuando nos solicite el type indicar "module"

12. Añadir el archivo `.gitignore` en `microservices-backend/users-service` con el siguiente contenido:

    ```gitignore
    # Logs
    logs
    *.log
    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*
    pnpm-debug.log*
    lerna-debug.log*

    .github
    node_modules
    dist
    dist-ssr
    *.local
    .env
    .env.*

    # Editor directories and files
    .vscode/*
    !.vscode/extensions.json
    .idea
    .DS_Store
    *.suo
    *.ntvs*
    *.njsproj
    *.sln
    *.sw?
    ```

13. Instalar Express

    ```bash
    npm install express
    ```

14. Crear fichero index.js con express básico y un endpoint de prueba

    ```js
    import express from "express";
    const PORT = process.env.PORT || 3400;

    const app = express();

    app.get("/prueba", (req, res) => {
      res.send("Hola desde el servicio de usuarios");
    });

    app.listen(PORT, () => {
      console.log(`Servidor de usuarios escuchando en el puerto ${PORT}`);
    });
    ```

15. Instalar dotenv pg, pg-hstore, sequelize y umzug y sequelize-cli

    ```bash
    npm install dotenv pg pg-hstore sequelize umzug
    npm install --save-dev sequelize-cli
    ```

16. Estructura básica de carpetas dentro de app

    ```
    app/
    ├── config/
    ├── controllers/
    ├── database/
    ├── middlewares/
    ├── models/
    └── routes/
    ```

17. Dentro de database deben existir dos ficheros config.js y createDB.js, que nos van a permitir crear la base de datos del servicio.

18. Crear fichero .env del microservicio con este contenido mínimo

    ```
    AUTH_SECRET="mi_secr3t-0"
    DATABASE_USERNAME="practicas"
    DATABASE_PASSWORD="_Practicas"
    DATABASE_HOST="practicas_postgres_db"
    ```

19. Se crea el fichero docker-compose.users-yml y Dockerfile

20. Crear contenedor y ejecutar con instrucciones del package.json

    ```bash
    npm run build
    ```

21. Crear base de datos. Para crear la base de datos vamos a añadir una importación de createDB.js en el index.js (luego la quitaremos).

    ```js
    import db from "./app/database/createDB.js";
    ```

22. Añadir componente users al front para hacer un fetch al backend. Estructura del front recomendada.

    ```
    src/
    ├── assets/
    ├── components/
      ├── users/
      ├── customers/
    ├── customHooks/
    └── helpers/
    ```

23. Arreglar error de cors en el backend.

    ```bash
    npm install cors
    ```

    ```js
    // En index.js añadir
    import cors from "cors";

    app.use(cors({ origin: ["http://localhost:5178"] }));
    ```

24. Formato JSON para intercambio entre frontend y backend.

    ```js
    // En index.js añadir el middleware
    app.use(express.json());

    // Cambiar el endpoint de test para enviar respuesta en formato JSON
    // Definir contrato de respuesta entre el front y el backend.
    app.get("/prueba", (req, res) => {
      res.status(200).json({ welcomeMessage: "¡Hola desde el servicio de usuarios!" });
    });
    ```

25. Próximos pasos
    - Centralizar rutas.
    - Middleware manejo de errores. Control de unhandledRejection y uncaughtException.
    - Crear tablas en base de datos, modelos y controlador de acceso a datos.
