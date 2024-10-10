import {api} from 'boot/axios';

export const auth = {
  async makeLogin(data) {
    try {
      return await api.post('/auth/login', data);
    } catch (err) {
      throw err;
    }
  }
};
