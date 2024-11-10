import { api } from 'boot/axios';

export const Customers = {
    async getCustomers() {
        try {
            const customers = await api.get('/customers/get-all', { withCredentials: true })
            return customers.data;
        } catch (err) {
            throw err;
        }
    },
    async createCustomer(data) {
        try {
            return await api.post('/customers/create-customer', data, {withCredentials: true});
        } catch (err) {
            throw err;
        }
    },
    async updateCustomer(data) {
        try {
            return await api.patch(`/customers/update-customer/${data.id}`, data, { withCredentials: true });
        } catch (err) {
            throw err;
        }
    },
    async deleteCustomer(id) {
        try {
            return await api.delete(`/customers/delete-customer/${id}`, { withCredentials: true });
        } catch (err) {
            throw err;
        }
    }
}
