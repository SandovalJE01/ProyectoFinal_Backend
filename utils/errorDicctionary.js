const errorDictionary = {
    PRODUCT_NOT_FOUND: "El producto no se encontró",
    CART_NOT_FOUND: "El carrito no se encontró",
    PERMISSION_DENIED: "No tienes permiso para realizar esta acción",
    OUT_OF_STOCK: "El producto está fuera de stock",
    INTERNAL_ERROR: "Error interno del servidor",
    INVALID_REQUEST: "La solicitud es inválida",
    USER_NOT_FOUND: "El usuario no se encontró",
    INVALID_CREDENTIALS: "Credenciales inválidas",
    INVALID_TOKEN: "Token inválido",
    DATABASE_ERROR: "Error de base de datos",
};

const errorHandler = (errorCode) => {
    return errorDictionary[errorCode] || "Error desconocido";
};

export default { 
    errorDictionary, 
    errorHandler 
};