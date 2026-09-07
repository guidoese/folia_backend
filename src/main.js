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

// Configure CORS for cross-origin requests

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
   authMiddleware,
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
