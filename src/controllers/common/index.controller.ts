import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const getIP = async (ctx) => {
  return new Promise((resolve, reject) => {
    try {
      axios.get('http://ip-api.com/json').then((res) => {
        resolve(res.data);
      });
    } catch (error) {
      resolve({});
    }
  });
};
export const generateClientId = async (ctx) => {
  ctx.success(ctx, uuidv4());
};