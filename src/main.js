import ENVIRONMENT from "./config/environment.config.js";
import connectMongoDB from "./config/mongodb.config.js";
import express from "express";
import authRouter from "./routes/auth.router.js";

import notesRouter from "./routes/notes.router.js";
/* SOLO EN LOCAL Y SI TENER PROBLEMAS DE DNS PARA CONECTARTE A MONGODB */
import dns from "dns";
import authMiddleware from "./middlewares/auth.middleware.js";
import cors from "cors";

if (ENVIRONMENT.MODE === "development") {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

const app = express();
const port = ENVIRONMENT.PORT;

//Habilitamos las consultas CORS de origen crusado

app.use(
  cors({
    origin: ENVIRONMENT.MODE === "development" ? "*" : ENVIRONMENT.URL_FRONTEND,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

//parse json
app.use(express.json());

//conect mongo db
app.use(async (request, response, next) => {
  try {
    await connectMongoDB();
    next();
  } catch (error) {
    return response.status(500).json({
      message: "Error de conexión con la base de datos",
      ok: false,
      status: 500,
    });
  }
});

//rutas
app.use("/api/auth", authRouter);

app.use("/api/notes", notesRouter);

app.get(
  "/api/profile",
  /*  (request, response, next) => {
        const random_num = Math.random() 
        console.log('Numero aleatorion generado:', random_num)
        if(random_num > 0.5){
            return response.json({
                message:"Mala suerte campeon ☠"
            })
        }
        else{
            next()
        }
    }, */ authMiddleware,
  (request, response) => {
    console.log("Nombre del cliente:", request.user.nombre);
    return response.json({
      ok: true,
      status: 200,
      message: "Estas autenticando",
    });
  },
);

// Solo escuchamos en local, en Vercel exportamos la app
if (ENVIRONMENT.MODE === "development") {
  app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
  });
}

export default app;
/* 

/api/auth => Trabaja todo lo relacionado a autentificacion 
/api/workspace => Trabaja todo lo relacionado a workspaces
    /:workspace_id/members => Todo lo relacionado a membresias
    /:workspace_id/channels => Todo lo relacionado a canales
        /:channel_id/messages => Todo lo relacionado a mensajes
    /:workspace_id/contacts


Crear mensaje: 
    POST /api/workspaces/:workspace_id/channels/:channel_id/messages
    authMiddleware
    verifyWorkspaceMiddleware
    verifyChannelMiddleware
    messagesController.create()
*/
