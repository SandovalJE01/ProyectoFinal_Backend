import { Router} from "express";
import ProductsControllers from "../controllers/products.controller.js"

const router = Router();
export default router;

router.get("/products", ProductsControllers.GetProducts );

router.get('/products/:pid', ProductsControllers.GetProductById);

router.post("/addCart", ProductsControllers.AddProductCart);

router.get('/cart', ProductsControllers.viewCart);

router.post("/:cid/purchase", ProductsControllers.purchaseCart);

router.post("/create-product", ProductsControllers.CreateProduct);

router.delete('/:pid', ProductsControllers.DeleteProduct);

router.get('/create', (req, res) => {
    res.render('createProduct');
});