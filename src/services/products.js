import {api} from 'boot/axios';

export const product = {
  async getProducts(){
    try{
      return await api.get('/products/get-all');
    } catch(err){
      throw err;
    }
  },
  async createProduct(data){
    try{
      return await api.post('/products/create-product', data);
    }catch (err) {
      throw err;
    }
  },
  async updateProduct(data){
    try {
      return await api.post('/products/update-product', data);
    }catch (err) {
      throw err;
    }
  },
  async deleteProduct(id){
    try {
      return await api.delete(`/products/${id}`);
    } catch (err) {
      throw err;
    }
  }

}
