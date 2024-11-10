import { api } from 'boot/axios';

export const Requests = {
  async getRequests() {
    try {
      const requests = await api.get('/requests/get-all', { withCredentials: true })
      return requests.data;
    } catch (err) {
      throw err;
    }
  },
  async createRequest(data) {
    try {
      return await api.post('/requests/create-request', data, {withCredentials: true});
    } catch (err) {
      throw err;
    }
  },
  async updateRequest(data) {
    try {
      return await api.patch(`/requests/update-request/${data.id}`, data, { withCredentials: true });
    } catch (err) {
      throw err;
    }
  },
  async deleteRequest(id) {
    try {
      return await api.delete(`/requests/delete-request/${id}`, { withCredentials: true });
    } catch (err) {
      throw err;
    }
  }
}
