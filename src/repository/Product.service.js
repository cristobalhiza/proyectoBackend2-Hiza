import ProductManager from "../dao/productManager.js";

export class ProductService {
    constructor(DAO) {
        this.productDAO = DAO;
    }

    async getProducts(page = 1, limit = 10) {
        try {
            const products = await this.productDAO.get(page, limit);

            return products.docs.map(product => ({
                ...product,
                available: product.stock > 0
            }));
        } catch (error) {
            throw new Error('Error obteniendo productos: ' + error.message);
        }
    }

    async getProductBy(filter) {
        try {
            const product = await this.productDAO.getBy(filter);

            if (product) {
                return {
                    ...product,
                    available: product.stock > 0
                };
            }
            return null;
        } catch (error) {
            throw new Error('Error obteniendo producto: ' + error.message);
        }
    }

    async createProduct(productData) {
        try {
            return await this.productDAO.create(productData);
        } catch (error) {
            if (error.code === 11000 && error.keyPattern && error.keyPattern.code) {
                throw new Error('El código del producto ya existe, elija uno único.');
            }
            throw new Error('Error creando producto: ' + error.message);
        }
    }

    async updateProduct(id, productData) {
        try {
            const updatedProduct = await this.productDAO.update(id, productData);
            if (!updatedProduct) {
                throw new Error('Producto no encontrado.');
            }
            return updatedProduct;
        } catch (error) {
            throw new Error('Error actualizando producto: ' + error.message);
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await this.productDAO.delete(id);
            if (!deletedProduct) {
                throw new Error('Producto no encontrado.');
            }
            return true;
        } catch (error) {
            throw new Error('Error eliminando producto: ' + error.message);
        }
    }
}

export const productService = new ProductService(ProductManager);