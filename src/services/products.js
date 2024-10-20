import { api } from 'boot/axios';

export const product = {
  async getProducts() {
    try {
      const products = await api.get('/products/get-all', { withCredentials: true })
      return products.data;
    } catch (err) {
      throw err;
    }
  },
  async createProduct(data) {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      };
      return await api.post('/products/create-product', data, config);
    } catch (err) {
      throw err;
    }
  },
  async updateProduct(data) {
    try {
      console.log(data)
      return await api.patch(`/products/update-product/${data.id}`, data, { withCredentials: true });
    } catch (err) {
      throw err;
    }
  },
  async deleteProduct(id) {
    try {
      return await api.delete(`/products/delete-product/${id}`, { withCredentials: true });
    } catch (err) {
      throw err;
    }
  }
}
