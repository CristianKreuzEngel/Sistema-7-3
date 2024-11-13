import { api } from 'boot/axios';

export const order = {
  async getOrders() {
    try {
      const orders = await api.get('/orders/get-all', { withCredentials: true })
      return orders.data;
    } catch (err) {
      throw err;
    }
  },
  async createOrder(data) {
    try {
      console.log(data)
      return await api.post('/orders/create-order', data, {withCredentials: true});
    } catch (err) {
      throw err;
    }
  },
  async updateOrder(data) {
    try {
      return await api.patch(`/orders/update-order/${data.id}`, data, { withCredentials: true });
    } catch (err) {
      throw err;
    }
  },
  async deleteOrder(id) {
    try {
      return await api.delete(`/orders/delete-order/${id}`, { withCredentials: true });
    } catch (err) {
      throw err;
    }
  }
}
