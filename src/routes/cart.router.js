import { Router } from "express";
import { cartManager } from '../managers/cart.manager.js';

const router = Router();

router.post("/", async (req, res) => {
    try {
        const { products } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ success: false, message: "Se requiere un array de productos para crear el carrito." });
        }

        const cart = await cartManager.create(products);
        res.status(201).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
