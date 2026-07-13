import ENVIRONMENT from "../config/environment.config.js";
import mailer_transport from "../config/mailer.config.js";
import ServerError from "../helpers/serverError.helper.js";
import userRepository from "../repositories/user.repository.js";
import noteRepository from "../repositories/notes.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//funcion builder para hacer el mail HTML con estilo inlline
function buildVerificationEmailHtml(verification_token, url_frontend) {
  const verification_url = `${url_frontend}/verify-email?verification_token=${verification_token}`;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verificá tu cuenta en Folia</title>
</head>
<body style="margin:0;padding:0;background-color:#F0EBE3;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#FAF7F2;border-radius:16px;border:1px solid #E2DDD3;overflow:hidden;">
        <tr>
          <td style="background-color:#C7853D;padding:32px 40px 28px;">
            <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.75);">Bienvenido a</p>
            <h1 style="margin:0;font-family:Georgia,serif;font-size:36px;font-weight:bold;color:#FFFFFF;letter-spacing:-0.5px;">Folia</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px 32px;">
            <h2 style="margin:0 0 12px;font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#2B2926;line-height:1.3;">Verificá tu dirección de email</h2>
            <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:15px;line-height:1.65;color:#6B6258;">Gracias por registrarte. Para empezar a guardar tus notas en Folia, necesitamos confirmar que esta dirección de email te pertenece.</p>
            <p style="margin:0 0 28px;font-family:Arial,sans-serif;font-size:15px;line-height:1.65;color:#6B6258;">Hacé click en el botón de abajo para verificar tu cuenta. Si no fuiste vos quien se registró, podés ignorar este mensaje.</p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background-color:#C7853D;border-radius:8px;">
                  <a href="${verification_url}" style="display:inline-block;padding:14px 32px;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;color:#FFFFFF;text-decoration:none;border-radius:8px;letter-spacing:0.02em;">Verificar mi cuenta</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px;">
            <div style="height:1px;background-color:#E2DDD3;"></div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px 32px;">
            <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:12px;color:#A89E90;line-height:1.6;">Si el botón no funciona, copiá y pegá este enlace en tu navegador:</p>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#C7853D;word-break:break-all;">${verification_url}</p>
          </td>
        </tr>
      </table>
      <p style="margin:20px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#A89E90;text-align:center;">© Folia · Tu espacio de notas personales</p>
    </td></tr>
  </table>
