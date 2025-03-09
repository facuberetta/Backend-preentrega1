import { Router } from "express";
import Product from "../models/product.model.js";

const router = Router();

router.get("/products", async (req, res) => {
    try {
        const { limit = 10, page = 1, query, sort } = req.query;
        let filter = {};

        if (query) {
            filter = { category: query };
        }

        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
        };

        const products = await Product.paginate(filter, options);

        res.render("products", {
            products: products.docs,
            totalPages: products.totalPages,
            currentPage: products.page,
            prevPage: products.hasPrevPage ? `/products?page=${products.prevPage}` : null,
            nextPage: products.hasNextPage ? `/products?page=${products.nextPage}` : null,
        });
    } catch (error) {
        res.status(500).send("Error al cargar los productos.");
    }
});

router.get("/carts/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid).populate("products.product");

        res.render("cart", {
            cart,
            products: cart.products,
        });
    } catch (error) {
        res.status(500).send("Error al cargar el carrito.");
    }
});

export default router;
