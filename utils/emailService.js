// utils/emailService.js
const resend = require("../config/resend");

exports.sendTestEmail = async (toEmail, code) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // puedes usar "onboarding@resend.dev" para pruebas
      to: toEmail,
      subject: "Código de prueba (Resend Test)",
      html: `<h1>Tu código es: <strong>${code}</strong></h1>`
    });
    console.log("Correo enviado con Resend:", response);

    return response;
  } catch (error) {
    console.error("Error enviando correo con Resend:", error);
    throw error;
  }
};
