import { Router } from "express";
import Cart from "../models/cart.model.js";

const router = Router();

// Crear un nuevo carrito
router.post("/", async (req, res) => {
    try {
        const { products } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ success: false, message: "Se requiere un array de productos para crear el carrito." });
        }

        const cart = await Cart.create({ products });
        res.status(201).json({ success: true, data: cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).send({ error: 'Carrito no encontrado' });

        cart.products = cart.products.filter(item => item.product.toString() !== pid);
        await cart.save();
        res.send({ message: 'Producto eliminado del carrito', cart });
    } catch (error) {
        res.status(500).send({ error: 'Error al eliminar el producto' });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;
        const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });
        if (!cart) return res.status(404).send({ error: 'Carrito no encontrado' });

        res.send({ message: 'Carrito actualizado', cart });
    } catch (error) {
        res.status(500).send({ error: 'Error al actualizar el carrito' });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await Cart.findById(cid);
        if (!cart) return res.status(404).send({ error: 'Carrito no encontrado' });

        const productIndex = cart.products.findIndex(item => item.product.toString() === pid);
        if (productIndex === -1) return res.status(404).send({ error: 'Producto no encontrado en el carrito' });

        cart.products[productIndex].quantity = quantity;
        await cart.save();
        res.send({ message: 'Cantidad actualizada', cart });
    } catch (error) {
        res.status(500).send({ error: 'Error al actualizar la cantidad' });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
        if (!cart) return res.status(404).send({ error: 'Carrito no encontrado' });

        res.send({ message: 'Carrito vaciado', cart });
    } catch (error) {
        res.status(500).send({ error: 'Error al vaciar el carrito' });
    }
});

export default router;

