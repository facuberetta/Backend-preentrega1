import { Router } from "express";
import Product from "../models/product.model.js";
const router = Router();

router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, query, sort } = req.query;
        let filter = {};

        if (query) {
            filter = { category: query }; // Filtrar por categoría
        }

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === "asc" ? 1 : -1 } : {}, // Ordenar por precio
        };

        const products = await Product.paginate(filter, options);

        res.json({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}` : null,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const prod = await Product.findById(id);

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
        const { title, price, category } = req.body;

        if (!title || !price || !category) {
            return res.status(400).json({ success: false, message: "Faltan campos obligatorios" });
        }

        const prod = new Product(req.body);
        await prod.save();

        res.status(201).json({ success: true, data: prod });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete("/", async (req, res) => {
    try {
        await Product.deleteMany({});
        res.status(200).json({ success: true, message: "Todos los productos han sido eliminados" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const prodDel = await Product.findByIdAndDelete(id);

        if (!prodDel) {
            return res.status(404).json({ success: false, message: "Producto no encontrado" });
        }

        res.status(200).json({ success: true, message: `Producto con ID: ${prodDel._id} eliminado con éxito` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const prodUpd = await Product.findByIdAndUpdate(id, req.body, { new: true });

        if (!prodUpd) {
            return res.status(404).json({ success: false, message: "Producto no encontrado" });
        }

        res.status(200).json({ success: true, data: prodUpd });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
