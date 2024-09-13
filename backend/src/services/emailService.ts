import transporter from "../config/nodemailer";
import fs from "fs";
import path from "path";

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `https://localhost:5173/reset-password?token=${token}`;
  const logoPath = path.join(__dirname, '../../../src/public/assets/img/logo.png');
  const logoBase64 = fs.readFileSync(logoPath, { encoding: 'base64' });
  const logoSrc = `data:image/png;base64,${logoBase64}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Restablece tu contraseña - AnimeFlix",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <div style="text-align: center;">
          <img src="${logoSrc}" alt="AnimeFlix Logo" style="max-width: 150px; margin-bottom: 20px;">
        </div>
        <h2 style="color: #e50914; text-align: center;">Recupera tu contraseña</h2>
        <p style="font-size: 16px; color: #555;">Hola,</p>
        <p style="font-size: 16px; color: #555;">
          Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>AnimeFlix</strong>. Haz clic en el botón a continuación para establecer una nueva contraseña:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" style="padding: 10px 20px; background-color: #e50914; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 5px;">Restablecer Contraseña</a>
        </div>
        <p style="font-size: 16px; color: #555;">
          Si no solicitaste restablecer tu contraseña, puedes ignorar este correo electrónico. Tu contraseña actual permanecerá segura.
        </p>
        <p style="font-size: 14px; color: #999; text-align: center; margin-top: 20px;">
          &copy; 2024 AnimeFlix. Todos los derechos reservados.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo de restablecimiento enviado a:", email);
  } catch (error) {
    console.error("Error al enviar el correo de restablecimiento:", error);
    throw new Error("No se pudo enviar el correo de restablecimiento");
  }
}
