import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';
dotenv.config();

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}
const api = axios.create({ baseURL: process.env.BASEURL });
export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
