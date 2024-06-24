import nodemailer from 'nodemailer';

// Configurar el transporter de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sandoval.jezequiel.01@gmail.com',
    pass: 'nhiv ubrd ifii nyos',
  },
});

// Función para enviar el correo electrónico de restablecimiento de contraseña
const sendPasswordResetEmail = async (email, resetLink) => {
  const mailOptions = {
    from: 'sandoval.jezequiel.01@gmail.com',
    to: email,
    subject: 'Restablecer contraseña',
    html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${resetLink}">${resetLink}</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado correctamente');
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
  }
};

export default sendPasswordResetEmail;