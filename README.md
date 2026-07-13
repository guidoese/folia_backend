# Folia - Backend API

Esta es la API RESTful de la aplicación **Folia**, construida con **Node.js**, **Express** y **MongoDB** (usando **Mongoose** como ODM). Su función principal es gestionar los usuarios, proveer mecanismos de autenticación y autorización mediante tokens JWT, enviar correos de verificación y restablecimiento de contraseña, y realizar operaciones CRUD sobre las notas del usuario.

---

## 🛠️ Tecnologías y Librerías Utilizadas

* **Express**: Framework web ligero para estructurar el enrutamiento y los controladores de la API.
* **Mongoose**: ODM para modelar y conectar de manera sencilla la base de datos MongoDB.
* **bcrypt**: Hashing seguro de contraseñas de usuarios.
* **jsonwebtoken (JWT)**: Emisión y verificación de tokens de sesión para autenticación stateless.
* **nodemailer**: Servicio de envío de correos electrónicos (verificación de cuentas y recuperación de contraseñas).
* **dotenv**: Configuración de variables de entorno seguras.

---

## 📁 Arquitectura del Código

El backend sigue un patrón modular limpio dentro de la carpeta [src](file:///c:/Users/sistemas/Documents/Curso%20UTN/utn2025-11/backend/Proyecto%20final/Folia/Backend/src):

* **[config](file:///c:/Users/sistemas/Documents/Curso%20UTN/utn2025-11/backend/Proyecto%20final/Folia/Backend/src/config)**: Configuración general y de base de datos (`mongodb.config.js`, `environment.config.js`).
* **[models](file:///c:/Users/sistemas/Documents/Curso%20UTN/utn2025-11/backend/Proyecto%20final/Folia/Backend/src/models)**: Definición de los esquemas de Mongoose ([User](file:///c:/Users/sistemas/Documents/Curso%20UTN/utn2025-11/backend/Proyecto%20final/Folia/Backend/src/models/user.model.js) y [Note](file:///c:/Users/sistemas/Documents/Curso%20UTN/utn2025-11/backend/Proyecto%20final/Folia/Backend/src/models/note.model.js)).
* **[routes](file:///c:/Users/sistemas/Documents/Curso%20UTN/utn2025-11/backend/Proyecto%20final/Folia/Backend/src/routes)**: Enrutadores Express que dirigen las peticiones HTTP al controlador adecuado.
* **[controllers](file:///c:/Users/sistemas/Documents/Curso%20UTN/utn2025-11/backend/Proyecto%20final/Folia/Backend/src/controllers)**: Lógica de negocio que procesa las solicitudes, interactúa con la base de datos y retorna respuestas.
* **[middlewares](file:///c:/Users/sistemas/Documents/Curso%20UTN/utn2025-11/backend/Proyecto%20final/Folia/Backend/src/middlewares)**: Funciones intermedias como la validación de tokens JWT ([auth.middleware.js](file:///c:/Users/sistemas/Documents/Curso%20UTN/utn2025-11/backend/Proyecto%20final/Folia/Backend/src/middlewares/auth.middleware.js)).
* **[helpers](file:///c:/Users/sistemas/Documents/Curso%20UTN/utn2025-11/backend/Proyecto%20final/Folia/Backend/src/helpers)**: Utilidades varias (ej. formateadores, transportadores de mail).

---

## 🗄️ Modelos de Base de Datos (Mongoose)

### 1. Usuario (`User`)
Almacena la información de registro y estado de verificación del usuario.
```javascript
{
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fecha_creacion: { type: Date, default: Date.now },
  activo: { type: Boolean, default: true },
  email_verificado: { type: Boolean, default: false }
}
```

### 2. Nota (`Note`)
Almacena el contenido de las notas y las asocia a un usuario.
```javascript
{
  titulo: { type: String, required: true },
  contenido: { type: String, default: "" },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // timestamps agregados automáticamente (createdAt, updatedAt)
}
```

---

## 🚦 Rutas y Endpoints de la API

### 🔑 Rutas de Autenticación (`/api/auth`)
Definidas en [auth.router.js](file:///c:/Users/sistemas/Documents/Curso%20UTN/utn2025-11/backend/Proyecto%20final/Folia/Backend/src/routes/auth.router.js).

| Método | Endpoint | Middleware | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Ninguno | Registra un nuevo usuario en la base de datos (con contraseña encriptada usando `bcrypt`) y envía un correo electrónico de verificación. |
| `GET` | `/verify-email` | Ninguno | Valida la cuenta mediante el parámetro `verification_token` recibido por query string. |
| `POST` | `/login` | Ninguno | Autentica las credenciales y devuelve un token JWT firmado si los datos son correctos y el correo está verificado. |
| `POST` | `/forgot-password` | Ninguno | Envía un email con un link que contiene un `reset_token` para reestablecer la contraseña si se ha olvidado. |
| `POST` | `/reset-password` | Ninguno | Modifica la contraseña del usuario tras validar el `reset_token` recibido por query string. |

### 📝 Rutas de Notas (`/api/notes`)
Definidas en [notes.router.js](file:///c:/Users/sistemas/Documents/Curso%20UTN/utn2025-11/backend/Proyecto%20final/Folia/Backend/src/routes/notes.router.js).
> ⚠️ **Nota:** Todas estas rutas requieren el uso del `authMiddleware`, por lo que se debe enviar la cabecera `Authorization: Bearer <token_jwt>`.

| Método | Endpoint | Parámetros / Body | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Ninguno | Devuelve todas las notas pertenecientes únicamente al usuario autenticado. |
| `POST` | `/` | `{ titulo, contenido }` | Crea una nueva nota asociada al usuario autenticado. |
| `PUT` | `/:id` | `{ titulo, contenido }` | Actualiza la nota correspondiente al `:id` especificado (verifica que la nota pertenezca al usuario autenticado). |
| `DELETE` | `/:id` | Ninguno | Elimina la nota correspondiente al `:id` especificado (verifica pertenencia del usuario). |

### 👤 Perfil (`/api/profile`)
* **`GET /api/profile`**: Endpoint protegido por `authMiddleware` para verificar la validez del token y obtener información básica del perfil del usuario actual.

---

## 🛡️ ¿Cómo funciona la Autenticación mediante Middleware?

El archivo [auth.middleware.js](file:///c:/Users/sistemas/Documents/Curso%20UTN/utn2025-11/backend/Proyecto%20final/Folia/Backend/src/middlewares/auth.middleware.js) es el encargado de proteger los endpoints sensibles:
1. Extrae el encabezado `authorization` de la solicitud entrante.
2. Comprueba que el formato sea `Bearer <JWT_TOKEN>`.
3. Decodifica el token usando la clave secreta `JWT_SECRET`. Si el token expiró o es inválido, retorna un error `401 Unauthorized`.
4. Si es válido, inyecta la información del usuario en el objeto `request` (disponible como `request.user` en los controladores siguientes) permitiendo filtrar las notas por el ID del usuario en la base de datos de manera segura.
