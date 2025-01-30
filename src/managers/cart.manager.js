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
            throw new Error(error);
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
            const cart = carts.find(cart => cart.id === id);

            return cart || null;
        } catch (error) {
            throw new Error(`Error al obtener el carrito por ID: ${error.message}`);
        }
    }
}

export default CartManager;

