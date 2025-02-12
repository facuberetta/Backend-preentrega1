import { Router } from "express";
import { cartManager } from "../managers/cart.manager.js";
const router = Router();

router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.createCart();
        res.status(201).json({ cart: nuevoCarrito });
        } catch (error) {
        res.status(500).json({ message: error.message });
}
});

router.get("/:idCart", async (req, res) => {
    try {
    const { idCart } = req.params;
    const cart = await cartManager.getCartById(idCart);

    if (!cart) {
    return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.json({ cart: cart.products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/:idCart/product/:idProd", async (req, res) => {
    try {
    const { idCart, idProd } = req.params;
    const response = await cartManager.saveProdToCart(idCart, idProd);

    if (!response) {
    return res.status(400).json({ message: "Producto o carrito no válido" });
    }

    res.json({ cart: response.products });
    } catch (error) {
    res.status(500).json({ message: error.message });
}

router.get('/', (req, res) => {
    res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});
});

export default router;
