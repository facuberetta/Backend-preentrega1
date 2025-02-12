import { Router } from "express";
import { prodManager } from '../managers/product.manager.js';

const router = Router();

router.get("/", async (req, res) => {
    try {
        const prods = await prodManager.getAll();
        res.status(200).json({ success: true, data: prods });
        } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const prod = await prodManager.getById(id);
        if (!prod) {
        return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }
    res.status(200).json({ success: true, data: prod });
    } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, price, category, stock } = req.body;

    if (!title || !price || !category) {
        return res.status(400).json({ success: false, message: "Faltan campos obligatorios" });
    }

    const prod = await prodManager.create(req.body);
    res.status(201).json({ success: true, data: prod });
    } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    }
});

router.delete("/", async (req, res) => {
    try {
        await prodManager.deleteAll();
        res.status(200).json({ success: true, message: "Todos los productos han sido eliminados" });
        } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const prodDel = await prodManager.delete(id);

    if (!prodDel) {
        return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

        res.status(200).json({ success: true, message: `Producto con ID: ${prodDel.id} eliminado con éxito` });
        } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

    router.get('/', (req, res) => {
        res.render('home', { products });
    });
    
    router.get('/realtimeproducts', (req, res) => {
        res.render('realTimeProducts');
    });

});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const prodUpd = await prodManager.update(req.body, id);

    if (!prodUpd) {
        return res.status(404).json({ success: false, message: "Producto no encontrado" });
    }

    res.status(200).json({ success: true, data: prodUpd });
    } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
