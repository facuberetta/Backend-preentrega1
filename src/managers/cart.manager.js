import fs from 'node:fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { prodManager } from './product.manager.js';

class CartManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async getCarts() {
        try {
            if (!fs.existsSync(this.path)) {
                return [];
            }

            const carts = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(carts);
        } catch (error) {
            throw new Error(`Error al obtener los carritos: ${error.message}`);
        }
    }

    async createCart() {
        try {
            const cart = {
                id: uuidv4(),
                products: [],
            };

            const cartsFile = await this.getCarts();
            cartsFile.push(cart);

            await fs.promises.writeFile(this.path, JSON.stringify(cartsFile, null, 2));
            return cart;
        } catch (error) {
            throw new Error(`Error al crear el carrito: ${error.message}`);
        }
    }

    async getCartById(id) {
        try {
            const carts = await this.getCarts();
            return carts.find(cart => cart.id === id) || null;
        } catch (error) {
            throw new Error(`Error al obtener el carrito por ID: ${error.message}`);
        }
    }

    async saveProdToCart(idCart, idProd) {
        try {
            const prodExists = await prodManager.getById(idProd);
            if (!prodExists) throw new Error('El producto no existe');

            const cartsFile = await this.getCarts();

            const cartIndex = cartsFile.findIndex(cart => cart.id === idCart);
            if (cartIndex === -1) throw new Error('El carrito no existe');

            const cart = cartsFile[cartIndex];

            if (!cart.products) {
                cart.products = [];
            }

            const productIndex = cart.products.findIndex(prod => prod.id === idProd);

            if (productIndex === -1) {
                cart.products.push({ id: idProd, quantity: 1 });
            } else {
                cart.products[productIndex].quantity += 1;
            }

            await fs.promises.writeFile(this.path, JSON.stringify(cartsFile, null, 2));

            return cart;
        } catch (error) {
            throw new Error(`Error al agregar producto al carrito: ${error.message}`);
        }
    }
}

export const cartManager = new CartManager(
    path.join(process.cwd(), "src/data/carts.json")
);
