import process from 'process';

const IP = '192.168.124.40';
const RESET_PASSWORD_URL = process.env.NODE_ENV === 'production' ? 'http://localhost:9003/login' : `http://${IP}:9003/login`;
const OLD_CDN_URL = process.env.NODE_ENV === 'production' ? 'http://localhost:3000' : `http://${IP}:3000`;
export default {
  title: 'aphelios-h5',
  rsaPublicKey: '-----BEGIN PUBLIC KEY-----MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAK5oK2YRalfr6OjDcjkrljm0FFIFQ4iA/NYcoqIXkdVkmtTeBrcz+OSx39rOqT8xuuZVuTE++DcTwehr9mb1PmECAwEAAQ==-----END PUBLIC KEY-----',
  resetPasswordUrl: RESET_PASSWORD_URL,
  defaultCdnUrl: `http://${IP}:9000`,
  oldCdnUrl: OLD_CDN_URL,
};
