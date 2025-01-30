import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getAll() {
        try {
            if (fs.existsSync(this.path)) {
                const products = await fs.promises.readFile(this.path, 'utf8');
                return JSON.parse(products);
            } else {
                return [];
            }
        } catch (error) {
            throw new Error(`Error al obtener los productos: ${error.message}`);
        }
    }

    async create(obj) {
        try {
            const product = {
                id: uuidv4(),
                ...obj,
            };
            const products = await this.getAll();
            products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
            return product;
        } catch (error) {
            throw new Error(`Error al crear el producto: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            const products = await this.getAll();
            const product = products.find((product) => product.id === id);
            if (!product) throw new Error(`Producto con ID ${id} no encontrado`);
            return product;
        } catch (error) {
            throw new Error(`Error al obtener el producto: ${error.message}`);
        }
    }

    async update(id, obj) {
        try {
            const products = await this.getAll();
            const index = products.findIndex((product) => product.id === id);

            if (index === -1) {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }

            products[index] = { ...products[index], ...obj };

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));

            return products[index];
        } catch (error) {
            throw new Error(`Error al actualizar el producto: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const products = await this.getAll();
            const filteredProducts = products.filter((product) => product.id !== id);

            if (products.length === filteredProducts.length) {
                throw new Error(`Producto con ID ${id} no encontrado`);
            }

            await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts, null, 2));

            return { message: `Producto con ID ${id} eliminado correctamente` };
        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
    }
}
export const prodManager = new ProductManager(path.join(process.cwd(), "src/data/products.json"));
