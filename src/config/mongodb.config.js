import mongoose from "mongoose";
import ENVIRONMENT from "./environment.config.js";

let isConnected = false;

const connectMongoDB = async () => {
  if (isConnected) return; // Si ya hay conexión, no hacemos nada

  try {
    await mongoose.connect(
      ENVIRONMENT.MONGO_DB_CONNECTION_STRING + "/" + ENVIRONMENT.MONGO_DB_NAME,
    );
    isConnected = true;
    console.log("La conexion con MongoDB funciona");
  } catch (error) {
    console.error("Hubo un fallo en la conexion de la DB", error);
    throw error;
  }
};

export default connectMongoDB;