</body>
</html>`.trim();
}
//funcion bilder paa hacer el mail HTML con estilo inlline para restablecer la contraseña
function buildResetPasswordEmailHtml(reset_token, url_frontend) {
  const reset_url = `${url_frontend}/reset-password?reset_token=${reset_token}`;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Restablecé tu contraseña en Folia</title>
</head>
<body style="margin:0;padding:0;background-color:#F0EBE3;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#FAF7F2;border-radius:16px;border:1px solid #E2DDD3;overflow:hidden;">
        <tr>
          <td style="background-color:#C7853D;padding:32px 40px 28px;">
            <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.75);">Folia</p>
            <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:bold;color:#FFFFFF;letter-spacing:-0.5px;">Restablecé tu contraseña</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px 32px;">
            <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:15px;line-height:1.65;color:#6B6258;">Recibimos una solicitud para restablecer la contraseña de tu cuenta en Folia.</p>
            <p style="margin:0 0 28px;font-family:Arial,sans-serif;font-size:15px;line-height:1.65;color:#6B6258;">Este enlace es válido por <strong style="color:#2B2926;">15 minutos</strong>. Si no fuiste vos, podés ignorar este mensaje — tu contraseña no va a cambiar.</p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background-color:#C7853D;border-radius:8px;">
                  <a href="${reset_url}" style="display:inline-block;padding:14px 32px;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;color:#FFFFFF;text-decoration:none;border-radius:8px;letter-spacing:0.02em;">Restablecer contraseña</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px;">
            <div style="height:1px;background-color:#E2DDD3;"></div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px 32px;">
            <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:12px;color:#A89E90;line-height:1.6;">Si el botón no funciona, copiá y pegá este enlace en tu navegador:</p>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#C7853D;word-break:break-all;">${reset_url}</p>
          </td>
        </tr>
      </table>
      <p style="margin:20px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#A89E90;text-align:center;">© Folia · Tu espacio de notas personales</p>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

//funcion builder para hacer el mail HTML con estilo inline para notificar al usuario que se elimino la cuenta
function buildDeleteAccountEmailHtml(nombre, url_frontend) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Cuenta eliminada en Folia</title>
</head>
<body style="margin:0;padding:0;background-color:#F0EBE3;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background-color:#FAF7F2;border-radius:16px;border:1px solid #E2DDD3;overflow:hidden;">
        <tr>
          <td style="background-color:#2B2926;padding:32px 40px 28px;">
            <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.5);">Folia</p>
            <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:bold;color:#FFFFFF;letter-spacing:-0.5px;">Cuenta eliminada</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px 32px;">
            <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:15px;line-height:1.65;color:#6B6258;">Hola <strong style="color:#2B2926;">${nombre}</strong>, te confirmamos que tu cuenta en Folia fue eliminada con éxito.</p>
            <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:15px;line-height:1.65;color:#6B6258;">Todos tus datos y notas fueron borrados permanentemente de nuestros servidores.</p>
            <p style="margin:0 0 28px;font-family:Arial,sans-serif;font-size:15px;line-height:1.65;color:#6B6258;">Si esto fue un error o querés volver a usar Folia, podés crear una nueva cuenta en cualquier momento.</p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background-color:#C7853D;border-radius:8px;">
                  <a href="${url_frontend}/register" style="display:inline-block;padding:14px 32px;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;color:#FFFFFF;text-decoration:none;border-radius:8px;letter-spacing:0.02em;">Crear nueva cuenta</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 40px;">
            <div style="height:1px;background-color:#E2DDD3;"></div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px 32px;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#A89E90;line-height:1.6;">Si no fuiste vos quien eliminó esta cuenta, lamentablemente no podemos recuperar los datos. Podés contactarnos respondiendo este email.</p>
          </td>
        </tr>
      </table>
      <p style="margin:20px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#A89E90;text-align:center;">© Folia · Tu espacio de notas personales</p>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

//Class AuthController
class AuthController {
  //registra un nuevo usuario
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validaciones
      if (!name || name.length <= 2) {
        throw new ServerError("Nombre debe ser mayor a 2 caracteres", 400);
      }

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        throw new ServerError("Email inválido", 400);
      }

      if (!password || password.length < 6) {
        throw new ServerError("Password debe tener al menos 6 caracteres", 400);
      }

      const existingUser = await userRepository.getByEmail(email);
      if (existingUser) {
        throw new ServerError("El email ya está registrado", 400);
      }

      //const newUser = await userRepository.create(name, email, password);

      //parametro password Cost factor, entre mas alto mas seguro pero mas lento, 12 es un buen numero para aplicaciones web 1-Costfactor-20
      const hashed_password = await bcrypt.hash(password, 12);

      const newUser = await userRepository.create(name, email, hashed_password);

      const verification_token = jwt.sign(
        {
          email: email,
        },
        ENVIRONMENT.JWT_SECRET,
      );
      await mailer_transport.sendMail({
        to: email,
        from: ENVIRONMENT.GMAIL_USERNAME,
        subject: "Verificá tu cuenta en Folia",
        html: buildVerificationEmailHtml(
          verification_token,
          ENVIRONMENT.URL_FRONTEND,
        ),
      });

      return res.status(201).json({
        message: "Usuario registrado con éxito",
        ok: true,
        status: 201,
        data: {
          user: {
            id: newUser._id,
            name: newUser.nombre,
            email: newUser.email,
          },
        },
      });
    } catch (error) {
      if (error instanceof ServerError) {
        return res.status(error.status).json({
          message: error.message,
          ok: false,
          status: error.status,
        });
      } else {
        console.error("Error critico:", error);
        return res.status(500).json({
          message: "Error interno del servidor",
          ok: false,
          status: 500,
        });
      }
    }
  }
  //verifica el email del usuario
  async verifyEmail(request, response) {
    try {
      const { verification_token } = request.query;
      if (!verification_token) {
        throw new ServerError("Falta el token de verificación", 400);
      }
      const payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET);
      const { email } = payload;
      const user = await userRepository.getByEmail(email);
      if (!user) {
        throw new ServerError("Usuario no encontrado", 400);
      }
      if (user.email_verificado) {
        throw new ServerError("Este email ya ha sido verificado", 400);
      }

      await userRepository.updateById(user._id, { email_verificado: true });

      return response.status(200).json({
        message: "Email verificado con éxito",
        ok: true,
        status: 200,
      });
    } catch (error) {
      if (
        error instanceof jwt.JsonWebTokenError ||
        error instanceof jwt.NotBeforeError ||
        error instanceof jwt.TokenExpiredError
      ) {
        return response.status(401).json({
          message: "Token de verificación inválido",
          ok: false,
          status: 401,
        });
      } else if (error instanceof ServerError) {
        return response.status(error.status).json({
          message: error.message,
          ok: false,
          status: error.status,
        });
      } else {
        console.error("Error critico:", error);
        return response.status(500).json({
          message: "Error interno del servidor",
          ok: false,
          status: 500,
        });
      }
    }
  }
  //login de usuario si esta registrado
  async login(request, response) {
    try {
      const { email, password } = request.body;

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        throw new ServerError("Email inválido", 400);
      }

      if (!password || password.length < 6) {
        throw new ServerError("Contraseña invalida", 400);
      }

      const user_found = await userRepository.getByEmail(email);

      if (!user_found) {
        throw new ServerError("Usuario no registrado", 404);
      }

      if (!user_found.email_verificado) {
        throw new ServerError(
          "Usuario con verificacion de mail pendiente",
          401,
        );
      }

      const is_same_password = await bcrypt.compare(
        password,
        user_found.password,
      );

      if (!is_same_password) {
        throw new ServerError("Credenciales invalidas", 401);
      }

      //Ese objeto es el que se guardara dentro del token de authorizacion
      const profile_info = {
        nombre: user_found.nombre,
        email: user_found.email,
        id: user_found._id,
        fecha_creacion: user_found.fecha_creacion,
      };

      //Aca creamos el token
      const access_token = jwt.sign(profile_info, ENVIRONMENT.JWT_SECRET);

      return response.status(200).json({
        ok: true,
        status: 200,
        message: "Usuario autentificado exitosamente",
        data: {
          access_token,
        },
      });
    } catch (error) {
      if (error instanceof ServerError) {
        return response.status(error.status).json({
          message: error.message,
          ok: false,
          status: error.status,
        });
      } else {
        console.error("Error critico:", error);
        return response.status(500).json({
          message: "Error interno del servidor",
          ok: false,
          status: 500,
        });
      }
    }
  }

  // Endpoint para solicitar restablecimiento de contraseña
  async forgotPassword(request, response) {
    try {
      const { email } = request.body;

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        throw new ServerError("Email inválido", 400);
      }

      const user = await userRepository.getByEmail(email);

      // Respondemos igual aunque el usuario no exista — evita revelar
      // qué emails están registrados (buena práctica de seguridad)
      if (!user) {
        return response.status(200).json({
          ok: true,
          status: 200,
          message:
            "Si el email existe, recibirás un enlace para restablecer tu contraseña",
        });
      }

      // Token que expira en 15 minutos
      const reset_token = jwt.sign(
        { email: user.email },
        ENVIRONMENT.JWT_SECRET,
        { expiresIn: "15m" },
      );

      await mailer_transport.sendMail({
        to: email,
        from: ENVIRONMENT.GMAIL_USERNAME,
        subject: "Restablecé tu contraseña en Folia",
        html: buildResetPasswordEmailHtml(
          reset_token,
          ENVIRONMENT.URL_FRONTEND,
        ),
      });

      return response.status(200).json({
        ok: true,
        status: 200,
        message:
          "Si el email existe, recibirás un enlace para restablecer tu contraseña",
      });
    } catch (error) {
      if (error instanceof ServerError) {
        return response.status(error.status).json({
          message: error.message,
          ok: false,
          status: error.status,
        });
      }
      console.error("Error critico:", error);
      return response.status(500).json({
        message: "Error interno del servidor",
        ok: false,
        status: 500,
      });
    }
  }

  // Endpoint para restablecer la contraseña usando el token enviado por email
  async resetPassword(request, response) {
    try {
      const { reset_token } = request.query;
      const { password } = request.body;

      if (!reset_token) {
        throw new ServerError("Falta el token de restablecimiento", 400);
      }

      if (!password || password.length < 6) {
        throw new ServerError(
          "La contraseña debe tener al menos 6 caracteres",
          400,
        );
      }

      // jwt.verify lanza error automáticamente si el token expiró
      const payload = jwt.verify(reset_token, ENVIRONMENT.JWT_SECRET);
      const { email } = payload;

      const user = await userRepository.getByEmail(email);
      if (!user) {
        throw new ServerError("Usuario no encontrado", 404);
      }

      const hashed_password = await bcrypt.hash(password, 12);
      await userRepository.updateById(user._id, { password: hashed_password });

      return response.status(200).json({
        ok: true,
        status: 200,
        message: "Contraseña restablecida con éxito",
      });
    } catch (error) {
      if (
        error instanceof jwt.JsonWebTokenError ||
        error instanceof jwt.TokenExpiredError
      ) {
        return response.status(401).json({
          message: "El enlace de restablecimiento es inválido o ya expiró",
          ok: false,
          status: 401,
        });
      }
      if (error instanceof ServerError) {
        return response.status(error.status).json({
          message: error.message,
          ok: false,
          status: error.status,
        });
      }
      console.error("Error critico:", error);
      return response.status(500).json({
        message: "Error interno del servidor",
        ok: false,
        status: 500,
      });
    }
  }

  async deleteAccount(request, response) {
    try {
      const { password } = request.body;
      const user_id = request.user.id;

      if (!password) {
        throw new ServerError("La contraseña es obligatoria", 400);
      }

      const user = await userRepository.getById(user_id);
      if (!user) {
        throw new ServerError("Usuario no encontrado", 404);
      }

      // Verificamos la contraseña antes de eliminar
      const is_same_password = await bcrypt.compare(password, user.password);
      if (!is_same_password) {
        throw new ServerError("Contraseña incorrecta", 401);
      }

      // Eliminamos todas las notas del usuario primero
      await noteRepository.deleteAllByUserId(user_id);

      // Guardamos el nombre y email antes de eliminar el usuario
      const nombre = user.nombre;
      const email = user.email;

      // Eliminamos el usuario
      await userRepository.deleteById(user_id);

      // Enviamos el mail de confirmación
      await mailer_transport.sendMail({
        to: email,
        from: ENVIRONMENT.GMAIL_USERNAME,
        subject: "Tu cuenta en Folia fue eliminada",
        html: buildDeleteAccountEmailHtml(nombre, ENVIRONMENT.URL_FRONTEND),
      });

      return response.status(200).json({
        ok: true,
        status: 200,
        message: "Cuenta eliminada con éxito",
      });
    } catch (error) {
      if (error instanceof ServerError) {
        return response.status(error.status).json({
          message: error.message,
          ok: false,
          status: error.status,
        });
      }
      console.error("Error critico:", error);
      return response.status(500).json({
        message: "Error interno del servidor",
        ok: false,
        status: 500,
      });
    }
  }
}
const authController = new AuthController();

export default authController;

/* 

COMO VALIDAR UN MAIL?
El usuario se registra con un x mail
El sistema envia un mail con un link tipo 
    <a 
        href='${URL_BACKEND + '/api/auth/verify-email?email=${email}'}'
    >
        click aqui para verificar
    </a>
Cuando el usuario de click a ese link estara emitiendo un GET /api/auth/verify-email?email=pepe@gmail.com desde su navegador
Nosotros recibimos la consulta y cambiamos la propiedad email_verificado a true en la DB

CONSIGNA: 
Agregar la propiedad booleana 'email_verificado' sobre el usuario en el modelo de mongoose.

En el controller de register, luego de crear el usuario, enviar un mail con el link de verificacion.

Crear el endpoint dentro de la ruta api/auth
    GET /verify-email 
        Recibe una querystring llamada email (req.query)
        Valida que el email exista
        Valida que no este verificado aun
        Cambia el verificado a verdadero
        Responde exitosamente
*/

/* 
Como manejar un inicio de sesion?

Vamos a tener un endpoint
POST /api/auth/login
    body:{email,pasword}
    
    -Buscar el usuario por email
    -Validar la contraseña (bcrypt.compare(texto_original,texto_hasheado) esto devolvera un booleano)
    -Crear un jsonwebtoken con los datos de sesion del usuario (username, email, id, created_at)
    -responder con ese token (acces_token)al cliente

*/
