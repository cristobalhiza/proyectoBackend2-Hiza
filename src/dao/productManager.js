import Product from './models/product.model.js'

export default class ProductManager {

    static async get(page = 1, limit = 10) {
        try {
            return await Product.paginate({}, { lean: true, page, limit });
        } catch (error) {
            throw new Error('Error obteniendo productos: ' + error.message);
        }
    }

    static async getBy(filter = {}) {
        try {
            return await Product.findOne(filter).lean();
        } catch (error) {
            throw new Error('Error obteniendo producto: ' + error.message);
        }
    }

    static async create(product) {
        try {
            return await Product.create(product);
        } catch (error) {
            if (error.code === 11000 && error.keyPattern && error.keyPattern.code) {
                throw new Error('El código del producto ya existe, elija uno único.');
            }
            throw new Error('Error creando producto: ' + error.message);
        }
    }

    static async update(id, product) {
        try {
            return await Product.findByIdAndUpdate(id, product, { new: true }).lean();
        } catch (error) {
            throw new Error('Error actualizando producto: ' + error.message);
        }
    }

    static async delete(id) {
        try {
            return await Product.findByIdAndDelete(id);
        } catch (error) {
            throw new Error('Error eliminando producto: ' + error.message);
        }
    }
}