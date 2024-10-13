import {api} from 'boot/axios';

export const auth = {
  async makeLogin(form) {
    try {
      return await api.post('/auth/login', form);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  },
  async logout() {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }
};
