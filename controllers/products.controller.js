import ProductDAO from "../daos/products.dao.js";
import UsersDAO from "../daos/users.dao.js";
import CartDAO from "../daos/carts.dao.js";
import UserDTO from "../dtos/user.dto.js";
import ProductDTO from "../dtos/product.dto.js";
import logger from '../utils/logger.js';
import { sendEmail } from '../utils/emailService.js';

const GetProducts = async (req, res) => {
    try {
        console.log(req.session.user);
        const products = await ProductDAO.getAll();
        const userId = req.session.user;
        const user = await UsersDAO.getUserByID(userId);
        const userDTO = new UserDTO(user);
        const productsDTO = products.map(product => new ProductDTO(product));
        res.render("products", { user:userDTO, products: productsDTO });
        logger.info('Se obtuvieron los productos correctamente');
      } catch (error) {
        console.error(error);
        res.status(500).send("Error obteniendo productos");
        logger.error('Error al obtener los productos', { error: error.message });
      }
}

const GetProductById = async (req, res) => {
  const { pid } = req.params;
  try {
      const product = await ProductDAO.getById(pid);
      if (!product) {
        const errorMessage = errorHandler('PRODUCT_NOT_FOUND');
        return res.status(404).send(errorMessage);
      }
      const productDTO = new ProductDTO(product);
      res.render('detailProduct', { product: productDTO });
      logger.info(`Se obtuvo el producto ${pid} correctamente`);
  } catch (error) {
      console.error(error);
      const errorMessage = errorHandler('INTERNAL_ERROR');
      res.status(500).send(errorMessage);
      logger.error(`Error al obtener el producto ${pid}`, { error: error.message });
  }
}

const AddProductCart = async (req, res) => {
  const { productId } = req.body;
  try {
    const userId = req.session.user;
    const user = await UsersDAO.getUserByID(userId);
    console.log(user._id.toString(), "XXX")
    console.log(user)
    if (user.role === 'premium') {
      const product = await ProductDAO.getById(productId);
      console.log(product, "XXX")
      console.log(userId)
      if (product.createdBy.toString() === userId) {
        return res.status(403).json({ message: 'No puedes agregar tu propio producto al carrito' });
      }
    }
    await CartDAO.addProduct(userId, productId);
    res.redirect("/store/products");
    logger.info('Producto agregado al carrito correctamente');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error agregando producto al carrito");
    logger.error('Error al agregar producto al carrito', { error: error.message });
  }
}

const purchaseCart = async (req, res) => {
  const { cid } = req.params;  
  const userId = req.session.user;  
  try {
    const cart = await CartDAO.getByCartId(cid);
    if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });
    const products = cart.products;
    const ticket = await CartDAO.finalizePurchase(userId, cart, products);
    await CartDAO.emptyCart(cid);
    console.log(cid)
    logger.info('Compra realizada con éxito');
    return res.status(200).json({ message: "Compra realizada con éxito", ticket });
  } catch (error) {
    console.error(error);
    logger.error('Error al procesar la compra del carrito', { error: error.message });
    return res.status(500).json({ message: "Error al procesar la compra del carrito" });
  }
};

const viewCart = async (req, res) => {
  const userId = req.session.user;
  console.log(userId)
  try {
      const cart = await CartDAO.getByUserId(userId);
      console.log(cart)
      if (cart) {
          res.render('cart', { cart });
      } else {
          return res.status(404).json({ message: "El usuario no tiene un carrito asociado" });
      }
  } catch (error) {
      console.error(error);
      logger.error('Error al obtener el carrito del usuario', { error: error.message });
      return res.status(500).json({ message: "Error al obtener el carrito del usuario" });
  }
};

const CreateProduct = async (req, res) => {
  console.log(req.session.user);
  console.log(req.session)
  const user = await UsersDAO.getUserByID(req.session.user);
  console.log(user.role);
    if (req.session && req.session.user && (user.role === 'premium' || user.role === 'admin')) {
      try {
          const { name, price, category, description } = req.body;
          const createdBy = user._id;
          const product = await ProductDAO.addProduct(name, price, category, description, createdBy);
          res.redirect('/store/products');
      } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Error al crear el producto.' });
      }
  } else {
      return res.status(403).json({ message: 'No tienes permiso para crear productos.' });
  }
}

const DeleteProduct = async (req, res) => {
  const productId = req.params.pid;
  const createByUser = await ProductDAO.getById(productId);
  const createdById = createByUser.createdBy.toString();  
  try {
      const product = await ProductDAO.getById(productId);
      if (!product) {
          return res.status(404).json({ message: "Producto no encontrado" });
      }

      await ProductDAO.deleteProductById(productId);

      const user = await UsersDAO.getUserByID(createdById);
      if (user.role === 'premium') {
          const message = {
            from: '"Tu Nombre" <tu-email@example.com>',
            to: user.email,
            subject: 'Producto Eliminado',
            text: `Hola ${user.first_name}, tu producto ha sido eliminado `,
            html: `<b>Hola ${user.first_name}, tu producto ha sido eliminado ${product.name}</b>`,
        };
        await sendEmail(message);
      }

      res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar el producto" });
  }
};


export default  {
    GetProducts,
    GetProductById,
    AddProductCart,
    purchaseCart,
    viewCart,
    CreateProduct ,
    DeleteProduct
}