import { api } from 'boot/axios';
import {ILogin} from 'components/models';

export const auth = {
  static async makeLogin(data: ILogin){
    return new Promise((res, rej) => {
      api.post('/login',data).then((response => res(response))).catch(err => rej(err));
    })
  }
}
