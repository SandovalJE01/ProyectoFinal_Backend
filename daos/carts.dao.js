// cart.dao.js
import Cart from "../schemas/carts.schema.js";
import TicketDAO from "./ticket.dao.js";
import Products from "../schemas/product.schema.js";
import ProductDAO from "./products.dao.js";
import { v4 as uuidv4 } from 'uuid';


  
const calculateTotalAmount = (products) => {
  return products.reduce((total, product) => total + product.price, 0);
};

class CartDAO {

  static async getByCartId(cartId) {
    return await Cart.findById(cartId).lean();
  }

  static async getByUserId(userId) {
    const cart = await Cart.findOne({ userId }).lean();

    if (!cart) {
      return null; 
    }

    const productsIds = cart.products;
    const products = await Promise.all(productsIds.map(productId => ProductDAO.getById(productId)));

    const cartWithProducts = {
      ...cart,
      products: products,
    };

    return cartWithProducts;
  }

  static async addProduct(userId, productId) {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [productId], total: 0 });
    } else {
      cart.products.push(productId);
    }

    await cart.save();

    return cart;
  }

  static async finalizePurchase(userId, cart, products) {
    const code = uuidv4(); 
    const amount = calculateTotalAmount(products); 
    const purchaser = userId;
    const ticket = await TicketDAO.createTicket(code, amount, purchaser);
    await Cart.updateOne({ _id: cart._id }, { $set: { products: [] } });    
    return ticket;
  }

  static async emptyCart(cartId) {
    return await Cart.updateOne({ _id: cartId }, { $set: { products: [] } });
  }
}

export default CartDAO;