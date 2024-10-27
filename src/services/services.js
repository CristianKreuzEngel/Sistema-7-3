import { api } from 'boot/axios';

export const Services = {
  async getServices() {
    try {
      const services = await api.get('/services/get-all', { withCredentials: true })
      return services.data;
    } catch (err) {
      throw err;
    }
  },
  async createService(data) {
    try {
      return await api.post('/services/create-service', data, {withCredentials: true});
    } catch (err) {
      throw err;
    }
  },
  async updateService(data) {
    try {
      return await api.patch(`/services/update-order/${data.id}`, data, { withCredentials: true });
    } catch (err) {
      throw err;
    }
  },
  async deleteService(id) {
    try {
      return await api.delete(`/services/delete-order/${id}`, { withCredentials: true });
    } catch (err) {
      throw err;
    }
  }
}
