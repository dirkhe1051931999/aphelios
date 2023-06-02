import axios from 'axios';

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
