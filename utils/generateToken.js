import crypto from 'crypto';

// Función para generar un token único y temporal
const generateResetToken = () => {
    const token = crypto.randomBytes(20).toString('hex');
  
    const expirationTime = new Date(Date.now() + 1 * 60 * 60 * 1000);
    
    return { token, expirationTime };
};

export default generateResetToken;