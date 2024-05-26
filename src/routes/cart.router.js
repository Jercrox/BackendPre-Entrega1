import { Router } from "express";
import fileSystem from "fs";
import CartManager from "../managers/cartManager.js";

const router = Router();
const cartManager = new CartManager('./carts.json');
const loadProducts = () => {
    if (fileSystem.existsSync('./products.json')) {
        const data = fileSystem.readFileSync('./products.json', 'utf-8');
        return JSON.parse(data);
    } else {
        return [
            { "id": 1, "name": "Alfajor de chocolate", "quantity": 20, "price": 25, "category": "Dulces", "description": "Delicioso alfajor relleno de dulce de leche y cubierto de chocolate." },
            { "id": 2, "name": "Chocolate", "quantity": 15, "price": 30, "category": "Dulces", "description": "Tableta de chocolate negro de alta calidad." },
            { "id": 3, "name": "Caramelos surtidos", "quantity": 10, "price": 10, "category": "Dulces", "description": "Paquete de caramelos de varios sabores: frutilla, limón, naranja y menta." },
            { "id": 4, "name": "Gomitas de ositos", "quantity": 18, "price": 15, "category": "Dulces", "description": "Gomitas suaves con forma de ositos, ideales para disfrutar como snack." },
            { "id": 5, "name": "Papas fritas", "quantity": 25, "price": 20, "category": "Snacks", "description": "Bolsa de papas fritas crujientes y sabrosas." }
        ];
    }
}

router.post('/', async (req, res) => {
    const carts = await cartManager.loadCarts();
    const newCartId = await cartManager.getNextId();
    const newCart = {
        id: newCartId,
        productsInCart: []
    };
    carts.push(newCart);
    await cartManager.saveCarts(carts);
    res.status(201).send(newCart);
});


router.get('/:cid', async (req, res) => {
    const carts = await cartManager.loadCarts();
    const cartId = parseInt(req.params.cid);
    const cart = carts.find(c => c.id === cartId);
    if (!cart) {
        return res.status(404).send({ status: "error", error: "cart not found" });
    }
    res.send(cart.productsInCart);
});

router.post('/:cid/product/:pid', async (req, res) => {
    const carts = await cartManager.loadCarts();
    const products = loadProducts();
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    const cart = carts.find(c => c.id === cartId);
    if (!cart) {
        return res.status(404).send({ status: "error", error: "cart not found" });
    }

    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).send({ status: "error", error: "product not found" });
    }

    const existingProductInCart = cart.productsInCart.find(p => p.product === productId);
    if (existingProductInCart) {
        existingProductInCart.quantity += 1;
    } else {
        cart.productsInCart.push({ product: productId, quantity: 1 });
    }

    await cartManager.saveCarts(carts);
    res.status(201).send(cart);
});

export default router;